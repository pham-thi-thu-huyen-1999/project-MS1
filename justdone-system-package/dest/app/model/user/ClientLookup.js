"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class ClientLookup {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.fullname = model.fullName;
        this.email = model.email;
        this.abn = model.businessInfo ? model.businessInfo.abnCode : '';
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new ClientLookup(item)) : [];
    }
}
exports.ClientLookup = ClientLookup;
Object.seal(ClientLookup);
exports.default = ClientLookup;
