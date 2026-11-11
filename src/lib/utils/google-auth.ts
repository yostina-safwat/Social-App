import {OAuth2Client, TokenPayload} from "google-auth-library";
import {AppError} from "../error/error";
import {env} from "../config/env";

const client = new OAuth2Client();

export async function verifyGoogleToken(idToken: string): Promise<TokenPayload | undefined> {
    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: [env.google.webClientId]
        });
        return ticket.getPayload();
    } catch (err) {
        throw new AppError('invalid google token', 403);
    }
}
