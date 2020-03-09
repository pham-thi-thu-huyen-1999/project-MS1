import IGeneralJournal from "./interfaces/IGeneralJournal"; // eslint-disable-line

class GeneralJournalUpdate {
    userId: any;
    code: string;
    month: number;
    beginYear: number;
    productId: any;
    note?: string;
    constructor(model: IGeneralJournal) {
        if (!model)
            return;
        this.userId = model.userId;
        this.code = model.code;
        this.month = model.month;
        this.beginYear = model.beginYear;
        this.productId = model.productId;
        this.note = model.note;
    }
}

Object.seal(GeneralJournalUpdate);
export default GeneralJournalUpdate;
