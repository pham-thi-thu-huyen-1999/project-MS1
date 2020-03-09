import * as mongoose from 'mongoose';
import {Config} from '../../config';

export class DataAccess {
    static get connection(): mongoose.Connection {
        return mongoose.connection;
    }

    static connect(uri?: string): mongoose.Connection {
        (<any>mongoose).Promise = Promise;

        if (!uri)
            uri = Config.PROJECT.DB_CONN_URI;

        let options = <any>{
            poolSize: 10, // default is 5
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 500, // Reconnect every 500ms
            useNewUrlParser: true
        };

        if (process.env.NODE_ENV !== 'Development' && Config.PROJECT.DATABASE.USERNAME) {
            options.user = Config.PROJECT.DATABASE.USERNAME;
            options.pass = Config.PROJECT.DATABASE.PASSWORD;
        }

        mongoose.connect(uri, options);
        return mongoose.connection;
    }

    static initSchema(schemaDefinition: mongoose.SchemaDefinition): mongoose.Schema {
        schemaDefinition.createdAt = {
            type: Date,
            default: Date.now
        };
        schemaDefinition.updatedAt = {
            type: Date,
            default: Date.now
        };
        schemaDefinition.deletedAt = {
            type: Date,
            default: null
        };

        let schema = new mongoose.Schema(schemaDefinition);

        schema.pre('update', function(this: any, next) {
            // this.update({}, {$set: {updatedAt: new Date()}});
            this.updatedAt = Date.now; // eslint-disable-line
            next();
        });

        return schema;
    }
};
