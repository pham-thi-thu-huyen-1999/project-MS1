import IBaseModel from '../../common/interfaces/IBaseModel';
import {BankType} from '../../common/CommonType';

interface ICrunch extends IBaseModel {
    userId: any;
    year: number;
    month: number;
    accountId: string;
    type: BankType;
    income?: number;
    coaAmounts: any[];
    startedAt?: Date;
    approvedAt?: Date;
    amendedAt?: Date;
    completedAt?: Date;
}

export default ICrunch;
