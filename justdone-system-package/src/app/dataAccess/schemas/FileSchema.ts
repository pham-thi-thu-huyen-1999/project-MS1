import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IFile from '../../model/file/interfaces/IFile'; // eslint-disable-line

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
            }, isFolder: {
                type: Boolean,
                default: false
            },
            parentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File'
            },
            name: {
                type: String,
                required: true
            },
            size: {
                type: Number
            },
            url: {
                type: String
            },
            type: {
                type: Number
            },
            extension: {
                type: String
            },
            prefix: {
                type: String,
            }
        };

        return DataAccess.initSchema(schemaDefinition);
    }
}

export default DataAccess.connection.model<IFile>('File', FileSchema.schema);
