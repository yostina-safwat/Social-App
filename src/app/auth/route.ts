import {Router} from "express";
import authController from "./controller/auth.controller";

export const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/verify-account', authController.verifyAccount);
authRouter.post('/login', authController.login);
authRouter.post('/send-otp', authController.sendOtp);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.post('/login-google', authController.loginWithGoogle);
authRouter.post('/refresh-token', authController.refreshToken);
