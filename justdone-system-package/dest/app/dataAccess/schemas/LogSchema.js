"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class LogSchema {
    static get schema() {
        let schemaDefinition = {
            ipAddress: {
                type: String,
                required: true
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: false,
                index: true
            },
            productCode: {
                type: Number,
                required: true
            },
            url: {
                type: String,
                required: true
            },
            method: {
                type: String,
                required: true
            },
            content: {
                type: String,
                required: false
            },
            description: {
                type: mongoose.Schema.Types.Mixed,
                required: false
            },
            status: {
                type: Number,
                required: true
            },
            device: {
                type: String,
                required: false
            }
        };
        let schema = DataAccess_1.DataAccess.initSchema(schemaDefinition);
        schema.index({ createdAt: 1, status: 1 }, { unique: true });
        return schema;
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('Log', LogSchema.schema);
