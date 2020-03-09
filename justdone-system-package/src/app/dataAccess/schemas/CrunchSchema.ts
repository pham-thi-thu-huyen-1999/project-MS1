import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import ICrunch from '../../model/crunch/interfaces/ICrunch'; // eslint-disable-line

class CrunchSchema {
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
            accountId: {
                type: Number,
                required: true
            },
            type: {
                type: Number,
                required: true
            },
            income: {
                type: Number,
                default: 0
            },
            coaAmounts: [new mongoose.Schema({
                coaId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'ChartAccount',
                    required: true
                },
                amount: {
                    type: Number,
                    default: 0
                }
            }, {_id: false})],
            approvedAt: {
                type: Date,
                default: null
            },
            completedAt: {
                type: Date,
                default: null
            },
            amendedAt: {
                type: Date,
                default: null
            },
            startedAt: {
                type: Date,
                default: null
            }
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({userId: 1, year: -1, month: -1, accountId: 1, type: 1}, {unique: true});
        return schema;
    }
}

export default DataAccess.connection.model<ICrunch>('Crunch', CrunchSchema.schema);
