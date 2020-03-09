import IBaseBusiness from './base/IBaseBusiness';
import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate'; // eslint-disable-line
import User from 'justdone-system-package/dest/app/model/user/User';
import UserCreate from 'justdone-system-package/dest/app/model/user/UserCreate';// eslint-disable-line
import UserUpdate from 'justdone-system-package/dest/app/model/user/UserUpdate';// eslint-disable-line
import UserAuthentication from 'justdone-system-package/dest/app/model/user/UserAuthentication';
import UserPaymentCard from 'justdone-system-package/dest/app/model/user/UserPaymentCard';// eslint-disable-line
import UserConnectedBank from 'justdone-system-package/dest/app/model/user/UserConnectedBank';
import UserProfile from 'justdone-system-package/dest/app/model/user/UserProfile';
import UserPersonalInfo from 'justdone-system-package/dest/app/model/user/UserPersonalInfo';
// import UserChartAccountOpeningBalance from 'justdone-system-package/dest/app/model/user/UserChartAccountOpeningBalance';
import UserTradingQuestion from 'justdone-system-package/dest/app/model/user/UserTradingQuestion';// eslint-disable-line
import UserBusinessInfo from 'justdone-system-package/dest/app/model/user/UserBusinessInfo';// eslint-disable-line
import Permission from 'justdone-system-package/dest/app/model/permission/Permission';
import CustomPermission from 'justdone-system-package/dest/app/model/permission/CustomPermission';

interface IUserBusiness extends IBaseBusiness<User> {
    getAllClients:() => Promise<User[]>;
    getByEmail: (email: string) => Promise<User | null>;
    getByRole: (role: string) => Promise<User[]>;
    getUserProfile: (userId: string, managerId?: string) => Promise<UserProfile | null>;
    searchAddress: (keyword: string, limit: number) => Promise<any>;
    getUserPersonalInfo: (userId: string) => Promise<UserPersonalInfo | null>;
    getUserBusinessInfo: (userId: string) => Promise<UserBusinessInfo | null>;
    getUserChartAccountOpeningBalance(_id: string): Promise<any> ;
    getConnectedBanks: (_id: string, managerId?: string) => Promise<UserConnectedBank[]>;
    getTradingQuestion: (userId: string, managerId?: string) => Promise<UserTradingQuestion | null>;
    getCountUser: (_ids: string[]) => Promise<number>;
    getClaimAndCustomPermissions: (token: string) => Promise<{claims: Permission[], customs: CustomPermission[]}>;
    authenticate: (productCode: number, email: string, password: string) => Promise<UserAuthentication | null>;
    getUsersByRole: (users: string[], role: string) => Promise<any[]>;
    getIdRoleAdmin: () => Promise<any>;
    switchDataConnectBank: () => Promise<any>;
    create: (data: UserCreate) => Promise<User>;
    createAndUpdateUserChartAccountOpeningBalance: (_id: string, data: any[]) => Promise<any>;
    retrieveForgotKey: (productCode: number, fromEmail: string, fromName: string, email: string) => Promise<boolean>;
    validateForgotkey: (forgotKey: string) => Promise<boolean>;
    signup: (productCode: number, data: UserCreate, inviteToken?: string) => Promise<UserAuthentication>;
    validateEmail: (email: string, isCheckExists?: boolean) => Promise<boolean>;
    uploadUserDriverLicense: (productCode: number, data: FileCreate) => Promise<string | null>;
    uploadVehicleAttachments: (productCode: number, data: FileCreate) => Promise<string | null>;
    uploadAvatar: (originId: string, productCode: number, avatar: FileCreate) => Promise<string | null>;
    uploadBusinessLogo: (productCode: number, data: FileCreate) => Promise<string | null>;
    update: (_id: string, data: UserUpdate) => Promise<UserProfile | any>;
    updateTradingQuestion: (_id: string, TradingQuestion: UserTradingQuestion) => Promise<boolean>;
    updatePersonalInfo: (_id: string, PersonalInfo: UserPersonalInfo) => Promise<boolean>;
    updateBusinessInfo: (_id: string, BusinessInfo: UserBusinessInfo) => Promise<boolean>;
    updatePaymentCard: (_id: string, PaymentCard: UserPaymentCard) => Promise<boolean>;
    updateConnectedBanks: (_id: string, UserConnectedBanks: any) => Promise<boolean>;
    updateSubContractors: (_id: string, UserSubContractors: any) => Promise<boolean>;
    updatePassword: (_id: string, data: any) => Promise<boolean>;
    updateYodleeAccount:(_id: string) => Promise<any>;
    resetPassword: (data: any) => Promise<boolean>;
    updateStatus: (_id: string, status: number) => Promise<string | null>;
    yodleeValidateData: (userId: string, fullName: any, type: number) => Promise<boolean>;
    updateFinancialStart();
    getUserByEmail(email: string);
    getByProductId: (productId: string) => Promise<any>;
    updateFinancial(newYear: number, userId: string);
}

export default IUserBusiness;
