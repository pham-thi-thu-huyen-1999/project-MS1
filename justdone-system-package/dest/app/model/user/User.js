"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserPersonalInfo_1 = require("./UserPersonalInfo");
const UserBusinessInfo_1 = require("./UserBusinessInfo");
const UserPaymentInfo_1 = require("./UserPaymentInfo");
const UserPaymentCard_1 = require("./UserPaymentCard");
const UserConnectedBank_1 = require("./UserConnectedBank");
const UserChartAccountOpeningBalance_1 = require("./UserChartAccountOpeningBalance");
const UserTradingQuestion_1 = require("./UserTradingQuestion");
const UserSubContractor_1 = require("./UserSubContractor");
const UserPermission_1 = require("./UserPermission");
const UserToken_1 = require("./UserToken");
const DataHelper_1 = require("../../../helpers/DataHelper");
class User {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.email = model.email;
        this.financialStart = model.financialStart;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.fullName = model.fullName;
        this.gender = model.gender;
        this.avatar = DataHelper_1.default.handleFileDataModel(model.avatar);
        this.status = model.status;
        this.activationKey = model.activationKey;
        this.forgotKey = model.forgotKey;
        this.yodleeAccount = model.yodleeAccount;
        this.personalInfo = model.personalInfo && new UserPersonalInfo_1.default(model.personalInfo);
        this.businessInfo = model.businessInfo && new UserBusinessInfo_1.default(model.businessInfo);
        this.paymentInfo = model.paymentInfo && new UserPaymentInfo_1.default(model.paymentInfo);
        this.paymentCard = model.paymentCard && new UserPaymentCard_1.default(model.paymentCard);
        this.connectedBanks = model.connectedBanks && Array.isArray(model.connectedBanks) ? UserConnectedBank_1.default.parseArray(model.connectedBanks) : [];
        this.tradingQuestion = model.tradingQuestion && new UserTradingQuestion_1.default(model.tradingQuestion);
        this.subContractors = model.subContractors && Array.isArray(model.subContractors) ? UserSubContractor_1.default.parseArray(model.subContractors) : [];
        this.chartAccountOpeningBalance = model.chartAccountOpeningBalance && new UserChartAccountOpeningBalance_1.default(model.chartAccountOpeningBalance);
        this.permission = model.permission && new UserPermission_1.default(model.permission);
        this.token = model.token && new UserToken_1.default(model.token);
        this.lastAccess = model.lastAccess;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new User(item)) : [];
    }
}
Object.seal(User);
exports.default = User;
