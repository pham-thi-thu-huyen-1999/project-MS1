import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IGroupReport from '../../model/groupReport/interfaces/IGroupReport'; // eslint-disable-line

class GroupReportSchema {
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
                max: 70
            },
            order: {
                type: Number,
                default: 1,
            },
            coas: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ChartAccount',
                default: []
            }],
            parentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'GroupReport'
            },
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        return schema;
    }
}

export default DataAccess.connection.model<IGroupReport>('GroupReport', GroupReportSchema.schema);
