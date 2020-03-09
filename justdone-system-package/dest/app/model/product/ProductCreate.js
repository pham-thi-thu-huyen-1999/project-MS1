"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProductConfig_1 = require("./ProductConfig");
class ProductCreate {
    constructor(model) {
        if (!model)
            return;
        this.code = model.code;
        this.name = model.name;
        this.type = model.type;
        this.isCompleted = false;
        this.config = new ProductConfig_1.default(model.config);
    }
}
Object.seal(ProductCreate);
exports.default = ProductCreate;
