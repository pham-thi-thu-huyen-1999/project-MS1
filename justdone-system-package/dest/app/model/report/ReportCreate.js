"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReportCreate {
    constructor(model) {
        if (!model)
            return;
        this.name = model.name;
    }
}
Object.seal(ReportCreate);
exports.default = ReportCreate;
