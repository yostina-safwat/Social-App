import {createTransport, Transporter} from 'nodemailer';
import {MailProvider} from "./mail.interface";

interface INodemailerConfig {
    host: string;
    port: number;
    user: string;
    pass: string;
    fromEmail: string;
}

export class NodemailerProvider implements MailProvider {
    private client: Transporter;
    private readonly fromEmail: string;

    constructor(config: INodemailerConfig) {
        this.client = createTransport({
            host: config.host,
            port: config.port,
            secure: false,
            auth: {
                user: config.user,
                pass: config.pass,
            }
        });
        this.fromEmail = config.fromEmail;
    }

    async send(email: string, subject: string, html: string): Promise<void> {
        await this.client.sendMail({
            from: this.fromEmail,
            to: email,
            subject: subject,
            html: html,
        });
    }
}
