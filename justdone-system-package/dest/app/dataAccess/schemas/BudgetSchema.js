"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class BudgetSchema {
    static get schema() {
        let schemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            year: {
                type: Number,
                required: true
            },
            month: {
                type: Number,
                required: true
            },
            coaId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ChartAccount',
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        };
        let schema = DataAccess_1.DataAccess.initSchema(schemaDefinition);
        schema.index({ userId: 1, year: -1, month: -1, coaId: 1 }, { unique: true });
        return schema;
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('Budget', BudgetSchema.schema);
