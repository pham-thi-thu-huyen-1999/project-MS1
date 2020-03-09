"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FileUpdate {
    constructor(model) {
        if (!model)
            return;
        this.name = model.name;
        this.url = model.url;
        this.prefix = model.prefix;
    }
}
Object.seal(FileUpdate);
exports.default = FileUpdate;
