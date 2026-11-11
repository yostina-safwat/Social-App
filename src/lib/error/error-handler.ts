import {AppError} from "./error";
import {NextFunction, Request, Response} from "express";

export function globalErrorHandler(err: AppError, req: Request, res: Response, _next: NextFunction) {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            message: err.message,
            success: false,
        });
    }
    console.log(err);
    return res.status(500).json({
        message: 'Something went wrong', success: false,
    });
}
