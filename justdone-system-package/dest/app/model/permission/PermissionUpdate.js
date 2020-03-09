"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PermissionUpdate {
    constructor(model) {
        if (!model)
            return;
        this.product = model.product;
        this.claim = model.claim;
        this.fromRole = model.fromRole;
        this.toRole = model.toRole ? model.toRole : null;
        this.deletedAt = model.deletedAt ? new Date() : null;
    }
}
Object.seal(PermissionUpdate);
exports.default = PermissionUpdate;
