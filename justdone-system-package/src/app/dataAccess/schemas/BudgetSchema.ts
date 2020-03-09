import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IBudget from '../../model/budget/interfaces/IBudget'; // eslint-disable-line

class BudgetSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            year: {
                type: Number,
                required: true
            },
            month: {
                type: Number,
                required: true
            },
            coaId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ChartAccount',
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({userId: 1, year: -1, month: -1, coaId: 1}, {unique: true});
        return schema;
    }
}

export default DataAccess.connection.model<IBudget>('Budget', BudgetSchema.schema);
