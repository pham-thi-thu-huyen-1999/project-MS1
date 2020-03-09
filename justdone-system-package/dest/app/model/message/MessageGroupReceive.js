"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageGroupReceive {
    constructor(model) {
        if (!model)
            return;
        this.role = model.role;
        this.product = model.product;
    }
}
Object.seal(MessageGroupReceive);
exports.default = MessageGroupReceive;
