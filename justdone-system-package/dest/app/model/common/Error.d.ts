export declare class BaseError {
    code: string;
    message?: string;
    constructor(prefix?: string, codeNum?: number, message?: string);
    applyParams(params: any): void;
}
export declare class ErrorSystem extends BaseError {
    constructor(message?: string);
}
export declare class ErrorCommon extends BaseError {
    constructor(codeNum: number, ...params: any[]);
}
export declare class ErrorYodlee extends BaseError {
    constructor(codeNum: number, ...params: any[]);
}
