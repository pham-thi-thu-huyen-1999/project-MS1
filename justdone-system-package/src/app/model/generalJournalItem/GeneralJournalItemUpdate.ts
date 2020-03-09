import IGeneralJournalItem from "./interfaces/IGeneralJournalItem"; // eslint-disable-line
import GeneralJournalItemExtend from './GeneralJournalItemExtend';
class GeneralJournalUpdate {
    note?: string;
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
    month?: number;
    year?: number;
    transactionId?: any;
    extend?: GeneralJournalItemExtend;
    isIncludeTax?: boolean;
    constructor(model: IGeneralJournalItem) {
        if (!model)
            return;

        if (model.before)
            this.before = model.before;
        if (model.after)
            this.after = model.after;
        this.note = model.note;
        this.month = model.month;
        this.year = model.year;
        this.transactionId = model.transactionId;
        this.extend = model.extend;
        this.isIncludeTax = model.isIncludeTax;
    }
}

Object.seal(GeneralJournalUpdate);
export default GeneralJournalUpdate;
