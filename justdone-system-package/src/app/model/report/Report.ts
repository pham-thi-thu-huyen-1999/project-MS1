import IReport from './interfaces/IReport'; // eslint-disable-line

class Report {
    _id: string;
    name: string;

    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IReport) {
        if (!model)
            return;

        this._id = model._id && model._id.toString();
        this.name = model.name;

        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IReport[]): Report[] {
        return list && Array.isArray(list) ? list.map(item => new Report(item)) : [];
    }
}

Object.seal(Report);
export default Report;
