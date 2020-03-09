export function convertMonthToWord(month) {
    if (month >= 1 && month <= 12) {
        let words = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return words[month - 1];
    }
    return 'None';
};

export function convertFinancial(month, year) {
    let words = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (month >= 1 && month <= 12) {
        let yearx = month < 7 ? +year + 1 : year;
        return words[month - 1] + ' - ' + yearx;
    }
    return 'None';
};

export function convertToString(date, option) {
    if (date) {
        option = checkDateOptions(option);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], option);
    }
    return '';
};

export function convertToDateString(date, option) {
    if (date) {
        return new Date(date).toLocaleDateString([], option);
    }
    return '';
};

export function convertToTimeString(date, option) {
    if (date) {
        option = checkDateOptions(option);
        return date.toLocaleTimeString([], option);
    }
    return '';
};

export function getListMonthName(begin, end, month) {
    let date = new Date();
    let monthCurrent = date.getMonth() + 1;
    let yearCurrent = date.getFullYear();
    let position;
    let list = [{month: 1, name: 'January', year: null, allow: true}, {month: 2, name: 'February', year: null, allow: true}, {month: 3, name: 'March', year: null, allow: true}, {month: 4, name: 'April', year: null, allow: true}, {month: 5, name: 'May', year: null, allow: true}, {month: 6, name: 'June', year: null, allow: true}, {month: 7, name: 'July', year: null, allow: true}, {month: 8, name: 'August', year: null, allow: true}, {month: 9, name: 'September', year: null, allow: true}, {month: 10, name: 'October', year: null, allow: true}, {month: 11, name: 'November', year: null, allow: true}, {month: 12, name: 'December', year: null, allow: true}];

    for (let i = 0; i < list.length; i++) {
        if (list[i].month === month) {
            position = i;
            break;
        }
    }
    let listPart1 = list.slice(0, position);
    let listPart2 = list.slice(position, list.length);

    if (yearCurrent > begin) {
        listPart2.forEach(item => {
            item.allow = true;
        });
        listPart1.forEach(item => {
            if (item.month < monthCurrent)
                item.allow = true;
            else
                item.allow = false;
        });
    }
    else {
        listPart1.forEach(item => {
            item.allow = false;
        });
        listPart2.forEach(item => {
            if (item.month < monthCurrent)
                item.allow = true;
            else
                item.allow = false;
        });
    }

    let result = listPart2.concat(listPart1);
    for (let item of result) {
        if (item.month < month)
            item.year = end;
        else
            item.year = begin;
    }
    return result;
};

export function timeFromNow(date) {
    let seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let time = new Date(date);

    let result = Math.floor(seconds / 86400);
    if (result >= 2)
        return formatSingleDigitNumber(time.getDate()) + '/' + formatSingleDigitNumber(Number(time.getMonth() + 1)) + '/' + time.getFullYear();

    if (result >= 1 && result < 2)
        return 'Yesterday';

    result = Math.floor(seconds / 3600);
    if (result >= 1)
        return result + ' hours';

    result = Math.floor(seconds / 60);
    if (result > 1)
        return result + ' minutes';

    if (seconds > 60)
        return 1 + ' minutes';

    return Math.floor(seconds) + ' seconds';
};

export function formatDate(date) {
    if (!date)
        return undefined;

    let result = new Date(date);
    return formatSingleDigitNumber(result.getDate()) + '/' + formatSingleDigitNumber(result.getMonth() + 1) + '/' + result.getFullYear();
}

export function formatDateCover(date, month, year) {
    if (!date && !month && !year)
        return undefined;

    return year + '/' + month + '/' + date;
}

export function checkMonth(month) {
    let arrMonth = [1, 3, 5, 7, 8, 10, 12];
    let type1 = arrMonth.indexOf(month);
    let result;

    if (month === 2) {
        result = 3;
        return result;
    }

    if (type1 === 1) {
        result = 1;
        return result;
    }
    else {
        result = 2;
        return result;
    }
}

export function formatTime(time) {
    if (!time)
        return undefined;

    let result = new Date(time);
    return ('0' + result.getHours()).slice(-2) + ':' + ('0' + result.getMinutes()).slice(-2) + ':' + ('0' + result.getSeconds()).slice(-2);
}

export function listYears(endYear) {
    let startYear = 2017;
    let list = [];
    if (!endYear || endYear <= startYear)
        endYear = (new Date()).getFullYear();

    for (let i = startYear; i <= endYear; i++) {
        list.push({name: '', financial: i + ' - ' + (i + 1), year: i});
    }

    return list;
}

export function listYear(endYear) {
    let startYear = 2017;
    let list = [];
    if (!endYear || endYear <= startYear)
        endYear = (new Date()).getFullYear() + 10;

    for (let i = startYear; i <= endYear; i++) {
        list.push(i);
    }

    return list;
}

function formatSingleDigitNumber(number) {
    if (isNaN(number))
        return undefined;
    return ('0' + number).slice(-2);
}

function checkDateOptions(option) {
    if (!option)
        option = {};
    if (!option.hour12)
        option.hour12 = false;

    return option;
};
