"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe = require("stripe");
const config_1 = require("../config");
class StripeHelper {
    static retrieveCoupon(couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                stripe(config_1.Config.PROJECT.STRIPE.KEY).coupons.retrieve(couponId, (err, coupon) => __awaiter(this, void 0, void 0, function* () {
                    console.log(coupon);
                    if (err)
                        reject(err);
                    else
                        resolve(coupon);
                }));
            });
        });
    }
    static createStripeToken(cardData) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                stripe(config_1.Config.PROJECT.STRIPE.KEY).tokens.create({
                    card: {
                        number: cardData.numberCard,
                        exp_month: cardData.expMonth,
                        exp_year: cardData.expYear,
                        cvc: cardData.cvc,
                        name: cardData.nameOnCard
                    }
                }, (err, cardToken) => __awaiter(this, void 0, void 0, function* () {
                    console.log(cardToken);
                    if (err)
                        reject(err);
                    else
                        resolve(cardToken);
                }));
            });
        });
    }
    static createCustomer(cardTokenId, description, email, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                stripe(config_1.Config.PROJECT.STRIPE.KEY).customers.create({
                    description: description,
                    source: cardTokenId,
                    email: email,
                    metadata: metadata
                }, (err, customer) => {
                    if (err)
                        reject(err);
                    else
                        resolve(customer);
                });
            });
        });
    }
    static createsubscription(customerId, plan, coupon = '') {
        let createSubscriptData = {
            customer: customerId,
            items: [
                {
                    plan: plan,
                },
            ]
        };
        if (coupon)
            createSubscriptData['coupon'] = coupon;
        return new Promise((resolve, reject) => {
            stripe(config_1.Config.PROJECT.STRIPE.KEY).subscriptions.create(createSubscriptData, (err, customer) => {
                if (err)
                    reject(err);
                else
                    resolve(customer);
            });
        });
    }
}
exports.default = StripeHelper;
