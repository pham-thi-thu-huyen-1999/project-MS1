"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class CustomPermissionSchema {
    static get schema() {
        let schemaDefinition = {
            claim: {
                type: Number,
                required: true,
                min: 1
            },
            assigner: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Role'
            },
            assignee: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role'
            }
        };
        let schema = DataAccess_1.DataAccess.initSchema(schemaDefinition);
        schema.index({ claim: 1, assigner: 1, assignee: 1 });
        return schema;
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('CustomPermission', CustomPermissionSchema.schema);
