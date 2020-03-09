import IReport from "./interfaces/IReport"; // eslint-disable-line

class ReportUpdate {
    name: string;

    constructor(model: IReport) {
        if (!model)
            return;

        this.name = model.name;
    }
}

Object.seal(ReportUpdate);
export default ReportUpdate;
