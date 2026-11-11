import {config} from "dotenv";
import {z} from "zod";

config();

const schema = z.object({
    PORT: z.string().default('3000'),
    MONGODB_URL: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    MAIL_USER: z.string().trim().toLowerCase(),
    MAIL_PASSWORD: z.string(),
    GOOGLE_WEB_OAUTH_CLIENT_ID: z.string(),
    REDIS_PORT: z.string().default('6379'),
    REDIS_HOST: z.string(),
    REDIS_PASSWORD: z.string().default(''),
    MAILJET_API_KEY: z.string(),
    MAILJET_API_SECRET: z.string(),
    MAILJET_FROM_EMAIL: z.string(),
    MAILJET_FROM_NAME: z.string(),
});

const parsed = schema.parse(process.env);

export const env = {
    port: Number(parsed.PORT),
    db: {
        url: parsed.MONGODB_URL,
    },
    redis: {
        host: parsed.REDIS_HOST,
        port: Number(parsed.REDIS_PORT),
        password: parsed.REDIS_PASSWORD,
    },
    nodemailer: {
        host: 'smtp.gmail.com',
        port: 587,
        user: parsed.MAIL_USER,
        pass: parsed.MAIL_PASSWORD,
        fromEmail: parsed.MAIL_USER,
    },
    mailjet: {
        apiKey: parsed.MAILJET_API_KEY,
        apiSecret: parsed.MAILJET_API_SECRET,
        fromEmail: parsed.MAILJET_FROM_EMAIL,
        fromName: parsed.MAILJET_FROM_NAME,
    },
    jwt: {
        accessSecret: parsed.JWT_ACCESS_SECRET,
        refreshSecret: parsed.JWT_REFRESH_SECRET
    },
    google: {
        webClientId: parsed.GOOGLE_WEB_OAUTH_CLIENT_ID,
    },
};
