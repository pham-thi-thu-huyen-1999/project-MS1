"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GroupReportCreate {
    constructor(model) {
        if (!model)
            return;
        this.code = model.code;
        this.name = model.name;
        if (model.order)
            this.order = model.order;
        this.searchTerm = model.searchTerm;
        this.coas = model.coas;
        this.parentId = model.parentId;
    }
}
Object.seal(GroupReportCreate);
exports.default = GroupReportCreate;
