"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SettingReportSchema_1 = require("../dataAccess/schemas/SettingReportSchema");
const BaseRepository_1 = require("./base/BaseRepository");
class ReportRepository extends BaseRepository_1.default {
    constructor() {
        super(SettingReportSchema_1.default);
    }
    create(data) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super("create").call(this, data);
        });
    }
    update(_id, data) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super("update").call(this, _id, data);
        });
    }
}
Object.seal(ReportRepository);
exports.default = ReportRepository;
