const pdf = require('html-pdf');
const PDFImage = require('pdf-image').PDFImage; // eslint-disable-line

export default class PdfHelper {
    static createPdf(template, option, link): Promise<any> {
        return new Promise((resolve, reject) => {
            pdf.create(template, option).toFile(link, (err, res) => {
                if (err)
                    return reject(err);
                resolve(res);
            });
        });
    }
}
