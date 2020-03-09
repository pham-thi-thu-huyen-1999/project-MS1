import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IGroupExpense from '../../model/groupExpense/interfaces/IGroupExpense'; // eslint-disable-line

class GroupExpenseSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            reportType: {
                type: Number,
                required: true
            },
            code: {
                type: Number,
                required: true,
                min: 1
            },
            groupId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'GroupReport',
                required: true
            },
            isCreditAsPositive: {
                type: Boolean,
                default: true
            }
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({reportType: 1, code: 1, groupId: 1}, {unique: true});
        return schema;
    }
}

export default DataAccess.connection.model<IGroupExpense>('SettingReport', GroupExpenseSchema.schema);
