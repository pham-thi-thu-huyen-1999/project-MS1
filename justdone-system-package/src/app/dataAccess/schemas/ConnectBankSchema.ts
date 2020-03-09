import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IConnectBank from '../../model/connectBank/interfaces/IConnectBank'; // eslint-disable-line

class ConnectBankSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            status: {
                type: Number,
                default: 1
            },
            type: {
                type: Number,
                default: null
            },
            providerId: {
                type: String,
                required: true,
            },
            providerName: {
                type: String,
                required: true,
            },
            providerAccountId: {
                type: String,
                required: true,
            },
            refreshinfo: {
                lastRefreshed: {
                    type: Date,
                    default: null
                },
                nextRefreshScheduled: {
                    type: Date,
                    default: null
                },
                lastRefreshAttempt: {
                    type: Date,
                    default: null
                },
                statusMessage: {
                    type: String,
                    default: null
                },
                statusCode: {
                    type: Number,
                    default: null
                },
            },
            accountId: {
                type: String,
                default: null
            },
            accountStatus: {
                type: String,
                default: null
            },
            accountNumber: {
                type: String,
                default: null
            },
            accountName: {
                type: String,
                default: null
            },
            currentBalance: {
                type: Number,
                default: 0
            },
            balance: {
                type: Number,
                default: 0
            },
            disabledPullTransaction: {
                type: Boolean,
                default: false
            },
            accounts: {
                type: [mongoose.Schema.Types.Mixed],
                default: []
            },
            isDisabled: {
                type: Boolean,
                default: false
            },
            favicon: {
                type: String,
                default: null
            },
            getTransactionAt: {
                type: Date,
                default: null
            }
        };

        let schema = DataAccess.initSchema(schemaDefinition);
        schema.index({providerAccountId: 1, userId: 1, accountId: 1, deletedAt: 1}, {unique: true});
        return schema;
    }
}

export default DataAccess.connection.model<IConnectBank>('ConnectBank', ConnectBankSchema.schema);
