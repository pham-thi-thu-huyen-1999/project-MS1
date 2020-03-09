"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class MagicLink {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.userId = DataHelper_1.default.handleIdDataModel(model.userId);
        this.folderId = DataHelper_1.default.handleIdDataModel(model.folderId);
        this.productCode = model.productCode;
        this.expiredAt = model.expiredAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new MagicLink(item)) : [];
    }
}
Object.seal(MagicLink);
exports.default = MagicLink;
