import {BankType} from '../common/CommonType';

class CrunchStatus {
    type?: BankType;
    month?: number;
    year?: number;
    overdue?: number;
    approvedAt?: Date;
    completedAt?: Date;
    startedAt?: Date;
    amendedAt?: Date;
    isNoTransaction?: boolean;

    constructor(model: CrunchStatus) {
        if (!model)
            return;

        this.type = model.type;
        this.month = model.month;
        this.year = model.year;
        this.type = model.type;
        this.approvedAt = model.approvedAt;
        this.completedAt = model.completedAt;
        this.amendedAt = model.amendedAt;
        this.startedAt = model.startedAt;
        this.isNoTransaction = model.isNoTransaction;
    }
}

Object.seal(CrunchStatus);
export default CrunchStatus;
