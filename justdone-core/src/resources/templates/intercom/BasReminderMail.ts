import Project from '../../../config/Project';

class BasReminderMailTemplate {
    name: string;
    message: string;
    link?: any;
    result: string;

    constructor(name: string, message: string, link?: any) {
        this.name = name;
        this.message = message;
        this.message = this.message.replace(/\n/g, '<br />');
        this.link = link;

        if (link.infoFile) {
            this.link.fileUrl = link.fileUrl;
        }
        else {
            this.link = {};
            this.link.fileUrl = undefined;
        };

        let eleLink = this.link.fileUrl ? `<p><b>File: </b>${this.link.infoFile.name}<br/><b>Link: </b>${this.link.fileUrl}</p>` : '';
        const template: string = `
        <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="initial-scale=1.0">
            <meta name="format-detection" content="telephone=no">
            <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
            <meta name="x-apple-disable-message-reformatting">
            <title></title>
        </head>
        <body>
            <img src="${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/img/justdone-logo.svg" alt="logo image"><br>
            <p>Hi ${this.name}</p>
            <p> ${this.message} </p>
            ${eleLink}
        </body>
        </html>
        `;
        this.result = template;
    }

    public getTemplate(): string {
        return this.result;
    }
}

Object.seal(BasReminderMailTemplate);
export default BasReminderMailTemplate;
