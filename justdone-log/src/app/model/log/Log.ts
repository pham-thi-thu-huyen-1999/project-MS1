import ILog from './interfaces/ILog'; // eslint-disable-line

class Log {
    _id: string;
    system: string;
    module?: string;
    method: string;
    path?: string;
    description: string;
    status: number;

    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: ILog) {
        if (!model)
            return;

        this._id = model._id && model._id.toString();
        this.system = model.system;
        this.module = model.module;
        this.method = model.method;
        this.path = model.path;
        this.description = model.description;
        this.status = model.status;

        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: ILog[]): Log[] {
        return list && Array.isArray(list) ? list.map(item => new Log(item)) : [];
    }
}

Object.seal(Log);
export default Log;
