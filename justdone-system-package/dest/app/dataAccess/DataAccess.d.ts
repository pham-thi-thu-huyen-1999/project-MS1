import * as mongoose from 'mongoose';
export declare class DataAccess {
    static readonly connection: mongoose.Connection;
    static connect(uri?: string): mongoose.Connection;
    static initSchema(schemaDefinition: mongoose.SchemaDefinition): mongoose.Schema;
}
