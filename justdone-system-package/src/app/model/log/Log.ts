import ILog from './interfaces/ILog'; // eslint-disable-line

class Log {
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

    constructor(model: ILog) {
        if (!model)
            return;

        this._id = model._id && model._id.toString();
        this.ipAddress = model.ipAddress;
        this.userId = model.userId && !model.userId ? model.userId.toString() : model.userId;
        this.productCode = model.productCode;
        this.url = model.url;
        this.method = model.method;
        this.content = model.content;
        this.description = model.description;
        this.status = model.status;
        this.device = model.device;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: ILog[]): Log[] {
        return list && Array.isArray(list) ? list.map(item => new Log(item)) : [];
    }
}

Object.seal(Log);
export default Log;
