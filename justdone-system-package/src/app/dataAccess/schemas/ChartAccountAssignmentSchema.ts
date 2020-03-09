import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IChartAccountAssignment from '../../model/chartAccountAssignment/interfaces/IChartAccountAssignment'; // eslint-disable-line

class ChartAccountAssignmentSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            coa: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ChartAccount',
                required: true
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            client: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({product: 1, coa: 1, client: 1}, {unique: true});
        return schema;
    }
}

export default DataAccess.connection.model<IChartAccountAssignment>('ChartAccountAssignment', ChartAccountAssignmentSchema.schema);
