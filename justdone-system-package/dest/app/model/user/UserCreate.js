"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserPersonalInfo_1 = require("./UserPersonalInfo");
const UserBusinessInfo_1 = require("./UserBusinessInfo");
const UserPaymentInfo_1 = require("./UserPaymentInfo");
const UserPaymentCard_1 = require("./UserPaymentCard");
const UserToken_1 = require("./UserToken");
class UserCreate {
    constructor(model) {
        if (!model)
            return;
        this.email = model.email;
        this.password = model.password;
        this.financialStart = model.financialStart;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.fullName = model.firstName + ' ' + model.lastName;
        this.gender = model.gender;
        this.avatar = model.avatar;
        this.status = model.status;
        this.activationKey = model.activationKey;
        this.personalInfo = model.personalInfo && new UserPersonalInfo_1.default(model.personalInfo);
        this.businessInfo = model.businessInfo && new UserBusinessInfo_1.default(model.businessInfo);
        this.paymentInfo = model.paymentInfo && new UserPaymentInfo_1.default(model.paymentInfo);
        this.paymentCard = model.paymentCard && new UserPaymentCard_1.default(model.paymentCard);
        this.token = model.token && new UserToken_1.default(model.token);
    }
}
Object.seal(UserCreate);
exports.default = UserCreate;
