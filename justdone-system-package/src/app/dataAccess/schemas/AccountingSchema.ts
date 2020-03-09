import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IAccounting from '../../model/accounting/interfaces/IAccounting'; // eslint-disable-line

class AccountingSchema {
    static get schema() {
        let monthlySchemaDefinition: mongoose.SchemaDefinition = {
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

        let accountingItemSchemaDefinition: mongoose.SchemaDefinition = {
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

        let basQuarterItemSchemaDefinition: mongoose.SchemaDefinition = {
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

        let schemaDefinition: mongoose.SchemaDefinition = {
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

        return DataAccess.initSchema(schemaDefinition);
    }
}

export default DataAccess.connection.model<IAccounting>('Accounting', AccountingSchema.schema);
