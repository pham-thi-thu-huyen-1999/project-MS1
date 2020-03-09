import * as mongoose from 'mongoose'; // eslint-disable-line
import {DataAccess} from '../DataAccess';
import IProduct from '../../model/product/interfaces/IProduct'; // eslint-disable-line

class ProductSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            code: {
                type: Number,
                required: true,
                unique: true
            },
            name: {
                type: String,
                required: true,
                unique: true,
                min: 3,
                max: 50
            },
            type: {
                type: Number,
                required: true
            },
            logo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File',
            },
            favicon: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File',
            },
            isCompleted: {
                type: Boolean,
                default: false
            },
            config: {
                type: new mongoose.Schema({
                    domain: {
                        type: String,
                        required: true
                    },
                    colorScheme: {
                        type: Number,
                        required: true
                    },
                    emailSupport: {
                        type: String,
                        required: true
                    },
                    nameSupport: {
                        type: String,
                        required: true
                    },
                    financialYear: {
                        type: mongoose.Schema.Types.Mixed,
                        required: true
                    }
                }, {_id: false}),
                required: true
            }
        };

        return DataAccess.initSchema(schemaDefinition);
    }
}

export default DataAccess.connection.model<IProduct>('Product', ProductSchema.schema);
