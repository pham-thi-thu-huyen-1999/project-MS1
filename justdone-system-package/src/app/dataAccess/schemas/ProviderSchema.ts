import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IProvider from '../../model/provider/interfaces/IProvider'; // eslint-disable-line

class ProviderSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            name: {
                type: String,
                required: true,
            },
            loginUrl: {
                type: String,
                required: true,
            },
            baseUrl: {
                type: String,
                required: true
            },
            favicon: {
                type: String,
                required: true
            },
            logo: {
                type: String,
                required: String
            },
            bankId: {
                type: Number,
                required: true
            },
            countryISOCode: {
                type: String,
                default: ''
            },
            languageISOCode: {
                type: String,
                default: ''
            }
        };

        return DataAccess.initSchema(schemaDefinition);
    }
}

export default DataAccess.connection.model<IProvider>('Provider', ProviderSchema.schema);
