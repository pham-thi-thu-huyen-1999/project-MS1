import ILog from './interfaces/ILog';
declare class Log {
    _id: string;
    ipAddress: string;
    userId?: string;
    productCode: number;
    url: string;
    method: string;
    content?: string;
    description?: string;
    status: number;
    device?: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(model: ILog);
    static parseArray(list: ILog[]): Log[];
}
export default Log;
