"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class FinanceSchema {
    static get schema() {
        let schemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            financialYear: {
                type: String,
                required: true
            },
            currentProfit: {
                type: Number,
                default: 0
            },
            grossIncome: {
                type: Number,
                default: 0
            },
            expenseYear: {
                type: Number,
                default: 0
            },
            currentBas: {
                type: Number,
                default: 0
            },
            incomeTax: {
                type: Number,
                default: 0
            },
            integratedClient: {
                type: Number,
                default: 0
            },
            estimatedTax: {
                type: Number,
                default: 0
            },
            putAsidedBas: {
                type: Number,
                default: 0
            },
            monthlyDetail: {
                type: mongoose.Schema.Types.Mixed,
                default: [
                    { month: 'January', income: 0, expense: 0, profit: 0 },
                    { month: 'February', income: 0, expense: 0, profit: 0 },
                    { month: 'March', income: 0, expense: 0, profit: 0 },
                    { month: 'April', income: 0, expense: 0, profit: 0 },
                    { month: 'May', income: 0, expense: 0, profit: 0 },
                    { month: 'June', income: 0, expense: 0, profit: 0 },
                    { month: 'July', income: 0, expense: 0, profit: 0 },
                    { month: 'August', income: 0, expense: 0, profit: 0 },
                    { month: 'September', income: 0, expense: 0, profit: 0 },
                    { month: 'October', income: 0, expense: 0, profit: 0 },
                    { month: 'November', income: 0, expense: 0, profit: 0 },
                    { month: 'December', income: 0, expense: 0, profit: 0 }
                ]
            }
        };
        return DataAccess_1.DataAccess.initSchema(schemaDefinition);
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('Finance', FinanceSchema.schema);
