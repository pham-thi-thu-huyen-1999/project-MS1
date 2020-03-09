"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
class ProductSchema {
    static get schema() {
        let schemaDefinition = {
            code: {
                type: Number,
                required: true,
                unique: true
            },
            name: {
                type: String,
                required: true,
                unique: true,
                min: 3,
                max: 50
            },
            type: {
                type: Number,
                required: true
            },
            logo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File',
            },
            favicon: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File',
            },
            isCompleted: {
                type: Boolean,
                default: false
            },
            config: {
                type: new mongoose.Schema({
                    domain: {
                        type: String,
                        required: true
                    },
                    colorScheme: {
                        type: Number,
                        required: true
                    },
                    emailSupport: {
                        type: String,
                        required: true
                    },
                    nameSupport: {
                        type: String,
                        required: true
                    },
                    financialYear: {
                        type: mongoose.Schema.Types.Mixed,
                        required: true
                    }
                }, { _id: false }),
                required: true
            }
        };
        return DataAccess_1.DataAccess.initSchema(schemaDefinition);
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('Product', ProductSchema.schema);
