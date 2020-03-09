import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IInvitation from '../../model/invitation/interfaces/IInvitation'; // eslint-disable-line

class InvitationSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            firstName: {
                type: String,
                required: true,
                max: 20
            },
            lastName: {
                type: String,
                required: true,
                max: 20
            },
            fullName: {
                type: String,
                required: true,
                max: 50
            },
            email: {
                type: String,
                required: true,
                unique: true,
                lowercase: true,
                trim: true,
                max: 100
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            sendAt: {
                type: Date,
                default: Date.now
            },
            token: mongoose.Schema.Types.Mixed
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({email: 1, userId: 1}, {unique: true});
        return schema;
    }
}

export default DataAccess.connection.model<IInvitation>('Invitation', InvitationSchema.schema);
