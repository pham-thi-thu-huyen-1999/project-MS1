import ILog from "./interfaces/ILog";
declare class LogUpdate {
    ipAddress: string;
    userId?: string;
    productCode: number;
    url: string;
    method: string;
    content?: string;
    description?: string;
    status: number;
    device?: string;
    constructor(model: ILog);
}
export default LogUpdate;
