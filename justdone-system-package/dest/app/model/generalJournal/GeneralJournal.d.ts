import IGeneralJournal from "./interfaces/IGeneralJournal";
declare class GeneralJournal {
    _id: any;
    userId: any;
    code: string;
    month: number;
    beginYear: number;
    productId: any;
    createdAt?: Date;
    note?: string;
    constructor(model: IGeneralJournal);
    static parseArray(list: IGeneralJournal[]): GeneralJournal[];
}
export default GeneralJournal;
