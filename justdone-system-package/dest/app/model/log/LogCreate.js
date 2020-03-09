"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LogCreate {
    constructor(model) {
        if (!model)
            return;
        this.ipAddress = model.ipAddress;
        this.userId = model.userId && !model.userId ? model.userId.toString() : model.userId;
        this.productCode = model.productCode;
        this.url = model.url;
        this.method = model.method;
        this.content = model.content;
        this.description = model.description;
        this.status = model.status;
        this.device = model.device;
    }
}
Object.seal(LogCreate);
exports.default = LogCreate;
