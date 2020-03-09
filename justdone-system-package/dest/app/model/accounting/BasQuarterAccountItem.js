"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BasQuarterAccountItem {
    constructor(model) {
        if (!model)
            return;
        let now = new Date();
        this.status = model.status;
        this.pageImages = model.pageImages;
        this.originFileId = model.originFileId && !model.originFileId._id ? model.originFileId.toString() : model.originFileId;
        this.destinyFileId = model.destinyFileId && !model.destinyFileId._id ? model.destinyFileId.toString() : model.destinyFileId;
        this.beginMonth = model.beginMonth;
        this.endMonth = model.endMonth;
        this.updatedAt = now;
        if (model.createdAt)
            this.createdAt = model.createdAt;
        else
            this.createdAt = now;
    }
}
exports.default = BasQuarterAccountItem;
