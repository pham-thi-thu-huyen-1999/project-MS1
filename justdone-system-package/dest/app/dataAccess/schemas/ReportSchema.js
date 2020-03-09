"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataAccess_1 = require("../DataAccess");
class ReportSchema {
    static get schema() {
        let schemaDefinition = {
            name: {
                type: String,
                required: true,
                trim: true,
                min: 4,
                max: 50
            }
        };
        return DataAccess_1.DataAccess.initSchema(schemaDefinition);
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('Report', ReportSchema.schema);
