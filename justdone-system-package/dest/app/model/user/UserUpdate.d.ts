import IUser from './interfaces/IUser';
import { GenderType } from '../common/CommonType';
declare class UserUpdate {
    financialStart: number;
    firstName: string;
    lastName: string;
    fullName: string;
    gender?: GenderType;
    constructor(model: IUser);
}
export default UserUpdate;
