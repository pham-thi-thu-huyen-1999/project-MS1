"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChartAccountUpdate {
    constructor(model) {
        if (!model)
            return;
        this.code = model.code;
        this.name = model.name;
        this.searchTerm = model.searchTerm;
        this.description = model.description;
        this.country = model.country;
    }
}
Object.seal(ChartAccountUpdate);
exports.default = ChartAccountUpdate;
