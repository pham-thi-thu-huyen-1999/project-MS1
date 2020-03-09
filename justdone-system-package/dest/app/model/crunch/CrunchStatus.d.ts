import { BankType } from '../common/CommonType';
declare class CrunchStatus {
    type?: BankType;
    month?: number;
    year?: number;
    overdue?: number;
    approvedAt?: Date;
    completedAt?: Date;
    startedAt?: Date;
    amendedAt?: Date;
    isNoTransaction?: boolean;
    constructor(model: CrunchStatus);
}
export default CrunchStatus;
