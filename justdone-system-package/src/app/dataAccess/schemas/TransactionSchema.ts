import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import ITransaction from '../../model/transaction/interfaces/ITransaction'; // eslint-disable-line

class TransactionSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
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

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({userId: 1, year: -1, month: -1, transactionId: 1}, {unique: true});
        return schema;
    }
}
export default DataAccess.connection.model<ITransaction>('Transaction', TransactionSchema.schema);
