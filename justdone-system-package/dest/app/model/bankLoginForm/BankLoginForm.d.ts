import IBankLoginForm from './interfaces/IBankLoginForm';
declare class BankLoginForm {
    providerId: string;
    loginForm: any;
    logo: string;
    bankName: string;
    languageISOCode: string;
    countryISOCode: string;
    constructor(model: IBankLoginForm);
    static parseArray(list: IBankLoginForm[]): BankLoginForm[];
}
export default BankLoginForm;
