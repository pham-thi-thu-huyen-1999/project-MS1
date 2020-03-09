import IGeneralJournal from "./interfaces/IGeneralJournal"; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class GeneralJournal {
    _id: any
    userId: any;
    code: string;
    month: number;
    beginYear: number;
    productId: any;
    createdAt ?: Date;
    note ?: string;
    constructor(model: IGeneralJournal) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.userId = DataHelper.handleIdDataModel(model.userId);
        this.productId = DataHelper.handleIdDataModel(model.productId);
        this.code = model.code;
        this.note = model.note;
        this.month = model.month;
        this.beginYear = model.beginYear;
        this.createdAt = model.createdAt;
    }

    static parseArray(list: IGeneralJournal[]): GeneralJournal[] {
        return list && Array.isArray(list) ? list.map(item => new GeneralJournal(item)) : [];
    }
}

Object.seal(GeneralJournal);
export default GeneralJournal;
