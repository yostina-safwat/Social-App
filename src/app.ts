import express from "express";
import cookieParser from "cookie-parser";
import {routes} from "./route";
import {globalErrorHandler} from "./lib/error/error-handler";

export function createApp() {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use('/api', routes);
    app.use(globalErrorHandler);

    return app;
}
