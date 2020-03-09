
class GeneralJournalItemExtend {
    amount: number;
    description: string;
    isCredit: boolean;

    constructor(model: GeneralJournalItemExtend) {
        if (!model)
            return;
        this.amount = model.amount;
        this.description = model.description;
        this.isCredit = model.isCredit;
    }
}

Object.seal(GeneralJournalItemExtend);
export default GeneralJournalItemExtend;
