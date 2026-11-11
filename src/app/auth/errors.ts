import {AppError} from "../../lib/error/error";

export const otpExpired = new AppError('OTP expired, please resend OTP', 404);
export const invalidCode = new AppError('invalid code', 400);
export const invalidPassword = new AppError('invalid password', 403);
export const invalidCredentials = new AppError('invalid email or password', 403);
export const tooManyAttempts = new AppError('you reach max tries', 429);
