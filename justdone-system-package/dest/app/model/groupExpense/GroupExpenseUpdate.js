"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GroupExpenseUpdate {
    constructor(model) {
        if (!model)
            return;
        this.userId = model.userId;
        this.parent = model.parent;
        this.code = model.code;
        this.name = model.name;
        if (model.order)
            this.order = model.order;
        this.searchTerm = model.searchTerm;
    }
}
Object.seal(GroupExpenseUpdate);
exports.default = GroupExpenseUpdate;
