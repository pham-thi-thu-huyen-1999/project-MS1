import IUser from './interfaces/IUser'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

export class ClientLookup {
    _id: string;
    fullname: string;
    email: string;
    abn?: string;

    constructor(model: IUser) {
        if (!model)
            return;
        this._id = DataHelper.handleIdDataModel(model._id);

        this.fullname = model.fullName;
        this.email = model.email;
        this.abn = model.businessInfo ? model.businessInfo.abnCode : '';
    }

    static parseArray(list: IUser[]): ClientLookup[] {
        return list && Array.isArray(list) ? list.map(item => new ClientLookup(item)) : [];
    }
}

Object.seal(ClientLookup);
export default ClientLookup;
