import IProvider from './interfaces/IProvider';
declare class Provider {
    _id: string;
    name: string;
    loginUrl: string;
    baseUrl: string;
    favicon: string;
    logo: string;
    bankId: number;
    countryISOCode?: string;
    languageISOCode?: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(model: IProvider);
    static parseArray(list: IProvider[]): Provider[];
}
export default Provider;
