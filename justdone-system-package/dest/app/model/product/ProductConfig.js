"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class ProductConfig {
    constructor(model) {
        if (!model)
            return;
        this.domain = model.domain;
        this.colorScheme = model.colorScheme;
        this.emailSupport = model.emailSupport;
        this.nameSupport = model.nameSupport;
        this.financialYear = model.financialYear;
        this.clientLimit = model.clientLimit;
        DataHelper_1.default.handleDataModelInput(this);
    }
}
Object.seal(ProductConfig);
exports.default = ProductConfig;
