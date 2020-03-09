"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class GroupExpenseSchema {
    static get schema() {
        let schemaDefinition = {
            reportType: {
                type: Number,
                required: true
            },
            code: {
                type: Number,
                required: true,
                min: 1
            },
            groupId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'GroupReport',
                required: true
            },
            isCreditAsPositive: {
                type: Boolean,
                default: true
            }
        };
        let schema = DataAccess_1.DataAccess.initSchema(schemaDefinition);
        schema.index({ reportType: 1, code: 1, groupId: 1 }, { unique: true });
        return schema;
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('SettingReport', GroupExpenseSchema.schema);
