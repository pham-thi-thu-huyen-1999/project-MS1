"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GroupExpenseCreate {
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
        this.coas = model.coas;
    }
}
Object.seal(GroupExpenseCreate);
exports.default = GroupExpenseCreate;
