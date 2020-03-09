"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class BalanceSheetReportSchema {
    static get schema() {
        let schemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            csv: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File',
                required: true
            },
            month: {
                type: Number,
                required: true
            },
            year: {
                type: Number,
                required: true
            }
        };
        let schema = DataAccess_1.DataAccess.initSchema(schemaDefinition);
        schema.index({ userId: 1, year: -1, month: -1, deletedAt: 1 }, { unique: true });
        return schema;
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('BalanceSheetReport', BalanceSheetReportSchema.schema);
