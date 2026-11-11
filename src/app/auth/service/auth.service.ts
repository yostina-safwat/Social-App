import jwt from "jsonwebtoken";
import {RegisterDto, LoginDto, SendOtpDto, VerifyAccountDto, ResetPasswordDto} from "../dto";
import userRepository, {UserRepository} from "../../user/repository/user.repository";
import {userAlreadyExist, userAlreadyVerified, userNotExist, userNotVerified} from "../../user/errors";
import {invalidCode, invalidCredentials, otpExpired, tooManyAttempts} from "../errors";
import {comparePassword, generateAccessToken, generateRefreshToken, hashPassword} from "../utils";
import {generateOTPCode} from "../../../lib/utils/otp";
import {cacheProvider} from "../../../lib/cache/init";
import {nodemailerProvider} from "../../../lib/email/init";
import {toSeconds} from "../../../pkg/utils/time";
import {MailProvider} from "../../../pkg/email/mail.interface";
import {verifyGoogleToken} from "../../../lib/utils/google-auth";
import {AppError} from "../../../lib/error/error";
import {env} from "../../../lib/config/env";
import {Provider} from "../enum";
import {TUserPayload} from "../../../lib/interface/userPayload.interface";

const MAX_LOGIN_ATTEMPTS = 5;

export class AuthService {
    private readonly sendOtpKey = 'otp:';
    private readonly userRepository: UserRepository = userRepository;
    private readonly mailProvider: MailProvider;

    constructor() {
        this.mailProvider = nodemailerProvider;
    }

    register = async (registerDto: RegisterDto) => {
        // 1. check user existence
        const userExist = await this.userRepository.findByEmail(registerDto.email);
        // 2. if yes, throw an error.
        if (userExist) throw userAlreadyExist;
        // 3. prepare data [hash-password]
        registerDto.password = await hashPassword(registerDto.password);
        // 4. save user into DB -> isVerified: false
        const createdUser = await this.userRepository.create(registerDto);
        // 5. generate and save otp into cache
        const code = generateOTPCode();
        await cacheProvider.set(`${this.sendOtpKey}${createdUser._id.toString()}`, code, toSeconds(3, 'minutes'));
        // 6. send otp by email
        await this.mailProvider.send(registerDto.email, 'verification code', `<h1>Your verification code is ${code}</h1>`);
        return createdUser;
    }

    verifyAccount = async (verifyAccountDto: VerifyAccountDto) => {
        const user = await this.userRepository.findByEmail(verifyAccountDto.email);
        if (!user) throw userNotExist;
        if (user.isVerified === true) throw userAlreadyVerified;
        const cacheCode = await cacheProvider.get(`${this.sendOtpKey}${user._id.toString()}`);
        // not exist >> "otp expired" >> resend otp
        if (!cacheCode) throw otpExpired;
        // exist >> not equal the sent code >> invalid code
        if (cacheCode !== verifyAccountDto.code) throw invalidCode;
        const updatedUser = await this.userRepository.update({email: verifyAccountDto.email}, {isVerified: true});
        await cacheProvider.del(`${this.sendOtpKey}${user._id.toString()}`);
        return updatedUser;
    }

    login = async (loginDto: LoginDto) => {
        const attemptsKey = `${loginDto.email}:login`;
        const cachedAttempt = await cacheProvider.get(attemptsKey);
        if (cachedAttempt === '0') throw tooManyAttempts;

        const user = await this.userRepository.findByEmail(loginDto.email);
        if (!user) throw userNotExist;
        if (!user.isVerified) throw userNotVerified;

        const match = await comparePassword(loginDto.password, user.password);
        if (!match) {
            // decrease the remaining attempts, the counter lives for 3 minutes
            const ttlRemaining = await cacheProvider.ttl(attemptsKey);
            const attempts = cachedAttempt ?? String(MAX_LOGIN_ATTEMPTS);
            const ttl = ttlRemaining === -2 ? toSeconds(3, 'minutes') : ttlRemaining;
            await cacheProvider.set(attemptsKey, String(Number(attempts) - 1), ttl);
            throw invalidCredentials;
        }

        await cacheProvider.del(attemptsKey);
        const accessToken = generateAccessToken({sub: user._id.toString(), userName: user.userName});
        const refreshToken = generateRefreshToken({sub: user._id.toString(), userName: user.userName});
        return {accessToken, refreshToken};
    }

    sendOtp = async (sendOtpDto: SendOtpDto): Promise<void> => {
        const user = await this.userRepository.findByEmail(sendOtpDto.email);
        if (!user) throw userNotExist;
        const code = generateOTPCode();
        await cacheProvider.set(`${this.sendOtpKey}${user._id.toString()}`, code, toSeconds(3, 'minutes'));
        await this.mailProvider.send(sendOtpDto.email, 'new otp', `<p>your new otp is ${code}</p>`);
    }

    resetPassword = async (resetPasswordDto: ResetPasswordDto): Promise<void> => {
        const user = await this.userRepository.findByEmail(resetPasswordDto.email);
        if (!user) throw userNotExist;
        const cacheCode = await cacheProvider.get(`${this.sendOtpKey}${user._id.toString()}`);
        if (!cacheCode) throw otpExpired;
        if (cacheCode !== resetPasswordDto.code) throw invalidCode;
        const password = await hashPassword(resetPasswordDto.newPassword);
        await this.userRepository.update({email: resetPasswordDto.email}, {password});
        await cacheProvider.del(`${this.sendOtpKey}${user._id.toString()}`);
    }

    loginWithGoogle = async (idToken: string) => {
        const payload = await verifyGoogleToken(idToken);
        if (!payload || !payload.email) throw new AppError('no payload provided', 400);

        let user = await this.userRepository.findByEmail(payload.email);
        if (!user) {
            user = await this.userRepository.create({
                userName: payload.name,
                email: payload.email,
                provider: Provider.GOOGLE,
                isVerified: true,
            });
        }
        const tokenPayload = {sub: user._id.toString(), userName: user.userName};
        return {
            accessToken: generateAccessToken(tokenPayload),
            refreshToken: generateRefreshToken(tokenPayload),
        };
    }

    /**
     *
     * @param {*} token  -> refreshToken
     * @returns new accessToken and refreshToken
     */
    refreshTokenFn = async (token: string) => {
        const payload = jwt.verify(token, env.jwt.refreshSecret) as TUserPayload;
        const accessToken = generateAccessToken({sub: payload.sub, userName: payload.userName});
        const refreshToken = generateRefreshToken({sub: payload.sub, userName: payload.userName});
        return {accessToken, refreshToken};
    }
}

// singleton
export default new AuthService();
