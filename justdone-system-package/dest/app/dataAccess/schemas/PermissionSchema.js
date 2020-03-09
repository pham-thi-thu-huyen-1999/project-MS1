"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataAccess_1 = require("../DataAccess");
class PermissionSchema {
    static get schema() {
        let schemaDefinition = {
            product: {
                type: Number,
                required: true,
                min: 1
            },
            claim: {
                type: Number,
                required: true,
                min: 1
            },
            fromRole: {
                type: Number,
                required: true,
                min: 1
            },
            toRole: {
                type: Number,
            }
        };
        let schema = DataAccess_1.DataAccess.initSchema(schemaDefinition);
        schema.index({ product: 1, fromRole: 1, toRole: 1 });
        return schema;
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('Permission', PermissionSchema.schema);
