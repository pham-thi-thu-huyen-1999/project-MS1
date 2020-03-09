"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TransactionUpdate {
    constructor(model) {
        if (!model)
            return;
        this.index = model.index;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new TransactionUpdate(item)) : [];
    }
}
Object.seal(TransactionUpdate);
exports.default = TransactionUpdate;
