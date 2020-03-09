import IBaseModel from '../../common/interfaces/IBaseModel';
interface IReportSetting extends IBaseModel {
    reportType: number;
    code: number;
    groupId: string;
    isCreditAsPositive: boolean;
}
export default IReportSetting;
