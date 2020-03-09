"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MonthlyAccountItem {
    constructor(model) {
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
exports.default = MonthlyAccountItem;
