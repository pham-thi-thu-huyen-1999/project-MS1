"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pdf = require('html-pdf');
const PDFImage = require('pdf-image').PDFImage;
class PdfHelper {
    static createPdf(template, option, link) {
        return new Promise((resolve, reject) => {
            pdf.create(template, option).toFile(link, (err, res) => {
                if (err)
                    return reject(err);
                resolve(res);
            });
        });
    }
}
exports.default = PdfHelper;
