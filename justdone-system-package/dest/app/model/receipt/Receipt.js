"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class Receipt {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.userId = DataHelper_1.default.handleIdDataModel(model.userId);
        this.fileId = DataHelper_1.default.handleIdDataModel(model.fileId);
        this.year = model.year;
        this.month = model.month;
        this.day = model.day;
        this.total = model.total;
        this.currency = model.currency;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new Receipt(item)) : [];
    }
    static parseObject(list) {
        let result = list.map(item => new Receipt(item));
        let data = {
            totalPrice: 0,
            totalData: 0
        };
        data.totalData = result.length;
        result.forEach(item => {
            data.totalPrice += item.total;
        });
        return data;
    }
}
Object.seal(Receipt);
exports.default = Receipt;
