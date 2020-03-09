import IUser from './interfaces/IUser'; // eslint-disable-line
import UserPersonalInfo from './UserPersonalInfo';
import UserBusinessInfo from './UserBusinessInfo';
import UserPaymentInfo from './UserPaymentInfo';
import UserPaymentCard from './UserPaymentCard';
import UserConnectedBank from './UserConnectedBank';
import UserChartAccountOpeningBalance from './UserChartAccountOpeningBalance';
import UserTradingQuestion from './UserTradingQuestion';
import UserSubContractor from './UserSubContractor';
import UserPermission from './UserPermission';
import UserToken from './UserToken';
import {GenderType, UserStatus} from './../common/CommonType';
import DataHelper from '../../../helpers/DataHelper';

class User {
    _id: string;
    email: string;
    password: string;
    financialStart: number;
    firstName: string;
    lastName: string;
    fullName: string;
    gender?: GenderType;
    avatar?: any;
    status: UserStatus;
    activationKey?: string;
    forgotKey?: any;
    yodleeAccount?: any;
    personalInfo?: UserPersonalInfo;
    businessInfo?: UserBusinessInfo;
    paymentInfo?: UserPaymentInfo;
    paymentCard?: UserPaymentCard;
    connectedBanks: UserConnectedBank[];
    tradingQuestion?: UserTradingQuestion;
    subContractors?: UserSubContractor[];
    chartAccountOpeningBalance?: UserChartAccountOpeningBalance;
    permission?: UserPermission;
    token?: UserToken;
    lastAccess?: Date;

    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IUser) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.email = model.email;
        this.financialStart = model.financialStart;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.fullName = model.fullName;
        this.gender = model.gender;
        this.avatar = DataHelper.handleFileDataModel(model.avatar);
        this.status = model.status;
        this.activationKey = model.activationKey;
        this.forgotKey = model.forgotKey;
        this.yodleeAccount = model.yodleeAccount;
        this.personalInfo = model.personalInfo && new UserPersonalInfo(model.personalInfo);
        this.businessInfo = model.businessInfo && new UserBusinessInfo(model.businessInfo);
        this.paymentInfo = model.paymentInfo && new UserPaymentInfo(model.paymentInfo);
        this.paymentCard = model.paymentCard && new UserPaymentCard(model.paymentCard);
        this.connectedBanks = model.connectedBanks && Array.isArray(model.connectedBanks) ? UserConnectedBank.parseArray(model.connectedBanks) : [];
        this.tradingQuestion = model.tradingQuestion && new UserTradingQuestion(model.tradingQuestion);
        this.subContractors = model.subContractors && Array.isArray(model.subContractors) ? UserSubContractor.parseArray(model.subContractors) : [];
        this.chartAccountOpeningBalance = model.chartAccountOpeningBalance && new UserChartAccountOpeningBalance(model.chartAccountOpeningBalance);
        this.permission = model.permission && new UserPermission(model.permission);
        this.token = model.token && new UserToken(model.token);
        this.lastAccess = model.lastAccess;

        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IUser[]): User[] {
        return list && Array.isArray(list) ? list.map(item => new User(item)) : [];
    }
}

Object.seal(User);
export default User;
