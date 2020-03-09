import IBankLoginForm from './interfaces/IBankLoginForm'; // eslint-disable-line

class BankLoginForm {
    providerId: string;
    loginForm: any;
    logo: string;
    bankName: string;
    languageISOCode: string;
    countryISOCode: string;

    constructor(model: IBankLoginForm) {
        if (!model)
            return;

        this.providerId = model.providerId;
        this.loginForm = model.loginForm;
        this.logo = model.logo;
        this.bankName = model.bankName;
        this.languageISOCode = model.languageISOCode;
        this.countryISOCode = model.countryISOCode;
    }

    static parseArray(list: IBankLoginForm[]): BankLoginForm[] {
        return list && Array.isArray(list) ? list.map(item => new BankLoginForm(item)) : [];
    }
}

Object.seal(BankLoginForm);
export default BankLoginForm;
