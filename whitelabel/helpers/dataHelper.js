import nodeForge from 'node-forge';
import project from '~/config/project';
import defaultAvatar from '~/assets/images/default-avatar.jpg';
import docFile from '~/assets/images/doc-file-format-symbol-black.svg';
import docxFile from '~/assets/images/docx-file-format-black.svg';
import xlsFile from '~/assets/images/xls-file-format-symbol-black.svg';
import xlsxFile from '~/assets/images/xlsx-file-format-black.svg';
import pdfFile from '~/assets/images/pdf-file-format-symbol-black.svg';

export function convertToCurrency(value, option) {
    if (typeof value !== 'number')
        return '';

    if (!option)
        option = {};
    if (!option.format)
        option.format = 'en-US';
    if (!option.currency)
        option.currency = 'USD';

    return value.toLocaleString(option.format, {style: 'currency', currency: option.currency});
};

function replaceCharAt(index, char, string) {
    return string.slice(0, index) + char + string.slice(index + 1);
}

export function transformText(template, text) {
    if (!template || !text)
        return;

    template = template.toString();
    text = text.toString().replace(/\s/g, '');
    let j = 0;
    for (let i = 0; i < template.length; i++) {
        if (template[i].toLowerCase() === 'x') {
            if (text[j]) {
                template = replaceCharAt(i, text[j], template);
                j += 1;
            }
            else {
                template = template.slice(0, i);
                break;
            }
        }
    }
    return template;
};

export function transformDigit(value) {
    if (!value)
        return;

    return value.toString().replace(/\D/g, '');
};

function encrypt(publicPem, keyAlias, cryptText) {
    let publicKey = nodeForge.pki.publicKeyFromPem(publicPem);
    let buffer = nodeForge.util.createBuffer(cryptText, 'utf8');
    let bytes = buffer.getBytes();
    let encrypted = publicKey.encrypt(bytes, 'RSAES-PKCS1-V1_5');
    return keyAlias + ':' + nodeForge.util.bytesToHex(encrypted);
}

export function encryptFormData(loginForm, keyPem, keyAlias) {
    loginForm = loginForm.map(form => {
        if (form.field[0].value !== '') {
            form.field[0].value = encrypt(keyPem, keyAlias, form.field[0].value);
        }
        return form;
    });
    loginForm = loginForm.filter(form => {
        return form.field[0].value !== '';
    });
    return loginForm;
};

export function getMonthByFinancialYear(beginYear, endYear, monthBegin) {
    let now = new Date();
    let arr = [];
    let month = monthBegin - 1;
    let i = 1;
    let year = endYear;

    while (i <= 12) {
        if (month === 0) {
            month = 12;
            year = beginYear;
        }
        if (new Date(now.getFullYear(), now.getMonth(), 0) >= new Date(year, month - 1, 0)) {
            arr.push({
                month: month,
                year: year
            });
        }
        month--;
        i++;
    }
    return arr;
};

export function getAllMonthByFinancialYear(beginYear, endYear, monthBegin) {
    let arr = [];
    let month = monthBegin;
    let i = 1;
    let year = beginYear;

    while (i <= 12) {
        if (month === 13) {
            month = 1;
            year = endYear;
        }
        arr.push({
            month: month,
            year: year
        });
        month++;
        i++;
    }
    return arr;
};

export function getFinancialYears(beginMonth) {
    let list = [];
    let date = new Date();
    let month = date.getMonth() + 1;
    let fromYear = 2016;
    // let toYear = date.getFullYear();
    let toYear = month < beginMonth ? date.getFullYear() : date.getFullYear() + 1;

    for (let year = toYear; year > fromYear; year--) {
        list.push({begin: year - 1, end: year});
    }
    return list;
};

export function getImageByResource(link) {
    let extension = link && link.indexOf('.') !== -1 ? link.substr(link.lastIndexOf('.')) : '';
    let imageExtensions = ['.jpg', '.jpeg', '.png'];

    if (imageExtensions.indexOf(extension) !== -1) {
        return link;
    }
    else if (extension === '.doc')
        return docFile;
    else if (extension === '.docx')
        return docxFile;
    else if (extension === '.xls')
        return xlsFile;
    else if (extension === '.xlsx')
        return xlsxFile;
    else if (extension === '.pdf')
        return pdfFile;
    return defaultAvatar;
};

export function mapUrlGoogleStorage(url) {
    if (url)
        return project.storageBaseUrl + url;
    return '';
};

export function checkFinancialYear(config, start, end) {
    if (start >= config) {
        if (end >= start && end <= 12)
            return true;
        else if (end < config && end >= 1)
            return true;
        else
            return false;
    }
    else if (start < config) {
        if (end >= start && end < config)
            return true;
        else
            return false;
    }
    else
        return false;
};

export function Themes(value) {
    switch (value) {
    case 1:
        return 'theme-white';
    case 2:
        return 'theme-second';
    }
};
