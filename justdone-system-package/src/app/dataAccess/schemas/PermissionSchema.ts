import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IPermission from '../../model/permission/interfaces/IPermission'; // eslint-disable-line

class PermissionSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            product: {
                type: Number,
                required: true,
                min: 1
            },
            claim: {
                type: Number,
                required: true,
                min: 1
            },
            fromRole: {
                type: Number,
                required: true,
                min: 1
            },
            toRole: {
                type: Number,
            }
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({product: 1, fromRole: 1, toRole: 1});
        return schema;
    }
}

export default DataAccess.connection.model<IPermission>('Permission', PermissionSchema.schema);
