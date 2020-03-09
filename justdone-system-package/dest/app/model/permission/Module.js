"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Module {
    constructor(model) {
        if (!model)
            return;
        this.code = model.code;
        this.name = model.name;
        this.order = model.order;
        this.claim = model.claim;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new Module(item)) : [];
    }
}
Object.seal(Module);
exports.default = Module;
