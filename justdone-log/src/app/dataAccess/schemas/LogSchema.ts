import * as mongoose from 'mongoose'; // eslint-disable-line
import DataAccess from '../DataAccess';
import ILog from '../../model/log/interfaces/ILog'; // eslint-disable-line

class LogSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            system: {
                type: String,
                required: true,
                max: 100
            },
            module: {
                type: String,
                required: false,
                max: 100
            },
            method: {
                type: String,
                required: true
            },
            path: {
                type: String,
                required: false,
                max: 100
            },
            description: {
                type: String,
                required: true,
                max: 500
            },
            status: {
                type: Number,
                required: true
            }
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({system: 1, module: 1});
        return schema;
    }
}

export default DataAccess.connection.model<ILog>('Log', LogSchema.schema);
