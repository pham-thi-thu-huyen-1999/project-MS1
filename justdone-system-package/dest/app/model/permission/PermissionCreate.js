"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PermissionCreate {
    constructor(model) {
        if (!model)
            return;
        this.product = model.product;
        this.claim = model.claim;
        this.fromRole = model.fromRole;
        this.toRole = model.toRole ? model.toRole : null;
    }
}
Object.seal(PermissionCreate);
exports.default = PermissionCreate;
