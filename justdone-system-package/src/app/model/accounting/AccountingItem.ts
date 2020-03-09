class AccountingItem {
    status: number;
    originFileId?: any;
    destinyFileId?: any;
    pageImages?: any;
    displayable: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(model: AccountingItem) {
        if (!model)
            return;

        let now = new Date();
        this.status = model.status;
        this.pageImages = model.pageImages;
        this.originFileId = model.originFileId && !model.originFileId._id ? model.originFileId.toString() : model.originFileId;
        this.destinyFileId = model.destinyFileId && !model.destinyFileId._id ? model.destinyFileId.toString() : model.destinyFileId;
        this.updatedAt = now;

        if (model.createdAt)
            this.createdAt = model.createdAt;
        else
            this.createdAt = now;
    }
}

Object.seal(AccountingItem);
export default AccountingItem;
