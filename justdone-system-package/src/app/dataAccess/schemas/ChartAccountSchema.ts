import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IChartAccount from '../../model/chartAccount/interfaces/IChartAccount'; // eslint-disable-line

class ChartAccountSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            code: {
                type: String,
                required: true,
                min: 1
            },
            name: {
                type: String,
                required: true,
                min: 3,
                max: 50
            },
            searchTerm: {
                type: String,
                required: true,
                max: 70,
                index: true
            },
            description: {
                type: String,
                max: 200
            },
            country: {
                type: String,
                max: 20
            },
            usageBudget: {
                type: Boolean,
                default: false
            },
            gstType: {
                type: Number,
                default: 1
            }
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({isPublic: -1, searchTerm: 1});
        return schema;
    }
}

export default DataAccess.connection.model<IChartAccount>('ChartAccount', ChartAccountSchema.schema);
