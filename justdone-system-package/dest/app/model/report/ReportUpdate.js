"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReportUpdate {
    constructor(model) {
        if (!model)
            return;
        this.name = model.name;
    }
}
Object.seal(ReportUpdate);
exports.default = ReportUpdate;
