"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Log {
    constructor(model) {
        if (!model)
            return;
        this._id = model._id && model._id.toString();
        this.ipAddress = model.ipAddress;
        this.userId = model.userId && !model.userId ? model.userId.toString() : model.userId;
        this.productCode = model.productCode;
        this.url = model.url;
        this.method = model.method;
        this.content = model.content;
        this.description = model.description;
        this.status = model.status;
        this.device = model.device;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new Log(item)) : [];
    }
}
Object.seal(Log);
exports.default = Log;
