"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserPaymentInfo {
    constructor(model) {
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
exports.default = UserPaymentInfo;
