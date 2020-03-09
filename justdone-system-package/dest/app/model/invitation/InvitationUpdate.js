"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvitationUpdate {
    constructor(model) {
        if (!model)
            return;
        this.sendAt = model.sendAt;
    }
}
Object.seal(InvitationUpdate);
exports.default = InvitationUpdate;
