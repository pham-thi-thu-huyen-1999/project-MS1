declare class BasQuarterAccountItem {
    status: number;
    originFileId?: any;
    destinyFileId?: any;
    pageImages?: any;
    displayable: boolean;
    beginMonth: number;
    endMonth: number;
    createdAt: Date;
    updatedAt: Date;
    constructor(model: BasQuarterAccountItem);
}
export default BasQuarterAccountItem;
