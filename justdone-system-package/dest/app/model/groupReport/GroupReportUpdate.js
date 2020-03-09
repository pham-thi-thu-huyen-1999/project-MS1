"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GroupReportUpdate {
    constructor(model) {
        if (!model)
            return;
        this.code = model.code;
        this.name = model.name;
        if (model.order)
            this.order = model.order;
        this.searchTerm = model.searchTerm;
        this.parentId = model.parentId;
    }
}
Object.seal(GroupReportUpdate);
exports.default = GroupReportUpdate;
