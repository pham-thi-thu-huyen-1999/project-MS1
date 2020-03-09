import IRole from './interfaces/IRole'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class Role {
    _id: string;
    name: string;
    level: number;
    code: number;
    products: any[];

    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IRole) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.name = model.name;
        this.level = model.level;
        this.code = model.code;
        this.products = model.products && Array.isArray(model.products) ? model.products.map(product => DataHelper.handleIdDataModel(product)) : [];

        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IRole[]): Role[] {
        return list && Array.isArray(list) ? list.map(item => new Role(item)) : [];
    }
}

Object.seal(Role);
export default Role;
