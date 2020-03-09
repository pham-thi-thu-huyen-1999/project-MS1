import IBaseModel from '../../common/interfaces/IBaseModel';

interface IBankLoginForm extends IBaseModel {
    providerId: string;
    loginForm: any;
    logo: string;
    bankName: string;
    languageISOCode: string;
    countryISOCode: string;
}

export default IBankLoginForm;
