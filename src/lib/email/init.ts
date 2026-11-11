import {MailjetProvider} from "../../pkg/email/mailjet";
import {env} from "../config/env";
import {NodemailerProvider} from "../../pkg/email/nodemailer";

export const mailjetProvider = new MailjetProvider({
    apiKey: env.mailjet.apiKey,
    apiSecret: env.mailjet.apiSecret,
    fromEmail: env.mailjet.fromEmail,
    fromName: env.mailjet.fromName,
});

export const nodemailerProvider = new NodemailerProvider(env.nodemailer);
