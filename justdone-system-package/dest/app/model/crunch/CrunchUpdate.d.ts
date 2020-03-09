import ICrunch from './interfaces/ICrunch';
declare class CrunchUpdate {
    coaAmounts: any[];
    income?: number;
    approvedAt?: Date;
    completedAt?: Date;
    amendedAt?: Date;
    startedAt?: Date;
    constructor(model: ICrunch);
}
export default CrunchUpdate;
