import ICrunch from './interfaces/ICrunch'; // eslint-disable-line

class CrunchUpdate {
    coaAmounts: any[];
    income?: number;
    approvedAt?: Date;
    completedAt?: Date;
    amendedAt?: Date;
    startedAt?: Date;

    constructor(model: ICrunch) {
        if (!model)
            return;

        this.coaAmounts = model.coaAmounts;
        this.income = model.income;
        this.approvedAt = model.approvedAt;
        this.completedAt = model.completedAt;
        this.amendedAt = model.amendedAt;
        this.startedAt = model.startedAt;
    }
}

Object.seal(CrunchUpdate);
export default CrunchUpdate;
