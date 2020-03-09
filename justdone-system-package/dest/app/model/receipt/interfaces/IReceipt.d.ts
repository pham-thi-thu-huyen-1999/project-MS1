import IBaseModel from '../../common/interfaces/IBaseModel';
interface IReceipt extends IBaseModel {
    userId: any;
    fileId: any;
    year: number;
    month: number;
    day: number;
    total: number;
    currency: string;
}
export default IReceipt;
