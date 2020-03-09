import IGeneralJournalItem from "./interfaces/IGeneralJournalItem"; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';
import GeneralJournalItemExtend from './GeneralJournalItemExtend';
class GeneralJournalItem {
    _id: any
    userId: any;
    gjId: any;
    type: number;
    evidenced?: any;
    transactionId?: any;
    extend?: GeneralJournalItemExtend;
    isIncludeTax?: boolean;
    before?: {
        coaId?:any,
        typeCrunch?:number,
        name?: String
    };
    after: {
        coaId?:any,
        typeCrunch:number,
        name?: String
    };
    month: number;
    year: number;
    note?: string;
    createdAt? : Date;

    constructor(model: IGeneralJournalItem) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.gjId = DataHelper.handleIdDataModel(model.gjId);
        this.userId = DataHelper.handleIdDataModel(model.userId);
        this.evidenced = DataHelper.handleIdDataModel(model.evidenced);
        this.transactionId = DataHelper.handleIdDataModel(model.transactionId);
        if (model.before && model.before.typeCrunch)
            this.before = model.before;
        this.after = model.after;
        if (model.extend)
            this.extend = new GeneralJournalItemExtend(model.extend);
        this.type = model.type;
        this.month = model.month;
        this.year = model.year;
        this.note = model.note;
        this.createdAt = model.createdAt;
    }

    static parseArray(list: IGeneralJournalItem[]): GeneralJournalItem[] {
        return list && Array.isArray(list) ? list.map(item => new GeneralJournalItem(item)) : [];
    }
}

Object.seal(GeneralJournalItem);
export default GeneralJournalItem;
