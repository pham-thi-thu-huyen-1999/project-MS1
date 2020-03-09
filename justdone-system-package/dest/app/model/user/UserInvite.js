"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserInvite {
    constructor(model) {
        if (!model)
            return;
        this.token = model.token;
        this.inviterId = model.inviterId;
    }
}
Object.seal(UserInvite);
exports.default = UserInvite;
