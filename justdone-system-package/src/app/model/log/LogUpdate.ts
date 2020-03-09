import ILog from "./interfaces/ILog"; // eslint-disable-line

class LogUpdate {
    ipAddress: string;
    userId?: string;
    productCode: number;
    url: string;
    method: string;
    content?: string;
    description?: string;
    status: number;
    device?: string;

    constructor(model: ILog) {
        if (!model)
            return;

        this.ipAddress = model.ipAddress;
        this.userId = model.userId && !model.userId ? model.userId.toString() : model.userId;
        this.productCode = model.productCode;
        this.url = model.url;
        this.method = model.method;
        this.content = model.content;
        this.description = model.description;
        this.status = model.status;
        this.device = model.device;
    }
}

Object.seal(LogUpdate);
export default LogUpdate;
