import IBaseModel from '../../common/interfaces/IBaseModel';
interface IProvider extends IBaseModel {
    name: string;
    loginUrl: string;
    baseUrl: string;
    favicon: string;
    logo: string;
    bankId: number;
    countryISOCode?: string;
    languageISOCode?: string;
}
export default IProvider;
