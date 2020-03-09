"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pagination {
    constructor(page, limit) {
        if (!page || isNaN(page))
            page = 1;
        if (!limit || isNaN(limit))
            limit = 10;
        this.limit = limit;
        this.skip = (page - 1) * limit;
    }
}
exports.default = Pagination;
