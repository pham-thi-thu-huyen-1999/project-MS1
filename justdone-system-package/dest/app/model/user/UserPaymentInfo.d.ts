declare class UserPaymentInfo {
    customerPromotionId?: string;
    customerNoPromotionId?: string;
    subscriptionPromotionId?: string;
    subscriptionNoPromotionId?: string;
    tokenPromotionCard?: string;
    tokenNoPromotionCard?: string;
    planPromotion?: string;
    planNoPromotion?: string;
    constructor(model: UserPaymentInfo);
}
export default UserPaymentInfo;
