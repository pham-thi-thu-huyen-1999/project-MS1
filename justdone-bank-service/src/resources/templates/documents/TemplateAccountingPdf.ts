import Project from '../../../config/Project';
class TemplateAccountingPdf {
    htmlString: string;
    result: string;

    constructor(htmlString: string) {
        this.htmlString = htmlString;

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
          <style>
            @font-face {
              font-family: 'SignericaFat';
              src: url('${Project.SERVER.INTEGRATION.PROTOTYPE}://${Project.SERVER.INTEGRATION.DOMAIN}/fonts/SignericaFat/SignericaFat.eot');
              src: url('${Project.SERVER.INTEGRATION.PROTOTYPE}://${Project.SERVER.INTEGRATION.DOMAIN}/fonts/SignericaFat/SignericaFat.eot?#iefix') format('embedded-opentype'), 
              url('${Project.SERVER.INTEGRATION.PROTOTYPE}://${Project.SERVER.INTEGRATION.DOMAIN}/fonts/SignericaFat/SignericaFat.woff2') format('woff2'), 
              url('${Project.SERVER.INTEGRATION.PROTOTYPE}://${Project.SERVER.INTEGRATION.DOMAIN}/fonts/SignericaFat/SignericaFat.woff') format('woff'), 
              url('${Project.SERVER.INTEGRATION.PROTOTYPE}://${Project.SERVER.INTEGRATION.DOMAIN}/fonts/SignericaFat/SignericaFat.ttf') format('truetype'), 
              url('${Project.SERVER.INTEGRATION.PROTOTYPE}://${Project.SERVER.INTEGRATION.DOMAIN}/fonts/SignericaFat/SignericaFat.svg#svgFontName') format('svg');
            }
            @media print {
              .box-content {
                border: 0;
                padding: 0px 30px;
              }
              .box-content > img {
                width: 100%;
                max-width: 100%;
                border: 0;
              }
            }
            .box-content .up-signature {
              margin-bottom: 0px;
              height: 125px;
              position: relative;
            }
            .box-content .up-signature .textSignature {
              font-family: SignericaFat !important;
              font-size: 12px;
              position: absolute;
              text-align: center;
            }
            .box-content .up-signature .textSignature img {
              max-width: 100%;
              position: relative;
              max-height: 100px;
            }
            .box-content .up-signature .label-form {
              margin-top: 10px;
              font-family: 'CircularStd-Medium', sans-serif;
              font-size: 9px;
              font-weight: normal;
              line-height: 1.33;
              letter-spacing: 1px;
              color: #9fa3b1;
              text-transform: uppercase;
              display: block;
            }
          </style>
        </head>
        <body>
            ${this.htmlString}
        </body>
        </html>
        `;
        this.result = template;
    }

    public getTemplate(): string {
        return this.result;
    }
}

Object.seal(TemplateAccountingPdf);
export default TemplateAccountingPdf;
