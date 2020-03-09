"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvitationToken {
    constructor(model) {
        if (!model)
            return;
        this.accessToken = model.accessToken;
        this.tokenExpire = model.tokenExpire;
    }
}
Object.seal(InvitationToken);
exports.default = InvitationToken;
