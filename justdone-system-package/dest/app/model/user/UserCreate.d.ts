import IUser from './interfaces/IUser';
import UserPersonalInfo from './UserPersonalInfo';
import UserBusinessInfo from './UserBusinessInfo';
import UserPaymentInfo from './UserPaymentInfo';
import UserPaymentCard from './UserPaymentCard';
import UserPermission from './UserPermission';
import UserToken from './UserToken';
import { GenderType, UserStatus } from '../common/CommonType';
declare class UserCreate {
    email: string;
    password?: string;
    financialStart: number;
    firstName: string;
    lastName: string;
    fullName: string;
    gender?: GenderType;
    avatar?: any;
    status: UserStatus;
    activationKey?: string;
    personalInfo?: UserPersonalInfo;
    businessInfo?: UserBusinessInfo;
    paymentInfo?: UserPaymentInfo;
    paymentCard?: UserPaymentCard;
    permission?: UserPermission;
    token?: UserToken;
    constructor(model: IUser);
}
export default UserCreate;
