import IBaseModel from '../../common/interfaces/IBaseModel';
interface IBalanceSheetReport extends IBaseModel {
    userId: any;
    csv: string;
    month: number;
    year: number;
}
export default IBalanceSheetReport;
