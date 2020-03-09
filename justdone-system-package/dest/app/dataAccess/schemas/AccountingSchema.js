"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class AccountingSchema {
    static get schema() {
        let monthlySchemaDefinition = {
            month: Number,
            status: Number,
            originFileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File'
            },
            destinyFileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File'
            },
            pageImages: {
                type: Array,
                default: []
            }
        };
        let accountingItemSchemaDefinition = {
            status: Number,
            originFileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File'
            },
            destinyFileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File'
            },
            pageImages: {
                type: Array,
                default: [],
            },
            displayable: {
                type: Boolean,
                default: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date,
                default: Date.now
            }
        };
        let basQuarterItemSchemaDefinition = {
            status: Number,
            originFileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File'
            },
            destinyFileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File'
            },
            pageImages: {
                type: Array,
                default: [],
            },
            beginMonth: {
                type: Number,
                required: true,
            },
            endMonth: {
                type: Number,
                required: true,
            },
            displayable: {
                type: Boolean,
                default: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date,
                default: Date.now
            }
        };
        let schemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            beginYear: {
                type: Number,
                required: true
            },
            endYear: {
                type: Number,
                require: true
            },
            monthlyAccounts: [monthlySchemaDefinition],
            profitLoss: accountingItemSchemaDefinition,
            balanceSheet: accountingItemSchemaDefinition,
            basQuarter: {
                type: Number,
                default: true,
                required: true
            },
            basQuarter1: basQuarterItemSchemaDefinition,
            basQuarter2: basQuarterItemSchemaDefinition,
            basQuarter3: basQuarterItemSchemaDefinition,
            basQuarter4: basQuarterItemSchemaDefinition,
            taxReturn: accountingItemSchemaDefinition,
            annualReport: accountingItemSchemaDefinition,
            newYear: accountingItemSchemaDefinition,
            subContractor: accountingItemSchemaDefinition,
        };
        return DataAccess_1.DataAccess.initSchema(schemaDefinition);
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('Accounting', AccountingSchema.schema);
