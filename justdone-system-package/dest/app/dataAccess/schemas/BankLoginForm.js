"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataAccess_1 = require("../DataAccess");
class BankLoginFormSchema {
    static get schema() {
        let schemaDefinition = {
            providerId: {
                type: String,
                required: true
            },
            loginForm: {
                type: Object,
                required: true
            },
        };
        return DataAccess_1.DataAccess.initSchema(schemaDefinition);
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('BankLoginForm', BankLoginFormSchema.schema);
