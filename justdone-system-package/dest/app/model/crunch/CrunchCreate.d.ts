import ICrunch from './interfaces/ICrunch';
import { BankType } from '../common/CommonType';
declare class CrunchCreate {
    userId: any;
    type: BankType;
    month: number;
    year: number;
    accountId: string;
    coaAmounts: any[];
    income?: number;
    amendedAt?: Date;
    startedAt?: Date;
    approvedAt?: Date;
    completedAt?: Date;
    constructor(model: ICrunch);
}
export default CrunchCreate;
