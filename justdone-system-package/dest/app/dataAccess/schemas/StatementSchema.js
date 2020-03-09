"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class StatementSchema {
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
            accountId: {
                type: String,
                required: true
            },
            type: {
                type: Number,
                required: true
            },
            openBalance: {
                type: Number,
                required: true
            },
            closeBalance: {
                type: Number,
                required: true
            },
            manualStatement: {
                type: Boolean,
                default: false
            }
        };
        let schema = DataAccess_1.DataAccess.initSchema(schemaDefinition);
        schema.index({ userId: 1, year: -1, month: -1, accountId: 1, type: 1 }, { unique: true });
        return schema;
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('Statement', StatementSchema.schema);
