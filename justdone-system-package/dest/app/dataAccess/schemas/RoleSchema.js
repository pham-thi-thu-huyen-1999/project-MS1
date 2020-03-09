"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class RoleSchema {
    static get schema() {
        let schemaDefinition = {
            name: {
                type: String,
                required: true,
                unique: true,
                min: 4,
                max: 50
            },
            level: {
                type: Number,
                required: true,
                min: 1
            },
            code: {
                type: Number,
                min: 1
            },
            products: {
                type: [mongoose.Schema.Types.ObjectId],
                default: [],
                ref: 'Product'
            }
        };
        return DataAccess_1.DataAccess.initSchema(schemaDefinition);
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('Role', RoleSchema.schema);
