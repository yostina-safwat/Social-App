import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {Response} from "express";
import {env} from "../../lib/config/env";
import {toMs} from "../../pkg/utils/time";
import {TUserPayload} from "../../lib/interface/userPayload.interface";

export async function hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return argon2.verify(hashedPassword, password);
}

export function generateAccessToken(payload: TUserPayload): string {
    return jwt.sign(
        payload,
        env.jwt.accessSecret,
        {expiresIn: toMs(1, 'hours')}
    );
}

export function generateRefreshToken(payload: TUserPayload): string {
    return jwt.sign(
        payload,
        env.jwt.refreshSecret,
        {expiresIn: toMs(7, 'days')}
    );
}

export function setCookies(res: Response, accessToken: string, refreshToken: string): void {
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        maxAge: toMs(1, 'hours')
    });
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: toMs(7, 'days'),
        path: '/api/auth/refresh-token'
    });
}
