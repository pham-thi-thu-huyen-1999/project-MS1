export default class StripeHelper {
    static retrieveCoupon(couponId: string): Promise<any>;
    static createStripeToken(cardData: any): Promise<any>;
    static createCustomer(cardTokenId: string, description: string, email: string, metadata: any): Promise<any>;
    static createsubscription(customerId: string, plan: string, coupon?: string): Promise<{}>;
}
