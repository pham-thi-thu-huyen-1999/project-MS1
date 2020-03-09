import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IGroupExpense from '../../model/groupExpense/interfaces/IGroupExpense'; // eslint-disable-line

class GroupExpenseSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            parent: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'GroupExpense'
            },
            code: {
                type: Number,
                // required: true,
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
            }]
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({userId: 1, parent: 1, searchTerm: 1}, {unique: true});
        return schema;
    }
}

export default DataAccess.connection.model<IGroupExpense>('GroupExpense', GroupExpenseSchema.schema);
