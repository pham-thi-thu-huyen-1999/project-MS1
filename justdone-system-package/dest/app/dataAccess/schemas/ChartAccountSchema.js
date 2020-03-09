"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataAccess_1 = require("../DataAccess");
class ChartAccountSchema {
    static get schema() {
        let schemaDefinition = {
            code: {
                type: String,
                required: true,
                min: 1
            },
            name: {
                type: String,
                required: true,
                min: 3,
                max: 50
            },
            searchTerm: {
                type: String,
                required: true,
                max: 70,
                index: true
            },
            description: {
                type: String,
                max: 200
            },
            country: {
                type: String,
                max: 20
            },
            usageBudget: {
                type: Boolean,
                default: false
            },
            gstType: {
                type: Number,
                default: 1
            }
        };
        let schema = DataAccess_1.DataAccess.initSchema(schemaDefinition);
        schema.index({ isPublic: -1, searchTerm: 1 });
        return schema;
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('ChartAccount', ChartAccountSchema.schema);
