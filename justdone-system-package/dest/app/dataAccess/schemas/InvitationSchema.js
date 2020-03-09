"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class InvitationSchema {
    static get schema() {
        let schemaDefinition = {
            firstName: {
                type: String,
                required: true,
                max: 20
            },
            lastName: {
                type: String,
                required: true,
                max: 20
            },
            fullName: {
                type: String,
                required: true,
                max: 50
            },
            email: {
                type: String,
                required: true,
                unique: true,
                lowercase: true,
                trim: true,
                max: 100
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            sendAt: {
                type: Date,
                default: Date.now
            },
            token: mongoose.Schema.Types.Mixed
        };
        let schema = DataAccess_1.DataAccess.initSchema(schemaDefinition);
        schema.index({ email: 1, userId: 1 }, { unique: true });
        return schema;
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('Invitation', InvitationSchema.schema);
