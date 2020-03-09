import IMagiclink from "./interfaces/IMagiclink";
declare class MagicLinkUpdate {
    userId: any;
    productCode: number;
    folderId: string;
    expiredAt: Date;
    constructor(model: IMagiclink);
}
export default MagicLinkUpdate;
