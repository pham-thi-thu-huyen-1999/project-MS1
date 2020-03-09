import * as mongoose from 'mongoose'; // eslint-disable-line
import DataAccess from '../DataAccess';
import INotification from '../../model/notification/interfaces/INotification'; // eslint-disable-line

class NotificationSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            // receiver: [new mongoose.Schema({
            //     id: {
            //         type: mongoose.Schema.Types.ObjectId,
            //         required: true
            //     },
            //     name: {
            //         type: String,
            //         required: false
            //     },
            //     type: {
            //         type: Number,
            //         default: 2,
            //     }
            // })],
            // receivers: {
            //     type: [mongoose.Schema.Types.Mixed],
            //     default: []
            // },
            receiverId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            title: {
                type: String,
                required: true,
                max: 100
            },
            message: {
                type: String,
                required: true,
                max: 500
            },
            isRead: {
                type: Boolean,
                default: false,
            }
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({receiver: 1});
        return schema;
    }
}

export default DataAccess.connection.model<INotification>('Notification', NotificationSchema.schema);
