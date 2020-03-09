import IFinance from "./interfaces/IFinance"; // eslint-disable-line

class FinanceCreate {
    userId: string;
    financialYear: string;

    constructor(model: IFinance) {
        if (!model)
            return;

        this.userId = model.userId;
        this.financialYear = model.financialYear;
    }
}

Object.seal(FinanceCreate);
export default FinanceCreate;
