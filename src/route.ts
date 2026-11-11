import {Router} from "express";
import {authRouter} from "./app/auth/route";

export const routes = Router();

routes.use('/auth', authRouter);
