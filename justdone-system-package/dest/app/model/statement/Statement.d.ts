import IStatement from './interfaces/IStatement';
import { BankType } from '../common/CommonType';
declare class Statement {
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
    constructor(model: IStatement);
    static parseArray(list: IStatement[]): Statement[];
}
export default Statement;
