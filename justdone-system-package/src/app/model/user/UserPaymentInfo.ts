class UserPaymentInfo {
    customerPromotionId?: string;
    customerNoPromotionId?: string;
    subscriptionPromotionId?: string;
    subscriptionNoPromotionId?: string;
    tokenPromotionCard?: string;
    tokenNoPromotionCard?: string;
    planPromotion?: string;
    planNoPromotion?: string;

    constructor(model: UserPaymentInfo) {
        if (!model)
            return;

        this.customerPromotionId = model.customerPromotionId;
        this.customerNoPromotionId = model.customerNoPromotionId;
        this.subscriptionPromotionId = model.subscriptionPromotionId;
        this.subscriptionNoPromotionId = model.subscriptionNoPromotionId;
        this.tokenPromotionCard = model.tokenPromotionCard;
        this.tokenNoPromotionCard = model.tokenNoPromotionCard;
        this.planPromotion = model.planPromotion;
        this.planNoPromotion = model.planNoPromotion;
    }
}

Object.seal(UserPaymentInfo);
export default UserPaymentInfo;
