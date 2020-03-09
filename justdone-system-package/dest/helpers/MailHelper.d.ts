declare class MailHelper {
    static sendMailAdvanced(fromData: any, toData: any, subject: string, html: string): Promise<boolean>;
    static loadMailTemplate(path: any, param: any): string;
    static checkRealEmail(email: string): Promise<boolean>;
}
export default MailHelper;
