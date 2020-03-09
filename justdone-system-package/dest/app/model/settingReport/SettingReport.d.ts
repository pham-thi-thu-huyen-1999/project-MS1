import ISettingReport from './interfaces/ISettingReport';
declare class SettingReport {
    _id: string;
    reportType: number;
    code: number;
    groupId: string;
    isCreditAsPositive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(model: ISettingReport);
    static parseArray(list: ISettingReport[]): SettingReport[];
}
export default SettingReport;
