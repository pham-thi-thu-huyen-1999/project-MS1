"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MagicLinkCreate {
    constructor(model) {
        if (!model)
            return;
        this.userId = model.userId;
        this.productCode = model.productCode;
        this.folderId = model.folderId;
        this.expiredAt = model.expiredAt;
    }
}
Object.seal(MagicLinkCreate);
exports.default = MagicLinkCreate;
