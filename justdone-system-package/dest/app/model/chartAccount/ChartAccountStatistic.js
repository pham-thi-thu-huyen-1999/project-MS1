"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChartAccount_1 = require("./ChartAccount");
class ChartAccountStatistic {
    constructor(model) {
        if (!model)
            return;
        this.coa = model.coa && new ChartAccount_1.default(model.coa);
        this.product = model.product && Number(model.product);
        this.client = model.client && Number(model.client);
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new ChartAccountStatistic(item)) : [];
    }
}
Object.seal(ChartAccountStatistic);
exports.default = ChartAccountStatistic;
