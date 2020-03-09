import IRole from './interfaces/IRole'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class Role {
    _id: string;
    name: string;
    level: number;
    code: number;

    constructor(model: IRole) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.name = model.name;
        this.level = model.level;
        this.code = model.code;
    }

    static parseArray(list: IRole[]): Role[] {
        return list && Array.isArray(list) ? list.map(item => new Role(item)) : [];
    }
}

Object.seal(Role);
export default Role;
