import DataHelper from '../../../helpers/DataHelper';
import ErrorCommonData from '../../../resources/errors/ErrorCommonData';
import ErrorYodleeData from '../../../resources/errors/ErrorYodleeData';

export class BaseError {
    code: string;
    message?: string;

    constructor(prefix?: string, codeNum?: number, message?: string) {
        this.code = '';
        if (prefix)
            this.code = prefix;
        if (codeNum)
            this.code += codeNum.toString().padStart(3, '0');
        if (message)
            this.message = message;
    }

    applyParams(params) {
        if (this.message && params && params.length > 0)
            this.message = DataHelper.applyTemplate(this.message, ...params);
    }
};
Object.seal(BaseError);

export class ErrorSystem extends BaseError {
    constructor(message?: string) {
        super('SYS', undefined, message);
        console.log('\x1b[31m', message, '\x1b[0m');
    }
};
Object.seal(ErrorSystem);

export class ErrorCommon extends BaseError {
    constructor(codeNum: number, ...params) {
        super('COM', codeNum);
        this.message = ErrorCommonData[this.code];
        console.log('\x1b[33m', this.message, '\x1b[0m');
        this.applyParams(params);
    }
};
Object.seal(ErrorCommon);

export class ErrorYodlee extends BaseError {
    constructor(codeNum: number, ...params) {
        super('YOD', codeNum);
        this.message = ErrorYodleeData[this.code];
        console.log('\x1b[31m', this.message, '\x1b[0m');
        this.applyParams(params);
    }
};
Object.seal(ErrorYodlee);
