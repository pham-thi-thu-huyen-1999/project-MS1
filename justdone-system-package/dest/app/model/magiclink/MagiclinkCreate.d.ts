import IMagiclink from "./interfaces/IMagiclink";
declare class MagicLinkCreate {
    userId: any;
    productCode: number;
    folderId: string;
    expiredAt: Date;
    constructor(model: IMagiclink);
}
export default MagicLinkCreate;
