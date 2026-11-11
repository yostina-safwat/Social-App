import {AppError} from "../../lib/error/error";

export const userNotExist = new AppError('User Not Exists.', 404);
export const userAlreadyExist = new AppError('User Already Exists.', 409);
export const userAlreadyVerified = new AppError('User Already Verified.', 400);
export const userNotVerified = new AppError('User Not Verified', 403);
