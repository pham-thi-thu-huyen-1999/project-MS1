import * as stripe from 'stripe';
import {Config} from '../config';

export default class StripeHelper {
    static async retrieveCoupon(couponId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            stripe(Config.PROJECT.STRIPE.KEY).coupons.retrieve(couponId, async (err, coupon) => {
                console.log(coupon);
                if (err)
                    reject(err);
                else
                    resolve(coupon);
            });
        });
    }

    static async createStripeToken(cardData: any): Promise<any> {
        return new Promise((resolve, reject) => {
            stripe(Config.PROJECT.STRIPE.KEY).tokens.create({
                card: {
                    number: cardData.numberCard,
                    exp_month: cardData.expMonth,
                    exp_year: cardData.expYear,
                    cvc: cardData.cvc,
                    name: cardData.nameOnCard
                }
            }, async (err, cardToken) => {
                console.log(cardToken);
                if (err)
                    reject(err);
                else
                    resolve(cardToken);
            });
        });
    }

    static async createCustomer(cardTokenId: string, description: string, email: string, metadata: any): Promise<any> {
        return new Promise((resolve, reject) => {
            stripe(Config.PROJECT.STRIPE.KEY).customers.create({
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
    }

    static createsubscription(customerId: string, plan: string, coupon: string = '') {
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
            stripe(Config.PROJECT.STRIPE.KEY).subscriptions.create(createSubscriptData, (err, customer) => {
                if (err)
                    reject(err);
                else
                    resolve(customer);
            });
        });
    }
}
