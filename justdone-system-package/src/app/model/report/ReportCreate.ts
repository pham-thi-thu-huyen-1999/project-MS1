import IReport from "./interfaces/IReport"; // eslint-disable-line

class ReportCreate {
    name: string;

    constructor(model: IReport) {
        if (!model)
            return;

        this.name = model.name;
    }
}

Object.seal(ReportCreate);
export default ReportCreate;
