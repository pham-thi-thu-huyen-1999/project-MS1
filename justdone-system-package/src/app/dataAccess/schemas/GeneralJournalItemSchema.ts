import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IGeneralJournalItem from '../../model/generalJournalItem/interfaces/IGeneralJournalItem'; // eslint-disable-line

class GeneralJournalSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
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
            }, {_id: false}),
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

        let schema = DataAccess.initSchema(schemaDefinition);
        return schema;
    }
}

export default DataAccess.connection.model<IGeneralJournalItem>('GeneralJournalItem', GeneralJournalSchema.schema);
