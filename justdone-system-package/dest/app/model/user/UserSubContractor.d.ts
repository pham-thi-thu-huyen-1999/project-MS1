declare class UserSubContractor {
    name?: string;
    abnCode?: string;
    constructor(model: UserSubContractor);
    static parseArray(list: UserSubContractor[]): UserSubContractor[];
}
export default UserSubContractor;
