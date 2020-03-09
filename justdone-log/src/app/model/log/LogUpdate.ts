import ILog from './interfaces/ILog'; // eslint-disable-line

class LogUpdate {
    system: string;
    module?: string;
    method: string;
    path?: string;
    description: string;
    status: number;

    constructor(model: ILog) {
        if (!model)
            return;

        this.system = model.system;
        this.module = model.module;
        this.method = model.method;
        this.path = model.path;
        this.description = model.description;
        this.status = model.status;
    }

    static parseArray(list: ILog[]): LogUpdate[] {
        return list && Array.isArray(list) ? list.map(item => new LogUpdate(item)) : [];
    }
}

Object.seal(LogUpdate);
export default LogUpdate;
