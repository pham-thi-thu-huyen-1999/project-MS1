import ICrunch from './interfaces/ICrunch'; // eslint-disable-line
import {BankType} from '../common/CommonType';

class CrunchCreate {
    userId: any;
    type: BankType;
    month: number;
    year: number;
    accountId: string;
    coaAmounts: any[];
    income?: number;
    amendedAt? :Date;
    startedAt? :Date;
    approvedAt?: Date;
    completedAt?: Date;

    constructor(model: ICrunch) {
        if (!model)
            return;

        this.userId = model.userId;
        this.month = model.month;
        this.year = model.year;
        this.type = model.type;
        this.accountId = model.accountId;
        this.coaAmounts = model.coaAmounts;
        this.income = model.income;
        this.approvedAt = model.approvedAt;
        this.startedAt = model.startedAt;
        this.completedAt = model.completedAt;
        this.amendedAt = model.amendedAt;
    }
}

Object.seal(CrunchCreate);
export default CrunchCreate;
