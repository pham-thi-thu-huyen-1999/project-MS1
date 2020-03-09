import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IMessage from '../../model/message/interfaces/IMessage'; // eslint-disable-line

class MessageSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            groupReceive: new mongoose.Schema({
                role: {
                    type: Number,
                    required: true
                },
                product: {
                    type: Number,
                    required: false
                }

            }, {_id: false}),
            fileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File',
            },
        };

        return DataAccess.initSchema(schemaDefinition);
    }
}

export default DataAccess.connection.model<IMessage>('Message', MessageSchema.schema);
