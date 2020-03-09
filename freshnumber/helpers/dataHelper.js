import nodeForge from 'node-forge';
import crypto from 'crypto';
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

export function encryptFormCheck(loginForm) {
    let result = loginForm.map(form => {
        if (!form.field[0].isOptional && form.field[0].value !== '') {
            form.field[0].value = encryptText(JSON.stringify(form.field[0].value));
        }
        return form;
    });
    result = result.filter(form => {
        return form.field[0].value !== '';
    });
    return result;
}

function encryptText(text) {
    let god =
    `-----BEGIN PUBLIC KEY-----
    MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAvJTW2o9qRq9r0xhOFGv8
    Dug/LzU18Wl98WdYiuWAkITyvmkCBSgHJqtPFAHRB/ioABrk+HHEenpiP6IHE7u2
    bNIDVRVNlZADz0BnikalleYvumRcL679k23yVsp+jTxpz2gJ7x4ZBtYNGub6Kn2B
    9CTWLvI+5nkguYroXKyiOKGX4TLm4ONBUpO3tJ64Nps50jqeN/Ioi9c3YYZXZzjv
    fOanNTBPrpn3Zh8EtPAc0xCqjHXEcdma29kjWCFpmFossIW0uzL1H7rHKZTik1r4
    EqGrByCHWPdt0+BCbEYiwQKVoNV8VbvffOh9RcGHRFnnO2vzmCO6JqrjEsnYtFuL
    go5F7Nn2ujXIMtOPNUD+S4fQLVEzJgPcRBHPCfmttSXZK29XURV7T3Z/gqkrrTvo
    oVd3ianU8UmMkY2FuxclzLPWMEIBv3iH4jCBWm58r1JI00/GKTdHLmxhiCD0xuCD
    DGb9GzEanzhYN51ITsrmP6l32djeVMD0d4Mri8kNYVxjvXjPHznhwkKR5zfv7vZD
    UEGTWVYBgiIWNMZTaHFtSjsS3ghh9QhB1n5v9vy0zx8koUswGqTm/NJFkAPi7eQ9
    sdUkeR7McVXA8WnpLYpiHkOtgKmtHZmCEM3326raedvtl85ZhEJFGB416Nzymgm5
    FvlYGUPEiDOfBF2HmTXO+n0CAwEAAQ==
-----END PUBLIC KEY-----
    `;
    var buffer = Buffer.from(text);
    var encrypted = crypto.publicEncrypt(god, buffer);
    return encrypted.toString('base64');
}

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
