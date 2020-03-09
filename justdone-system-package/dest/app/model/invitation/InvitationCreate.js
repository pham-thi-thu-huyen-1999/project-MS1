"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InvitationToken_1 = require("./InvitationToken");
class InvitationCreate {
    constructor(model) {
        if (!model)
            return;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.fullName = model.firstName + ' ' + model.lastName;
        this.email = model.email;
        this.userId = model.userId;
        this.productId = model.productId;
        this.token = model.token && new InvitationToken_1.default(model.token);
    }
}
Object.seal(InvitationCreate);
exports.default = InvitationCreate;
