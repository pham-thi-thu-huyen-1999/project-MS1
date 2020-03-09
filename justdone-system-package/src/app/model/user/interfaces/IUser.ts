import IBaseModel from '../../common/interfaces/IBaseModel';
import UserPersonalInfo from '../UserPersonalInfo';
import UserBusinessInfo from '../UserBusinessInfo';
import UserPaymentInfo from '../UserPaymentInfo';
import UserPaymentCard from '../UserPaymentCard';
import UserConnectedBank from '../UserConnectedBank';
import UserTradingQuestion from '../UserTradingQuestion';
import UserSubContractor from '../UserSubContractor';
import UserChartAccountOpeningBalance from '../UserChartAccountOpeningBalance';
import UserPermission from '../UserPermission';
import UserToken from '../UserToken';
import {GenderType, UserStatus} from '../../common/CommonType';

interface IUser extends IBaseModel {
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
}

export default IUser;
