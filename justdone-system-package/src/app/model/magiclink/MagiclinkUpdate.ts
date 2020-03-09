import IMagiclink from "./interfaces/IMagiclink"; // eslint-disable-line

class MagicLinkUpdate {
    userId: any;
    productCode: number;
    folderId: string;
    expiredAt: Date;

    constructor(model: IMagiclink) {
        if (!model)
            return;

        this.userId = model.userId;
        this.expiredAt = model.expiredAt;
    }
}

Object.seal(MagicLinkUpdate);
export default MagicLinkUpdate;
