"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class GroupExpenseSchema {
    static get schema() {
        let schemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            parent: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'GroupExpense'
            },
            code: {
                type: Number,
                min: 1
            },
            name: {
                type: String,
                required: true,
                min: 3,
                max: 50
            },
            searchTerm: {
                type: String,
                max: 70
            },
            order: {
                type: Number,
                default: 1,
            },
            coas: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'ChartAccount',
                    default: []
                }]
        };
        let schema = DataAccess_1.DataAccess.initSchema(schemaDefinition);
        schema.index({ userId: 1, parent: 1, searchTerm: 1 }, { unique: true });
        return schema;
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('GroupExpense', GroupExpenseSchema.schema);
