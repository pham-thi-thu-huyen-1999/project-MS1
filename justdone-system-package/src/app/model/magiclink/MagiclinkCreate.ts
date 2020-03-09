import IMagiclink from "./interfaces/IMagiclink"; // eslint-disable-line

class MagicLinkCreate {
    userId: any;
    productCode: number;
    folderId: string;
    expiredAt: Date;

    constructor(model: IMagiclink) {
        if (!model)
            return;

        this.userId = model.userId;
        this.productCode = model.productCode;
        this.folderId = model.folderId;
        this.expiredAt = model.expiredAt;
    }
}

Object.seal(MagicLinkCreate);
export default MagicLinkCreate;
