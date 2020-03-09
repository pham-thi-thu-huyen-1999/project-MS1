import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IBankLoginForm from '../../model/bankLoginForm/interfaces/IBankLoginForm'; // eslint-disable-line

class BankLoginFormSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            providerId: {
                type: String,
                required: true
            },
            loginForm: {
                type: Object,
                required: true
            },
        };

        return DataAccess.initSchema(schemaDefinition);
    }
}

export default DataAccess.connection.model<IBankLoginForm>('BankLoginForm', BankLoginFormSchema.schema);
