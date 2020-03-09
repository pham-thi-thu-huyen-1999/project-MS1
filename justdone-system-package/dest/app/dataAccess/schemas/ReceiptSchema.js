"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class ReceiptSchema {
    static get schema() {
        let schemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            fileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File',
                required: true
            },
            year: {
                type: Number,
                max: 9999,
                default: 1970,
            },
            month: {
                type: Number,
                max: 12,
                default: 1
            },
            day: {
                type: Number,
                max: 31,
                default: 1
            },
            total: {
                type: Number,
                required: true,
                default: 0
            },
            currency: {
                type: String,
                required: true,
                default: 'AUD'
            },
            productCode: {
                type: Number,
                required: true
            }
        };
        let schema = DataAccess_1.DataAccess.initSchema(schemaDefinition);
        schema.index({ userId: 1, year: -1, month: -1 });
        return schema;
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('Receipt', ReceiptSchema.schema);
