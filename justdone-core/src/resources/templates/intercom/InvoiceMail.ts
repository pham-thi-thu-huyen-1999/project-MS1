class InvoiceMailTemplate {
    linkPdf: string = 'https://app.justdone.com.au/public/invoicePDF/';
    result: string;

    constructor(invoiceId) {
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
            <img src="${this.linkPdf + invoiceId + '-0.png'}"><br>
            <a href="${this.linkPdf + invoiceId + '.pdf'}">Download pdf invoice file</a><br>
        </body>
        </html>
        `;
        this.result = template;
    }

    public getTemplate(): string {
        return this.result;
    }
}

Object.seal(InvoiceMailTemplate);
export default InvoiceMailTemplate;
