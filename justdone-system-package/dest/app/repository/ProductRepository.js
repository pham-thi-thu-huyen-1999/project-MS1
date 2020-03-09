"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProductSchema_1 = require("../dataAccess/schemas/ProductSchema");
const BaseRepository_1 = require("./base/BaseRepository");
class ProductRepository extends BaseRepository_1.default {
    constructor() {
        super(ProductSchema_1.default);
    }
}
Object.seal(ProductRepository);
exports.default = ProductRepository;
