"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
const CommonType_1 = require("../../model/common/CommonType");
class UserSchema {
    static get schema() {
        let schemaDefinition = {
            email: {
                type: String,
                required: true,
                unique: true,
                lowercase: true,
                trim: true,
                max: 100
            },
            password: {
                type: String,
                required: true
            },
            financialStart: {
                type: Number,
                default: 2016
            },
            firstName: {
                type: String,
                required: true,
                max: 20
            },
            lastName: {
                type: String,
                required: true,
                max: 20
            },
            fullName: {
                type: String,
                required: true,
                max: 50
            },
            gender: Number,
            avatar: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File',
            },
            status: {
                type: Number,
                required: true,
                default: CommonType_1.UserStatus.Inactive
            },
            activationKey: String,
            forgotKey: {
                key: String,
                expiryDate: Date
            },
            yodleeAccount: {
                user: {
                    type: String,
                    default: ''
                },
                password: {
                    type: String,
                    default: ''
                }
            },
            personalInfo: new mongoose.Schema({
                postalName: String,
                tfnCode: String,
                driverLicense: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'File'
                },
                phone: String,
                birthday: Date,
                address: String,
                culture: String,
                currency: String
            }, { _id: false }),
            businessInfo: {
                type: new mongoose.Schema({
                    abnCode: String,
                    entityName: String,
                    entityType: String,
                    type: Number,
                    address: String,
                    avatar: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'File'
                    }
                }, { _id: false }),
                default: {}
            },
            paymentInfo: mongoose.Schema.Types.Mixed,
            paymentCard: mongoose.Schema.Types.Mixed,
            connectedBanks: {
                type: [mongoose.Schema.Types.Mixed],
                default: []
            },
            tradingQuestion: new mongoose.Schema({
                mobiles: mongoose.Schema.Types.Mixed,
                motorVehicle: mongoose.Schema.Types.Mixed,
                utility: mongoose.Schema.Types.Mixed,
                vehicleAttachments: [{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'File'
                    }]
            }, { _id: false }),
            subContractors: [mongoose.Schema.Types.Mixed],
            permission: new mongoose.Schema({
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                role: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Role'
                },
                managers: [{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User'
                    }]
            }, { _id: false }),
            token: mongoose.Schema.Types.Mixed,
            lastAccess: Date,
            chartAccountOpeningBalance: new mongoose.Schema({
                month: Number,
                year: Number,
                dataCoaOpeningBalance: [{
                        coaId: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'ChartAccount'
                        },
                        specialCoaName: String,
                        openingBalance: Number,
                    }]
            }, { _id: false }),
        };
        return DataAccess_1.DataAccess.initSchema(schemaDefinition);
    }
}
exports.default = DataAccess_1.DataAccess.connection.model('User', UserSchema.schema);
