import * as mongoose from 'mongoose'; // eslint-disable-line
import DataAccess from '../DataAccess';
import IHistory from '../../model/history/interfaces/IHistory'; // eslint-disable-line

class HistorySchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            roleId: {
                type: mongoose.Schema.Types.ObjectId,
                required: false
            },
            productCode: {
                type: Number,
                required: false
            },
            target: new mongoose.Schema({
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: false,
                },
                email: {
                    type: String,
                    required: false,
                    max: 50
                }
            }, {_id: false}),
            claim: {
                type: Number,
                required: false
            },
            description: {
                type: String,
                required: true,
                max: 500
            },
            status: {
                type: Number,
                required: true,
            }
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({receiver: 1});
        return schema;
    }
}

export default DataAccess.connection.model<IHistory>('History', HistorySchema.schema);
