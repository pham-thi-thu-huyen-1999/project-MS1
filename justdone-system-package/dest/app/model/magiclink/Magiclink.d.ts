import IMagiclink from './interfaces/IMagiclink';
declare class MagicLink {
    _id: string;
    userId: any;
    productCode: number;
    folderId: string;
    expiredAt: Date;
    constructor(model: IMagiclink);
    static parseArray(list: IMagiclink[]): MagicLink[];
}
export default MagicLink;
