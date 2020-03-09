"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MagicLinkUpdate {
    constructor(model) {
        if (!model)
            return;
        this.userId = model.userId;
        this.expiredAt = model.expiredAt;
    }
}
Object.seal(MagicLinkUpdate);
exports.default = MagicLinkUpdate;
