import Project from '../../../config/Project';

class ForgetPasswordMailTemplate {
    forgotKey: string;
    link: string;
    template: string;

    constructor(data: any) {
        if (data.productType === 'PRECIS') {
            this.link = `${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/reset-password?keytoken=` + (data.forgotKey.key ? data.forgotKey.key : '');
        }
        else {
            this.link = '';
        }

        this.template = ` 
        <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="initial-scale=1.0">
            <meta name="format-detection" content="telephone=no">
            <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
            <meta name="x-apple-disable-message-reformatting">
            <title></title>
            <style type="text/css">
            .link-forget {
                background-color: #23527c;
                display: inline-block;
                color: white;
                padding: 10px 20px;
            }
            </style>
        </head>
        <body>
            <img src="${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/img/justdone-logo.svg" alt="logo image"><br>
            <p>Hi ${data.firstName ? data.lastName : ''}</p>
            <p>We've received a request to reset your password. If you didn't make the request, just ignore this email. Otherwise, you can reset your password using this link: </p>
            <a class="link-forget" href="${this.link}">Click here to reset your password</a>
            <br/>
            Or copy the link : <br/>
            ${this.link}
 
            <br/><br/>
            <p>Gavin</p>
            <p>Founder & CEO</p>
        </body>
        </html>
        `;
    }

    public getTemplate(): string {
        return this.template;
    }
}

Object.seal(ForgetPasswordMailTemplate);
export default ForgetPasswordMailTemplate;
