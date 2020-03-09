import IBaseModel from '../../common/interfaces/IBaseModel';
interface ILog extends IBaseModel {
    ipAddress: string;
    userId?: string;
    productCode: number;
    url: string;
    method: string;
    content?: string;
    description?: string;
    status: number;
    device?: string;
}
export default ILog;
