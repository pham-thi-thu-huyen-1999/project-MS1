"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
const ProductConfig_1 = require("./ProductConfig");
class Product {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.code = model.code;
        this.type = model.type;
        this.name = model.name;
        this.logo = DataHelper_1.default.handleFileDataModel(model.logo);
        this.favicon = DataHelper_1.default.handleFileDataModel(model.favicon);
        this.config = new ProductConfig_1.default(model.config);
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new Product(item)) : [];
    }
}
Object.seal(Product);
exports.default = Product;
