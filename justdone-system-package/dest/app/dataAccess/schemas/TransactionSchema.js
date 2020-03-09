"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class TransactionSchema {
    static get schema() {
        let schemaDefinition = {
            amount: mongoose.Schema.Types.Mixed,
            accountId: {
                type: Number,
                require: true
            },
            baseType: {
                type: String,
                required: true
            },
            bankId: {
                type: Number,
                required: true
            },
            categoryType: {
                type: String,
                required: true
            },
            categoryId: {
                type: Number,
                required: true
            },
            category: {
                type: String,
                required: true
            },
            categorySource: {
                type: String,
                required: true
            },
            description: mongoose.Schema.Types.Mixed,
            date: {
                type: Date,
                required: true
            },
            highLevelCategoryId: {
                type: Number,
                required: true
            },
            isManual: {
                type: Boolean,
                required: true
            },
            isWarningDuplicate: Boolean,
            duplicateId: String,
            merchant: mongoose.Schema.Types.Mixed,
            postDate: {
                type: Date
            },
            runningBalance: mongoose.Schema.Types.Mixed,
            status: {
                type: String,
                required: true
            },
            transactionId: {
                type: Number,
                required: true
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            type: {
                type: Number,
                required: true
            },
            typeCrunch: {
                type: Number,
                required: false
            },
            month: {
                type: Number,
                required: true
            },
            year: {
                type: Number,
                required: true
            },
            coaId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ChartAccount'
            },
            index: {
                type: Number
            },
            manualTransaction: {
                type: Boolean
            }
        };
        let schema = DataAccess_1.DataAccess.initSchema(schemaDefinition);
        schema.index({ userId: 1, year: -1, month: -1, transactionId: 1 }, { unique: true });
        return schema;
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('Transaction', TransactionSchema.schema);
