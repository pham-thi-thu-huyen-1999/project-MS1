import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IUsageBudget from '../../model/usageBudget/interfaces/IUsageBudget'; // eslint-disable-line

class UsageBudget {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            coaId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ChartAccount',
                required: true
            },
            beginYear: {
                type: Number,
                required: true
            },
            percentUsage: {
                type: Number,
                required: true
            }
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({userId: 1, beginYear: -1, coaId: -1, deletedAt: 1}, {unique: true});
        return schema;
    }
}

export default DataAccess.connection.model<IUsageBudget>('UsageBudget', UsageBudget.schema);
