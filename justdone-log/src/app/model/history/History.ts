import IHistory from './interfaces/IHistory'; // eslint-disable-line
import HistoryTarget from './HistoryTarget';

class History {
    _id: string;
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

        this._id = model._id && model._id.toString();
        this.userId = model.userId && model.userId.toString();
        this.roleId = model.roleId && model.roleId.toString();
        this.productCode = model.productCode && model.productCode;
        this.target = model.target && new HistoryTarget(model.target);
        this.claim = model.claim;
        this.description = model.description;
        this.status = model.status;
    }

    static parseArray(list: IHistory[]): History[] {
        return list && Array.isArray(list) ? list.map(item => new History(item)) : [];
    }
}

Object.seal(History);
export default History;
