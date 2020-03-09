import IGroupReport from "./interfaces/IGroupReport";
declare class GroupReportUpdate {
    code: string;
    name: string;
    order: number;
    searchTerm: string;
    parentId?: any;
    constructor(model: IGroupReport);
}
export default GroupReportUpdate;
