class UserPaymentCard {
    name?: string;
    lastFourDigit?: string;
    expiredMonth?: string;
    expiredYear?: string;

    constructor(model: UserPaymentCard) {
        if (!model)
            return;

        this.name = model.name;
        this.lastFourDigit = model.lastFourDigit;
        this.expiredMonth = model.expiredMonth;
        this.expiredYear = model.expiredYear;
    }
}

Object.seal(UserPaymentCard);
export default UserPaymentCard;
