"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class MessageUpdate {
    constructor(model) {
        if (!model)
            return;
        this.userId = DataHelper_1.default.handleIdDataModel(model.userId);
        this.content = model.content;
        this.fileId = DataHelper_1.default.handleIdDataModel(model.fileId);
    }
}
Object.seal(MessageUpdate);
exports.default = MessageUpdate;
