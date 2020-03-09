import ISettingReport from './interfaces/ISettingReport'; // eslint-disable-line

class SettingReport {
    _id: string;
    reportType: number;
    code: number;
    groupId: string;
    isCreditAsPositive: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: ISettingReport) {
        if (!model)
            return;

        this._id = model._id && model._id.toString();
        this.code = model.code;
        this.groupId = model.groupId;
        this.reportType = model.reportType;
        this.isCreditAsPositive = model.isCreditAsPositive;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: ISettingReport[]): SettingReport[] {
        return list && Array.isArray(list) ? list.map(item => new SettingReport(item)) : [];
    }
}

Object.seal(SettingReport);
export default SettingReport;
