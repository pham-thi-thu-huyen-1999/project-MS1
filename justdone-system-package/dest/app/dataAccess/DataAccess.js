"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const config_1 = require("../../config");
class DataAccess {
    static get connection() {
        return mongoose.connection;
    }
    static connect(uri) {
        mongoose.Promise = Promise;
        if (!uri)
            uri = config_1.Config.PROJECT.DB_CONN_URI;
        let options = {
            poolSize: 10,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500,
            useNewUrlParser: true
        };
        if (process.env.NODE_ENV !== 'Development' && config_1.Config.PROJECT.DATABASE.USERNAME) {
            options.user = config_1.Config.PROJECT.DATABASE.USERNAME;
            options.pass = config_1.Config.PROJECT.DATABASE.PASSWORD;
        }
        mongoose.connect(uri, options);
        return mongoose.connection;
    }
    static initSchema(schemaDefinition) {
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
        schema.pre('update', function (next) {
            this.updatedAt = Date.now;
            next();
        });
        return schema;
    }
}
exports.DataAccess = DataAccess;
;
