import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IRole from '../../model/role/interfaces/IRole'; // eslint-disable-line

class RoleSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            name: {
                type: String,
                required: true,
                unique: true,
                min: 4,
                max: 50
            },
            level: {
                type: Number,
                required: true,
                min: 1
            },
            code: {
                type: Number,
                min: 1
            },
            products: {
                type: [mongoose.Schema.Types.ObjectId],
                default: [],
                ref: 'Product'
            }
        };

        return DataAccess.initSchema(schemaDefinition);
    }
}

export default DataAccess.connection.model<IRole>('Role', RoleSchema.schema);
