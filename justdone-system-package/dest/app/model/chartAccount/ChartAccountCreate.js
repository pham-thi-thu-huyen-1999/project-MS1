"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChartAccountCreate {
    constructor(model) {
        if (!model)
            return;
        this.code = model.code;
        this.name = model.name;
        this.searchTerm = model.searchTerm;
        this.description = model.description;
        this.country = model.country;
        this.gstType = model.gstType;
    }
}
Object.seal(ChartAccountCreate);
exports.default = ChartAccountCreate;
