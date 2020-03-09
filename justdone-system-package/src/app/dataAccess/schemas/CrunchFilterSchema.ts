import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import ICrunchFilter from '../../model/crunchFilter/interfaces/ICrunchFilter'; // eslint-disable-line

class CrunchFilterSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            isGlobal: {
                type: Boolean,
                required: true,
            },
            groupId: {
                type: Number,
                required: true
            },
            baseType: {
                type: String,
                required: true
            },
            groupName: {
                type: String,
                required: true
            },
            coaId: String,
            coaName: String,
            used: {
                type: Number,
                default: 0
            },
            bankId: Number,
            accountType: Number,
            conditions: [new mongoose.Schema({
                operation: String,
                description: String
            }, {_id: false})]
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        return schema;
    }
}

export default DataAccess.connection.model<ICrunchFilter>('CrunchFilter', CrunchFilterSchema.schema);
