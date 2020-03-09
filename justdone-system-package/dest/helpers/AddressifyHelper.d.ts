export default class AddressifyHelper {
    static createUrlFromKeyword(keyword: string, maxResults: number): string;
    static formatKeyword(keyword: string): string;
    static getAddressAutoComplete(keyword: string, maxResults?: number): Promise<{}>;
}
