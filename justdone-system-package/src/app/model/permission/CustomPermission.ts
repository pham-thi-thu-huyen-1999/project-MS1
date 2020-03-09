import DataHelper from '../../../helpers/DataHelper';
import ICustomPermission from './interfaces/ICustomPermission'; // eslint-disable-line

class CustomPermission {
    claim: number;
    assigner: any;
    assignee: any;

    constructor(model: ICustomPermission) {
        if (!model)
            return;

        this.claim = model.claim;
        this.assigner = DataHelper.handleFileDataModel(model.assigner);
        this.assignee = model.assignee ? DataHelper.handleFileDataModel(model.assignee) : null;
    }

    static parseArray(list: ICustomPermission[]): CustomPermission[] {
        return list && Array.isArray(list) ? list.map(item => new CustomPermission(item)) : [];
    }
}

Object.seal(CustomPermission);
export default CustomPermission;
