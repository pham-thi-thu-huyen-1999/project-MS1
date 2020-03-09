"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommonType_1 = require("../common/CommonType");
class UserToken {
    constructor(model) {
        if (!model)
            return;
        this.provider = model.provider || CommonType_1.LoginProvider.Local;
        this.providerName = model.providerName || CommonType_1.LoginProvider[this.provider];
        this.accessToken = model.accessToken;
        this.tokenExpire = model.tokenExpire;
    }
}
Object.seal(UserToken);
exports.default = UserToken;
