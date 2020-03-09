"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class ChartAccountAssignmentSchema {
    static get schema() {
        let schemaDefinition = {
            coa: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ChartAccount',
                required: true
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            client: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        };
        let schema = DataAccess_1.DataAccess.initSchema(schemaDefinition);
        schema.index({ product: 1, coa: 1, client: 1 }, { unique: true });
        return schema;
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('ChartAccountAssignment', ChartAccountAssignmentSchema.schema);
