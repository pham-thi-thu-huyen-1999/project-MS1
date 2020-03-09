import Project from '../../../config/Project';
class WelcomeEmailTemplate {
    name: string;
    result: string;

    constructor(fullname: string) {
        this.name = fullname;
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
            <img src="${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/img/justdone-logo.svg" alt="logo image"><br/><br/>
            
            <p>Congratulations ${this.name}! </p>
            <p>You are one step closer to slick, tidy finances. You've successfully created an account on our system and we wish you the best for your business and memories with Justdone.</p>
            <p>The Just Done Team</p>

        </body>
        </html>
        `;
        this.result = template;
    }

    public getTemplate(): string {
        return this.result;
    }
}

Object.seal(WelcomeEmailTemplate);
export default WelcomeEmailTemplate;
