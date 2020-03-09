"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class UsageBudget {
    static get schema() {
        let schemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            coaId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ChartAccount',
                required: true
            },
            beginYear: {
                type: Number,
                required: true
            },
            percentUsage: {
                type: Number,
                required: true
            }
        };
        let schema = DataAccess_1.DataAccess.initSchema(schemaDefinition);
        schema.index({ userId: 1, beginYear: -1, coaId: -1, deletedAt: 1 }, { unique: true });
        return schema;
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('UsageBudget', UsageBudget.schema);
