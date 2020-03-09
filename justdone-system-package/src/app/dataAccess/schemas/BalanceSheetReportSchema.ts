import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IBalanceSheetReport from '../../model/balanceSheetReport/interfaces/IBalanceSheetReport'; // eslint-disable-line

class BalanceSheetReportSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            csv: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File',
                required: true
            },
            month: {
                type: Number,
                required: true
            },
            year: {
                type: Number,
                required: true
            }
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({userId: 1, year: -1, month: -1, deletedAt: 1}, {unique: true});
        return schema;
    }
}

export default DataAccess.connection.model<IBalanceSheetReport>('BalanceSheetReport', BalanceSheetReportSchema.schema);
