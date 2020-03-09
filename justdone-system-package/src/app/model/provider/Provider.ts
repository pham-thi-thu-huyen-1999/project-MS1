import IProvider from './interfaces/IProvider'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class Provider {
    _id: string;
    name:string;
    loginUrl:string;
    baseUrl:string;
    favicon:string;
    logo:string;
    bankId:number;
    countryISOCode?: string;
    languageISOCode?: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IProvider) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.name = model.name;
        this.loginUrl = model.loginUrl;
        this.baseUrl = model.baseUrl;
        this.favicon = model.favicon;
        this.logo = model.logo;
        this.bankId = model.bankId;
        this.countryISOCode = model.countryISOCode;
        this.languageISOCode = model.languageISOCode;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IProvider[]): Provider[] {
        return list && Array.isArray(list) ? list.map(item => new Provider(item)) : [];
    }
}

Object.seal(Provider);
export default Provider;
