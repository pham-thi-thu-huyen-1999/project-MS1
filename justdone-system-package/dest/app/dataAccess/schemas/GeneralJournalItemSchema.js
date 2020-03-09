"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class GeneralJournalSchema {
    static get schema() {
        let schemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            type: {
                type: Number,
                required: true
            },
            evidenced: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File'
            },
            transactionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Transaction'
            },
            extend: new mongoose.Schema({
                amount: Number,
                description: String,
                isCredit: Boolean
            }, { _id: false }),
            before: {
                coaId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'ChartAccount'
                },
                typeCrunch: Number,
                name: String
            },
            after: {
                coaId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'ChartAccount'
                },
                typeCrunch: Number,
                name: String
            },
            gjId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'GeneralJournal',
                required: true
            },
            isIncludeTax: {
                type: Boolean,
                default: false
            },
            month: {
                type: Number,
                required: true
            },
            year: {
                type: Number,
                required: true
            },
            note: String
        };
        let schema = DataAccess_1.DataAccess.initSchema(schemaDefinition);
        return schema;
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('GeneralJournalItem', GeneralJournalSchema.schema);
