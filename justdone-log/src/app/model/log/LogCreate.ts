import ILog from './interfaces/ILog'; // eslint-disable-line

class LogCreate {
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

    static parseArray(list: ILog[]): LogCreate[] {
        return list && Array.isArray(list) ? list.map(item => new LogCreate(item)) : [];
    }
}

Object.seal(LogCreate);
export default LogCreate;
