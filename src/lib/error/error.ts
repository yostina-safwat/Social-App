export class AppError extends Error {
    constructor(message: string, public statusCode: number, public isOperational: boolean = true) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}
