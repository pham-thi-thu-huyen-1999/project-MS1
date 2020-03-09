import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IStatement from '../../model/statement/interfaces/IStatement'; // eslint-disable-line

class StatementSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            year: {
                type: Number,
                required: true
            },
            month: {
                type: Number,
                required: true
            },
            accountId: {
                type: String,
                required: true
            },
            type: {
                type: Number,
                required: true
            },
            openBalance: {
                type: Number,
                required: true
            },
            closeBalance: {
                type: Number,
                required: true
            },
            manualStatement: {
                type: Boolean,
                default: false
            }
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({userId: 1, year: -1, month: -1, accountId: 1, type: 1}, {unique: true});
        return schema;
    }
}

export default DataAccess.connection.model<IStatement>('Statement', StatementSchema.schema);
