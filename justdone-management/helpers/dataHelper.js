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

export function getArrayMonthByFinancialYear(monthBegin) {
    let i = monthBegin;
    let j = 0;
    let arr = [];
    while (j < 12) {
        if (i === 12) {
            arr.push(i);
            i = 0;
        }
        else {
            arr.push(i);
        }
        i++;
        j++;
    }
    return arr;
};

function replaceCharAt(index, char, string) {
    return string.slice(0, index) + char + string.slice(index + 1);
}

export function transformText(template, text) {
    if (!template || !text)
        return;

    template = template.toString();
    text = text.toString();

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
}

export function transformDigit(value) {
    if (!value)
        return;

    return value.toString().replace(/\D/g, '');
}

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

function encrypt(publicPem, keyAlias, cryptText) {
    let publicKey = nodeForge.pki.publicKeyFromPem(publicPem);
    let buffer = nodeForge.util.createBuffer(cryptText, 'utf8');
    let bytes = buffer.getBytes();
    let encrypted = publicKey.encrypt(bytes, 'RSAES-PKCS1-V1_5');
    return keyAlias + ':' + nodeForge.util.bytesToHex(encrypted);
}

export function encryptFormData(loginForm, keyPem, keyAlias) {
    loginForm = loginForm.map(form => {
        if (!form.field[0].isOptional && form.field[0].value !== '') {
            form.field[0].value = encrypt(keyPem, keyAlias, form.field[0].value);
        }
        return form;
    });
    loginForm = loginForm.filter(form => {
        return form.field[0].value !== '';
    });
    return loginForm;
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

export function getFinancialYearsNew(financialYear) {
    let list = [];
    let date = new Date();
    let month = date.getMonth() + 1;
    let beginMonth = 6;
    let fromYear = financialYear;
    // let toYear = date.getFullYear();
    let toYear = month < beginMonth ? date.getFullYear() : date.getFullYear() + 1;

    for (let year = toYear; year > fromYear; year--) {
        list.push({begin: year - 1, end: year});
    }
    return list;
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
}
function isLower(character) {
    return (character !== character.toLowerCase()) && (character === character.toUpperCase());
}
export function convertNameProduct(product) {
    if (!product)
        return;
    let characters = product.split('');
    let position = [];
    let name = '';
    for (let i = 1; i < characters.length; i++) {
        if (isLower(characters[i]))
            position.push(i);
    }

    for (let i = 0; i < characters.length; i++) {
        if (position.find(index => index === i))
            name = name + ' ' + characters[i];
        else
            name = name + characters[i];
    }
    return name;
}
export function convertToSecret(value) {
    if (!value)
        return;
    let string = 'xxxx' + value.slice(-3).toString();
    return string;
}
export function changeParam(name, value) {
    // New
    let storage;
    if (localStorage.params) {
        storage = JSON.parse(localStorage.params);
    }
    else {
        storage = [];
    }

    if (storage.length) {
        let exist = storage.findIndex(item => item.name === name);
        if (exist >= 0)
            storage[exist].value = value;
        else storage.push({name: name, value: value});
    }
    else {
        storage.push({name: name, value: value});
    }

    localStorage.params = JSON.stringify(storage);

    // Old
    let urlNew;

    if (window.location.search) {
        if (!window.location.search.includes(name + '=')) {
            urlNew = window.location.href + '&' + name + '=' + value;
        }
        else {
            let param = new URLSearchParams(window.location.search);
            param.set(name, value);
            urlNew = window.location.pathname + '?' + param;
        }
    }
    else urlNew = window.location.href + '?' + name + '=' + value;

    window.history.pushState({path: urlNew}, '', urlNew);
}
// page search use all
export function changePageSearch(name, value) {
    // New
    let storage;
    if (localStorage.page) {
        storage = JSON.parse(localStorage.page);
    }
    else {
        storage = [];
    }

    if (storage.length) {
        let exist = storage.findIndex(item => item.name === name);
        if (exist >= 0)
            storage[exist].value = value;
        else storage.push({name: name, value: value});
    }
    else storage.push({name: name, value: value});

    localStorage.page = JSON.stringify(storage);
    // Old
    let urlNew;

    if (window.location.search) {
        if (!window.location.search.includes(name + '=')) {
            urlNew = window.location.href + '&' + name + '=' + value;
        }
        else {
            let page = new URLSearchParams(window.location.search);
            page.set(name, value);
            urlNew = window.location.pathname + '?' + page;
        }
    }
    else urlNew = window.location.href + '?' + name + '=' + value;

    window.history.pushState({path: urlNew}, '', urlNew);
}

// page search use for client-management
export function changePageManagementSearch(name, value) {
    // New
    let storage;
    if (localStorage.pageManagement) {
        storage = JSON.parse(localStorage.pageManagement);
    }
    else {
        storage = [];
    }

    if (storage.length) {
        let exist = storage.findIndex(item => item.name === name);
        if (exist >= 0)
            storage[exist].value = value;
        else storage.push({name: name, value: value});
    }
    else storage.push({name: name, value: value});

    localStorage.pageManagement = JSON.stringify(storage);
    // Old
    let urlNew;

    if (window.location.search) {
        if (!window.location.search.includes(name + '=')) {
            urlNew = window.location.href + '&' + name + '=' + value;
        }
        else {
            let pageManagement = new URLSearchParams(window.location.search);
            pageManagement.set(name, value);
            urlNew = window.location.pathname + '?' + pageManagement;
        }
    }
    else urlNew = window.location.href + '?' + name + '=' + value;

    window.history.pushState({path: urlNew}, '', urlNew);
}

export function formatMoney(amount) {
    const fixedAmount = parseFloat(amount).toFixed(2);
    return `$${Math.abs(fixedAmount)}`;
}
