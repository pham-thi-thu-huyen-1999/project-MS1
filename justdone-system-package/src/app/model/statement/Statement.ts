import IStatement from './interfaces/IStatement'; // eslint-disable-line
import {BankType} from '../common/CommonType';
import DataHelper from '../../../helpers/DataHelper';

class Statement {
    _id: string;
    userId: any;
    month: number;
    year: number;
    type: BankType;
    accountId: string;
    openBalance: number;
    closeBalance: number;
    transactionFailed?: boolean;
    manualStatement?: boolean;

    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IStatement) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.userId = DataHelper.handleIdDataModel(model.userId);
        this.month = model.month;
        this.year = model.year;
        this.type = model.type;
        this.accountId = model.accountId;
        this.openBalance = model.openBalance;
        this.closeBalance = model.closeBalance;
        this.transactionFailed = model.transactionFailed;
        this.manualStatement = model.manualStatement;

        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IStatement[]): Statement[] {
        return list && Array.isArray(list) ? list.map(item => new Statement(item)) : [];
    }
}

Object.seal(Statement);
export default Statement;
