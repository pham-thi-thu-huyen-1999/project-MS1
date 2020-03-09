import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import ICustomPermission from '../../model/permission/interfaces/ICustomPermission'; // eslint-disable-line

class CustomPermissionSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            claim: {
                type: Number,
                required: true,
                min: 1
            },
            assigner: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Role'
            },
            assignee: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role'
            }
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({claim: 1, assigner: 1, assignee: 1});
        return schema;
    }
}

export default DataAccess.connection.model<ICustomPermission>('CustomPermission', CustomPermissionSchema.schema);
