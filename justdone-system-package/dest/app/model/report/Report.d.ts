import IReport from './interfaces/IReport';
declare class Report {
    _id: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(model: IReport);
    static parseArray(list: IReport[]): Report[];
}
export default Report;
