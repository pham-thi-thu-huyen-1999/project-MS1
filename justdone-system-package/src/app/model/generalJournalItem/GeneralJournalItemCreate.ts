import IGeneralJournalItem from "./interfaces/IGeneralJournalItem"; // eslint-disable-line
import GeneralJournalItemExtend from './GeneralJournalItemExtend';

class GeneralJournalItemCreate {
    gjId: any;
    userId: any;
    evidenced?: any;
    type: number;
    transactionId?: any;
    extend?:any;
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
    isIncludeTax?: boolean;
    month: number;
    year: number;
    note?: string

    constructor(model: IGeneralJournalItem) {
        if (!model)
            return;
        this.userId = model.userId;
        this.evidenced = model.evidenced;
        this.transactionId = model.transactionId;
        this.gjId = model.gjId;
        this.type = model.type;
        if (model.before && model.before.typeCrunch)
            this.before = model.before;
        this.after = model.after;
        if (model.extend)
            this.extend = new GeneralJournalItemExtend(model.extend);
        this.isIncludeTax = model.isIncludeTax;
        this.month = model.month;
        this.year = model.year;
        this.note = model.note;
    }

    static parseArray(list: IGeneralJournalItem[]): GeneralJournalItemCreate[] {
        return list && Array.isArray(list) ? list.map(item => new GeneralJournalItemCreate(item)) : [];
    }
}

Object.seal(GeneralJournalItemCreate);
export default GeneralJournalItemCreate;
