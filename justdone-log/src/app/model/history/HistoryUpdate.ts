import IHistory from './interfaces/IHistory'; // eslint-disable-line
import HistoryTarget from './HistoryTarget';

class HistoryUpdate {
    userId: string;
    roleId?: string;
    productCode?: number;
    target?: HistoryTarget;
    claim: number;
    description: string;
    status: number;

    constructor(model: IHistory) {
        if (!model)
            return;

        this.userId = model.userId && model.userId.toString();
        this.roleId = model.roleId && model.roleId.toString();
        this.productCode = model.productCode && model.productCode;
        this.target = model.target && new HistoryTarget(model.target);
        this.claim = model.claim;
        this.description = model.description;
        this.status = model.status;
    }

    static parseArray(list: IHistory[]): HistoryUpdate[] {
        return list && Array.isArray(list) ? list.map(item => new HistoryUpdate(item)) : [];
    }
}

Object.seal(HistoryUpdate);
export default HistoryUpdate;
