"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class FileSchema {
    static get schema() {
        let schemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            productCode: {
                type: Number,
                required: true
            }, isFolder: {
                type: Boolean,
                default: false
            },
            parentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File'
            },
            name: {
                type: String,
                required: true
            },
            size: {
                type: Number
            },
            url: {
                type: String
            },
            type: {
                type: Number
            },
            extension: {
                type: String
            },
            prefix: {
                type: String,
            }
        };
        return DataAccess_1.DataAccess.initSchema(schemaDefinition);
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('File', FileSchema.schema);
