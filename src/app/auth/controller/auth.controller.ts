import {NextFunction, Request, Response} from "express";
import authService, {AuthService} from "../service/auth.service";
import {AppError} from "../../../lib/error/error";
import {setCookies} from "../utils";

class AuthController {
    private authService: AuthService = authService;

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.register(req.body);
            res.status(201).json({message: 'User created successfully', success: true, data: user});
        } catch (error) {
            next(error);
        }
    }

    verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.verifyAccount(req.body);
            res.status(200).json({message: 'Account verified successfully', success: true});
        } catch (error) {
            next(error);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {accessToken, refreshToken} = await this.authService.login(req.body);
            setCookies(res, accessToken, refreshToken);
            res.status(200).json({message: 'Logged in successfully', success: true});
        } catch (error) {
            next(error);
        }
    }

    sendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.sendOtp(req.body);
            res.status(200).json({message: 'OTP sent successfully', success: true});
        } catch (error) {
            next(error);
        }
    }

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.resetPassword(req.body);
            res.status(200).json({message: 'Password reset successfully', success: true});
        } catch (error) {
            next(error);
        }
    }

    loginWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {accessToken, refreshToken} = await this.authService.loginWithGoogle(req.body.idToken);
            setCookies(res, accessToken, refreshToken);
            res.status(200).json({message: 'Logged in successfully', success: true});
        } catch (error) {
            next(error);
        }
    }

    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies.refresh_token;
            if (!token) throw new AppError('no token provided', 403);
            const {accessToken, refreshToken} = await this.authService.refreshTokenFn(token);
            setCookies(res, accessToken, refreshToken);
            res.status(200).json({message: 'Token refreshed successfully', success: true});
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
