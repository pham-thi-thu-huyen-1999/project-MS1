import IUser from './interfaces/IUser'; // eslint-disable-line
import {GenderType} from '../common/CommonType';
import DataHelper from '../../../helpers/DataHelper';

class UserUpdate {
    financialStart: number;
    firstName: string;
    lastName: string;
    fullName: string;
    gender?: GenderType;

    constructor(model: IUser) {
        if (!model)
            return;
        this.financialStart = model.financialStart;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.fullName = model.firstName + ' ' + model.lastName;
        this.gender = model.gender;

        DataHelper.handleDataModelInput(this);
    }
}

Object.seal(UserUpdate);
export default UserUpdate;
