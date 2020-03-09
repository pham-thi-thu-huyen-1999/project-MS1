import IChartAccount from "./interfaces/IChartAccount"; // eslint-disable-line

class ChartAccountUpdate {
    code: string;
    name: string;
    searchTerm: string;
    description?: string;
    country?: string;

    constructor(model: IChartAccount) {
        if (!model)
            return;

        this.code = model.code;
        this.name = model.name;
        this.searchTerm = model.searchTerm;
        this.description = model.description;
        this.country = model.country;
    }
}

Object.seal(ChartAccountUpdate);
export default ChartAccountUpdate;
