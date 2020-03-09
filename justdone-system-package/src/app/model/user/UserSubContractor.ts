class UserSubContractor {
    name?: string;
    abnCode?: string;

    constructor(model: UserSubContractor) {
        if (!model)
            return;

        this.name = model.name;
        this.abnCode = model.abnCode;
    }

    static parseArray(list: UserSubContractor[]): UserSubContractor[] {
        return list && Array.isArray(list) ? list.map(item => new UserSubContractor(item)) : [];
    }
}

Object.seal(UserSubContractor);
export default UserSubContractor;
