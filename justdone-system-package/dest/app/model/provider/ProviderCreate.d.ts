import IProvider from './interfaces/IProvider';
declare class ProviderCreate {
    name: string;
    loginUrl: string;
    baseUrl: string;
    favicon: string;
    logo: string;
    bankId: number;
    countryISOCode?: string;
    languageISOCode?: string;
    constructor(model: IProvider);
}
export default ProviderCreate;
