import IGroupExpense from "./interfaces/IGroupExpense"; // eslint-disable-line

class GroupExpenseUpdate {
    userId: string;
    parent: string;
    code: number;
    name: string;
    order: number;
    searchTerm: string;

    constructor(model: IGroupExpense) {
        if (!model)
            return;

        this.userId = model.userId;
        this.parent = model.parent;
        this.code = model.code;
        this.name = model.name;
        if (model.order)
            this.order = model.order;
        this.searchTerm = model.searchTerm;
    }
}

Object.seal(GroupExpenseUpdate);
export default GroupExpenseUpdate;
