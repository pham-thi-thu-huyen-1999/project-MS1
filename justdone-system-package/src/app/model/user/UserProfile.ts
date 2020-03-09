import IUser from '../user/interfaces/IUser'; // eslint-disable-line
import {GenderType, UserStatus} from '../common/CommonType';
import DataHelper from '../../../helpers/DataHelper';

class UserProfile {
    email: string;
    financialStart: number;
    firstName: string;
    lastName: string;
    gender?: GenderType;
    avatar?: any;
    status: UserStatus;

    constructor(model: IUser) {
        if (!model)
            return;

        this.email = model.email;
        this.financialStart = model.financialStart;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.gender = model.gender;
        this.avatar = DataHelper.handleFileDataModel(model.avatar);
        this.status = model.status;
    }
}

Object.seal(UserProfile);
export default UserProfile;
