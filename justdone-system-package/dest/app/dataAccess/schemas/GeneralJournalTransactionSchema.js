"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class GeneralJournalTransaction {
    static get schema() {
        let schemaDefinition = {
            amount: {
                type: Number,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            isCredit: {
                type: Boolean,
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
            }
        };
        let schema = DataAccess_1.DataAccess.initSchema(schemaDefinition);
        return schema;
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('GeneralJournalTransaction', GeneralJournalTransaction.schema);
