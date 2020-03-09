"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BankLoginForm_1 = require("../dataAccess/schemas/BankLoginForm");
const BaseRepository_1 = require("./base/BaseRepository");
class BankLoginFormRepository extends BaseRepository_1.default {
    constructor() {
        super(BankLoginForm_1.default);
    }
}
Object.seal(BankLoginFormRepository);
exports.default = BankLoginFormRepository;
