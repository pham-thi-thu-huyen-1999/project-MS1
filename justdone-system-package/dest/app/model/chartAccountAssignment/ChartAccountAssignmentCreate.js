"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChartAccountAssignmentCreate {
    constructor(model) {
        if (!model)
            return;
        this.coa = model.coa;
        this.product = model.product;
        this.client = model.client;
    }
}
Object.seal(ChartAccountAssignmentCreate);
exports.default = ChartAccountAssignmentCreate;
