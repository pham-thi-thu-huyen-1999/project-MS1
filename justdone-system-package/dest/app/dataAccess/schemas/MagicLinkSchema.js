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
            },
            folderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File',
                required: true
            },
            expiredAt: {
                type: Date,
                required: true
            }
        };
        return DataAccess_1.DataAccess.initSchema(schemaDefinition);
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('MagicLink', FileSchema.schema);
