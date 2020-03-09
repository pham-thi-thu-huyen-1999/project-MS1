import IBaseModel from '../../common/interfaces/IBaseModel';
interface IGeneralJournal extends IBaseModel {
    userId: any;
    code: string;
    month: number;
    beginYear: number;
    productId: any;
    note?: string;
}
export default IGeneralJournal;
