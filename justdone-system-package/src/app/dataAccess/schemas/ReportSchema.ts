import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IReport from '../../model/report/interfaces/IReport'; // eslint-disable-line

class ReportSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            name: {
                type: String,
                required: true,
                trim: true,
                min: 4,
                max: 50
            }
        };

        return DataAccess.initSchema(schemaDefinition);
    }
}

export default DataAccess.connection.model<IReport>('Report', ReportSchema.schema);
