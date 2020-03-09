"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FileCreate {
    constructor(model) {
        if (!model)
            return;
        this.userId = model.userId;
        this.productCode = model.productCode;
        this.name = model.name;
        this.size = model.size;
        this.isFolder = model.isFolder;
        this.parentId = model.parentId;
        this.url = model.url;
        this.type = model.type;
        this.extension = model.extension;
        this.prefix = model.prefix;
    }
}
Object.seal(FileCreate);
exports.default = FileCreate;
