"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataAccess_1 = require("../DataAccess");
class ProviderSchema {
    static get schema() {
        let schemaDefinition = {
            name: {
                type: String,
                required: true,
            },
            loginUrl: {
                type: String,
                required: true,
            },
            baseUrl: {
                type: String,
                required: true
            },
            favicon: {
                type: String,
                required: true
            },
            logo: {
                type: String,
                required: String
            },
            bankId: {
                type: Number,
                required: true
            },
            countryISOCode: {
                type: String,
                default: ''
            },
            languageISOCode: {
                type: String,
                default: ''
            }
        };
        return DataAccess_1.DataAccess.initSchema(schemaDefinition);
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('Provider', ProviderSchema.schema);
