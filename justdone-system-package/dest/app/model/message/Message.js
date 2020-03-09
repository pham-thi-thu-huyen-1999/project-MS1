"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class Message {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.userId = DataHelper_1.default.handleIdDataModel(model.userId);
        this.content = model.content;
        this.fileId = DataHelper_1.default.handleIdDataModel(model.fileId);
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new Message(item)) : [];
    }
}
Object.seal(Message);
exports.default = Message;
