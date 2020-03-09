"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProductConfig_1 = require("./ProductConfig");
const DataHelper_1 = require("../../../helpers/DataHelper");
class ProductUpdate {
    constructor(model) {
        if (!model)
            return;
        this.name = model.name;
        this.type = model.type;
        this.config = new ProductConfig_1.default(model.config);
        DataHelper_1.default.handleDataModelInput(this);
    }
}
Object.seal(ProductUpdate);
exports.default = ProductUpdate;
