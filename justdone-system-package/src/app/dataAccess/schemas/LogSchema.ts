import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import ILog from '../../model/log/interfaces/ILog'; // eslint-disable-line

class LogSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            ipAddress: {
                type: String,
                required: true
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: false,
                index: true
            },
            productCode: {
                type: Number,
                required: true
            },
            url: {
                type: String,
                required: true
            },
            method: {
                type: String,
                required: true
            },
            content: {
                type: String,
                required: false
            },
            description: {
                type: mongoose.Schema.Types.Mixed,
                required: false
            },
            status: {
                type: Number,
                required: true
            },
            device: {
                type: String,
                required: false
            }
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({createdAt: 1, status: 1}, {unique: true});
        return schema;
    }
}

export default DataAccess.connection.model<ILog>('Log', LogSchema.schema);
