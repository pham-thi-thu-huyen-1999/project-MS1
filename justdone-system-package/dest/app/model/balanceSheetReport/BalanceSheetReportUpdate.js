"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MagicLinkUpdate {
    constructor(model) {
        if (!model)
            return;
        this.csv = model.csv;
    }
}
Object.seal(MagicLinkUpdate);
exports.default = MagicLinkUpdate;
