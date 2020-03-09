import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IGeneralJournal from '../../model/generalJournal/interfaces/IGeneralJournal'; // eslint-disable-line

class GeneralJournalSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            code: {
                type: String,
                required: true
            },
            month: {
                type: Number,
                required: true
            },
            beginYear: {
                type: Number,
                required: true
            },
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            note: String
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({userId: 1, code: -1, deletedAt: 1}, {unique: true});
        return schema;
    }
}

export default DataAccess.connection.model<IGeneralJournal>('GeneralJournal', GeneralJournalSchema.schema);
