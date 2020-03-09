"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
const ErrorCommonData_1 = require("../../../resources/errors/ErrorCommonData");
const ErrorYodleeData_1 = require("../../../resources/errors/ErrorYodleeData");
class BaseError {
    constructor(prefix, codeNum, message) {
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
            this.message = DataHelper_1.default.applyTemplate(this.message, ...params);
    }
}
exports.BaseError = BaseError;
;
Object.seal(BaseError);
class ErrorSystem extends BaseError {
    constructor(message) {
        super('SYS', undefined, message);
        console.log('\x1b[31m', message, '\x1b[0m');
    }
}
exports.ErrorSystem = ErrorSystem;
;
Object.seal(ErrorSystem);
class ErrorCommon extends BaseError {
    constructor(codeNum, ...params) {
        super('COM', codeNum);
        this.message = ErrorCommonData_1.default[this.code];
        console.log('\x1b[33m', this.message, '\x1b[0m');
        this.applyParams(params);
    }
}
exports.ErrorCommon = ErrorCommon;
;
Object.seal(ErrorCommon);
class ErrorYodlee extends BaseError {
    constructor(codeNum, ...params) {
        super('YOD', codeNum);
        this.message = ErrorYodleeData_1.default[this.code];
        console.log('\x1b[31m', this.message, '\x1b[0m');
        this.applyParams(params);
    }
}
exports.ErrorYodlee = ErrorYodlee;
;
Object.seal(ErrorYodlee);
