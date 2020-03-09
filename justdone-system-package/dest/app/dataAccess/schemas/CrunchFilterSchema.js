"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class CrunchFilterSchema {
    static get schema() {
        let schemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            isGlobal: {
                type: Boolean,
                required: true,
            },
            groupId: {
                type: Number,
                required: true
            },
            baseType: {
                type: String,
                required: true
            },
            groupName: {
                type: String,
                required: true
            },
            coaId: String,
            coaName: String,
            used: {
                type: Number,
                default: 0
            },
            bankId: Number,
            accountType: Number,
            conditions: [new mongoose.Schema({
                    operation: String,
                    description: String
                }, { _id: false })]
        };
        let schema = DataAccess_1.DataAccess.initSchema(schemaDefinition);
        return schema;
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('CrunchFilter', CrunchFilterSchema.schema);
