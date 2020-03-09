import IGroupReport from "./interfaces/IGroupReport"; // eslint-disable-line

class GroupReportCreate {
    code: string;
    name: string;
    order: number;
    searchTerm: string;
    coas: any[];
    parentId?: any;

    constructor(model: IGroupReport) {
        if (!model)
            return;
        this.code = model.code;
        this.name = model.name;
        if (model.order)
            this.order = model.order;
        this.searchTerm = model.searchTerm;
        this.coas = model.coas;
        this.parentId = model.parentId;
    }
}

Object.seal(GroupReportCreate);
export default GroupReportCreate;
