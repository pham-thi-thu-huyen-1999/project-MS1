import IUser from '../user/interfaces/IUser';
import { GenderType, UserStatus } from '../common/CommonType';
declare class UserProfile {
    email: string;
    financialStart: number;
    firstName: string;
    lastName: string;
    gender?: GenderType;
    avatar?: any;
    status: UserStatus;
    constructor(model: IUser);
}
export default UserProfile;
