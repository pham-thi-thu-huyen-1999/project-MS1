import IChartAccountAssignment from "./interfaces/IChartAccountAssignment"; // eslint-disable-line

class ChartAccountAssignmentUpdate {
    coa: string;
    product: string;
    client: string;

    constructor(model: IChartAccountAssignment) {
        if (!model)
            return;

        this.coa = model.coa;
        this.product = model.product;
        this.client = model.client;
    }
}

Object.seal(ChartAccountAssignmentUpdate);
export default ChartAccountAssignmentUpdate;
