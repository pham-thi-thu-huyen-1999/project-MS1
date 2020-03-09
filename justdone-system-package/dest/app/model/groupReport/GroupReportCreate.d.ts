import IGroupReport from "./interfaces/IGroupReport";
declare class GroupReportCreate {
    code: string;
    name: string;
    order: number;
    searchTerm: string;
    coas: any[];
    parentId?: any;
    constructor(model: IGroupReport);
}
export default GroupReportCreate;
