import IProvider from './interfaces/IProvider'; // eslint-disable-line

class ProviderCreate {
    name:string;
    loginUrl:string;
    baseUrl:string;
    favicon:string;
    logo:string;
    bankId:number;
    countryISOCode?: string;
    languageISOCode?: string;

    constructor(model: IProvider) {
        if (!model)
            return;

        this.name = model.name;
        this.loginUrl = model.loginUrl;
        this.baseUrl = model.baseUrl;
        this.favicon = model.favicon;
        this.logo = model.logo;
        this.bankId = model.bankId;
        this.countryISOCode = model.countryISOCode;
        this.languageISOCode = model.languageISOCode;
    }
}

Object.seal(ProviderCreate);
export default ProviderCreate;
