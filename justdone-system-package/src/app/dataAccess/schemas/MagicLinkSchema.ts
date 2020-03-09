import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IMagiclink from '../../model/magiclink/interfaces/IMagiclink'; // eslint-disable-line

class FileSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            productCode: {
                type: Number,
                required: true
            },
            folderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File',
                required: true
            },
            expiredAt: {
                type: Date,
                required: true
            }
        };

        return DataAccess.initSchema(schemaDefinition);
    }
}

export default DataAccess.connection.model<IMagiclink>('MagicLink', FileSchema.schema);
