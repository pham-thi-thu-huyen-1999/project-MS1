import ICrunch from './interfaces/ICrunch';
import { BankType } from '../common/CommonType';
declare class Crunch {
    _id: string;
    userId: any;
    type: BankType;
    month: number;
    year: number;
    accountId: string;
    coaAmounts: any[];
    income?: number;
    startedAt?: Date;
    approvedAt?: Date;
    amendedAt?: Date;
    completedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(model: ICrunch);
    static parseArray(list: ICrunch[]): Crunch[];
}
export default Crunch;
