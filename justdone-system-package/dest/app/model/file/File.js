"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class File {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.userId = DataHelper_1.default.handleIdDataModel(model.userId);
        this.productCode = model.productCode;
        this.name = model.name;
        this.size = model.size;
        this.isFolder = model.isFolder;
        this.parentId = model.parentId;
        this.url = model.url;
        this.type = model.type;
        this.extension = model.extension;
        this.prefix = model.prefix;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new File(item)) : [];
    }
}
Object.seal(File);
exports.default = File;
