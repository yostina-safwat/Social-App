import {AppError} from "../error/error";
import jwt from "jsonwebtoken";
import {env} from "../config/env";
import {NextFunction, Request, Response} from "express";
import {TUserPayload} from "../interface/userPayload.interface";
import "../interface/request.interface";

export function authGuard(req: Request, res: Response, next: NextFunction): void {
    try {
        const token = req.cookies.access_token;
        if (!token) throw new AppError('no token provided', 403);
        req.user = jwt.verify(token, env.jwt.accessSecret) as TUserPayload;
        next();
    } catch (error) {
        next(error);
    }
}
