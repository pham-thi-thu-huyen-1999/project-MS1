"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class GroupReportSchema {
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
                max: 70
            },
            order: {
                type: Number,
                default: 1,
            },
            coas: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'ChartAccount',
                    default: []
                }],
            parentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'GroupReport'
            },
        };
        let schema = DataAccess_1.DataAccess.initSchema(schemaDefinition);
        return schema;
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('GroupReport', GroupReportSchema.schema);
