"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChartAccountAssignmentUpdate {
    constructor(model) {
        if (!model)
            return;
        this.coa = model.coa;
        this.product = model.product;
        this.client = model.client;
    }
}
Object.seal(ChartAccountAssignmentUpdate);
exports.default = ChartAccountAssignmentUpdate;
