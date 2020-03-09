import IGroupReport from './interfaces/IGroupReport';
declare class GroupReport {
    _id: string;
    code: string;
    name: string;
    searchTerm: string;
    coas: any[];
    order: number;
    parentId?: any;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(model: IGroupReport);
    static parseArray(list: IGroupReport[]): GroupReport[];
}
export default GroupReport;
