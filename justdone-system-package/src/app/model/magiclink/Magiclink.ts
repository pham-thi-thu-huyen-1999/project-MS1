import IMagiclink from './interfaces/IMagiclink'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class MagicLink {
    _id: string;
    userId: any;
    productCode: number;
    folderId: string;
    expiredAt: Date;

    constructor(model: IMagiclink) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.userId = DataHelper.handleIdDataModel(model.userId);
        this.folderId = DataHelper.handleIdDataModel(model.folderId);
        this.productCode = model.productCode;
        this.expiredAt = model.expiredAt;
    }

    static parseArray(list: IMagiclink[]): MagicLink[] {
        return list && Array.isArray(list) ? list.map(item => new MagicLink(item)) : [];
    }
}

Object.seal(MagicLink);
export default MagicLink;
