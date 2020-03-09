import IUser from './interfaces/IUser'; // eslint-disable-line
import UserPersonalInfo from './UserPersonalInfo';
import UserBusinessInfo from './UserBusinessInfo';
import UserPaymentInfo from './UserPaymentInfo';
import UserPaymentCard from './UserPaymentCard';
import UserPermission from './UserPermission';
import UserToken from './UserToken';
import {GenderType, UserStatus} from '../common/CommonType';

class UserCreate {
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

    constructor(model: IUser) {
        if (!model)
            return;

        this.email = model.email;
        this.password = model.password;
        this.financialStart = model.financialStart;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.fullName = model.firstName + ' ' + model.lastName;
        this.gender = model.gender;
        this.avatar = model.avatar;
        this.status = model.status;
        this.activationKey = model.activationKey;
        this.personalInfo = model.personalInfo && new UserPersonalInfo(model.personalInfo);
        this.businessInfo = model.businessInfo && new UserBusinessInfo(model.businessInfo);
        this.paymentInfo = model.paymentInfo && new UserPaymentInfo(model.paymentInfo);
        this.paymentCard = model.paymentCard && new UserPaymentCard(model.paymentCard);
        this.token = model.token && new UserToken(model.token);
    }
}

Object.seal(UserCreate);
export default UserCreate;
