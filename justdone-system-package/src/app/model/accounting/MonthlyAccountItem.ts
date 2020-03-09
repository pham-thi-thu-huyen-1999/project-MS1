class MonthlyAccountItem {
    month: number;
    status: number;
    pageImages?: any;
    originFileId?: any;
    destinyFileId?: any;

    constructor(model: MonthlyAccountItem) {
        if (!model)
            return;

        this.month = model.month;
        this.status = model.status;
        this.pageImages = model.pageImages;
        this.originFileId = model.originFileId && !model.originFileId._id ? model.originFileId.toString() : model.originFileId;
        this.destinyFileId = model.destinyFileId && !model.destinyFileId._id ? model.destinyFileId.toString() : model.destinyFileId;
    }
}

Object.seal(MonthlyAccountItem);
export default MonthlyAccountItem;
