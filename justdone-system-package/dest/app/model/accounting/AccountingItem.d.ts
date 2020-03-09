declare class AccountingItem {
    status: number;
    originFileId?: any;
    destinyFileId?: any;
    pageImages?: any;
    displayable: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(model: AccountingItem);
}
export default AccountingItem;
