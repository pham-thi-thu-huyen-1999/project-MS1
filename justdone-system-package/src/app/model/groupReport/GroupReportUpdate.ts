import IGroupReport from "./interfaces/IGroupReport"; // eslint-disable-line

class GroupReportUpdate {
    code: string;
    name: string;
    order: number;
    searchTerm: string;
    parentId?: any;

    constructor(model: IGroupReport) {
        if (!model)
            return;
        this.code = model.code;
        this.name = model.name;
        if (model.order)
            this.order = model.order;
        this.searchTerm = model.searchTerm;
        this.parentId = model.parentId;
    }
}

Object.seal(GroupReportUpdate);
export default GroupReportUpdate;
