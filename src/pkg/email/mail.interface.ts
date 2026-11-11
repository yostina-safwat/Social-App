export interface MailProvider {
    send(email: string, subject: string, html: string): Promise<void>;
}
