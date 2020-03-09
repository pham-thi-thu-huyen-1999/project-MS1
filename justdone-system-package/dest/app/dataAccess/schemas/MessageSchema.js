"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class MessageSchema {
    static get schema() {
        let schemaDefinition = {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            groupReceive: new mongoose.Schema({
                role: {
                    type: Number,
                    required: true
                },
                product: {
                    type: Number,
                    required: false
                }
            }, { _id: false }),
            fileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File',
            },
        };
        return DataAccess_1.DataAccess.initSchema(schemaDefinition);
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('Message', MessageSchema.schema);
