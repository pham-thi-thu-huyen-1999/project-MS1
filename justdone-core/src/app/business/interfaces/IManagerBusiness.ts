import IBaseBusiness from './base/IBaseBusiness';
import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate'; // eslint-disable-line
import User from 'justdone-system-package/dest/app/model/user/User';
import UserAuthentication from 'justdone-system-package/dest/app/model/user/UserAuthentication';
import UserUpdate from 'justdone-system-package/dest/app/model/user/UserUpdate'; // eslint-disable-line
import UserConnectedBank from 'justdone-system-package/dest/app/model/user/UserConnectedBank';
import UserProfile from 'justdone-system-package/dest/app/model/user/UserProfile';
import ClientInfo from 'justdone-system-package/dest/app/model/user/ClientInfo';
import ClientAccount from 'justdone-system-package/dest/app/model/user/ClientAccount';
import ManagerAccount from 'justdone-system-package/dest/app/model/user/ManagerAccount';// eslint-disable-line  
import UserPersonalInfo from 'justdone-system-package/dest/app/model/user/UserPersonalInfo';
import UserBusinessInfo from 'justdone-system-package/dest/app/model/user/UserBusinessInfo'; // eslint-disable-line
import ClientLookup from 'justdone-system-package/dest/app/model/user/ClientLookup'; // eslint-disable-line
import Invitation from 'justdone-system-package/dest/app/model/invitation/Invitation'; // eslint-disable-line
import {ProductCode, RoleCode , BankType} from 'justdone-system-package/dest/app/model/common/CommonType'; // eslint-disable-line

interface IManagerBusiness extends IBaseBusiness<User> {
    getUserLastAccess(originId: string, isChoice: number, productCode: number): Promise<{_id: string; count: number}[]>;
    getCountClientInfo(originId: string): Promise<{product: any, count: number, latestUser: any}[]>
    getCountNewUser(): Promise<{_id: string; count: number}[]>;
    getCountCancel(originId: string, productCode: number): Promise<{productCode: number, total: number}>;
    getCountAllUser(): Promise<number>;
    getCountAllCancel(): Promise<number>;
    getClientInfo: (originId: string, targetId: string) => Promise<ClientInfo | null>;
    getUserProfile: (targetId: string, originId?: string) => Promise<UserProfile | null>;
    getUserPersonalInfo: (originId: string, targetId: string) => Promise<UserPersonalInfo | null>;
    getUserBusinessInfo: (originId: string, targetId: string) => Promise<UserBusinessInfo | null>;
    getUserInvited: (originId: string, productCodes: number[], keyword: string, page?: number, limit?: number) => Promise<Invitation[]>;
    getCountUserInvited: (originId: string, productCodes: number[], keyword: string) => Promise<number>;
    getConnectedBanks: (originId: string, targetId: string) => Promise<UserConnectedBank[]>;
    getUserAuthentication: (originId: string, productCode: number, roleCode: number) => Promise<UserAuthentication | null>;
    getManagers: (originId: string, productCodes?: number[], roleCodes?: number[], keyword?: string, isDeleted?: boolean, page?: number, limit?: number) => Promise<ManagerAccount[]>;
    getCountManagers: (originId: string, productCodes?: number[], roleCodes?: number[], keyword?: string, isDeleted?: boolean) => Promise<number>;
    getManagersAssignment: (originId: string, productCodes?: number[], roleCodes?: number[], productCodeAssignments?: number[], keyword?: string, isDeleted?: boolean, page?: number, limit?: number) => Promise<ManagerAccount[]>;
    getCountManagersAssignment: (originId: string, productCodes?: number[], roleCodes?: number[], productCodeAssignments?: number[], keyword?: string, isDeleted?: boolean) => Promise<number>;
    getManagersForAssign: (originId: string, targetId:string, productCode: number, roleCodes?: number[], keyword?: string, page?: number, limit?: number) => Promise<ManagerAccount[]>;
    getCountManagersForAssign: (originId: string, productCode: number, roleCodes?: number[], keyword?: string) => Promise<number>;
    getClientsByDate: (originId: string, productCodes?: number[], roleCodes?: number[], keyword?: string, isDeleted?: boolean, page?: number, limit?: number) => Promise<ClientAccount[]>;
    getClients: (originId: string, productCodes?: number[], roleCodes?: number[], keyword?: string, isDeleted?: boolean, page?: number, limit?: number) => Promise<ClientAccount[]>;
    getCountClients: (originId: string, productCodes?: number[], roleCodes?: number[], keyword?: string, isDeleted?: boolean) => Promise<number>;
    getClientsByManager: (originId: string, managerId: string, productCodes?: number[], keyword?: string, isDeleted?: boolean, page?: number, limit?: number) => Promise<ClientAccount[]>;
    getCountClientsByManager: (originId: string, managerId: string, productCodes?: number[], keyword?: string, isDeleted?: boolean) => Promise<number>;
    getCountClientsByManagers: (originId: string, managerIds: string[], productCode?: number) => Promise<{ _id: string, count: number }[]>;
    getClientsLookup: (originId: string, productCode: number, keyword?: string, page?: number, limit?: number) => Promise<ClientLookup[]>;
    getCountClientsLookup: (originId: string, productCode: number, keyword?: string) => Promise<number>;
    getClientsByProductCoa: (originId: string, productCode: number, coaId: string, page?: number, limit?: number, keyword?: string) => Promise<ClientInfo[]>;
    getCountClientsByProductCoa: (orginId: string, productCode: number, coaId: string, keyword?: string) => Promise<number>;
    getAssignedClientChartAccount: (originId: string, productCode: number, coaId: string, page?: number, limit?: number, keyword?: string) => Promise<ClientInfo[]>;
    getCountAssignedClientChartAccount: (orginId: string, productCode: number, coaId: string, keyword?: string) => Promise<number>;
    getAssignedUsers: (managerId: string) => Promise<User[]>;
    getManagersByUsers: (originId: string, clientIds: string[], productCodes?: number[], roleCodes?: number[]) => Promise<{_id: string, managers: ManagerAccount[]}[]>;
    getCountManagersByUsers: (originId: string, clientIds: string[], productCodes?: number[], roleCodes?: number[]) => Promise<{_id: string, count: number}[]>;
    getManagersByIds: (managers: string[], productId: string) => Promise<any>;
    getManagersByRole: (roleId: string) => Promise<ManagerAccount[]>;
    verifyInvitation: (token: string) => Promise<Invitation | null>;

    getStatusInvited: (inviteIds: string[]) => Promise<any[]>;
    expireInvitation: (originId: string) => Promise<boolean>;
    inviteClient: (originId: string, productCode: number, fromEmail: string, fromName: string, toEmail: string, toFirstName: string, toLastName: string) => Promise<boolean>;
    sendEmail: (originId: string, data: any) => Promise<boolean>;
    reInvitation: (inviteId: string) => Promise<boolean>;
    reconnectBankUserOld: (originId: string, clientId: string, productCode: number, providerId: string, bankId: string) => Promise<any>;

    createManager: (originId: string, productCode: number, roleCode: RoleCode, data: any) => Promise<User | null>;
    createClient: (originId: string, productCode: ProductCode, data: any) => Promise<User | null>;
    // moveClient(originId: string, targetId: string, productId: string): Promise<any>;
    moveClientMultiBank(originId: string, userId: string, productId: string): Promise<any>;
    copyConnectBank(fromId:string, toId:string, copyType: number):Promise<boolean>;
    update: (_id: string, data: UserUpdate) => Promise<UserProfile | any>;
    updateUser: (originId: string, targetId: string, data: UserUpdate) => Promise<UserProfile | null>;
    updateBusinessType(originId: string, targetId: string, businessType: number):Promise<boolean>;
    updatePersonalInfo: (originId: string, targetId: string, PersonalInfo: UserPersonalInfo) => Promise<boolean>;
    updatePassword: (originId: string, targetId: string, data: any) => Promise<boolean>;
    updatePasswordNotCheck(originId: string, targetId: string, newPassword: string): Promise<boolean>
    uploadAvatar: (originId: string, productCode: number, avatar: FileCreate) => Promise<string | null>;
    uploadBusinessLogo: (originId: string, productCode: number, data: FileCreate) => Promise<string | null>;
    assignProduct: (originId:string, targetId: string, productCode: number) => Promise<boolean>;
    assignManagers: (originId: string, targetId: string, managerIds: string[]) => Promise<boolean>;
    unAssignManagers: (originId: string, targetId: string, managerIds: string[]) => Promise<boolean>;
    reconnectBank: (originId: string, clientId: string, productCode: number, accountType: BankType) => Promise<boolean>;
    disablePullTransaction: (originId: string, clientId: string, accountType: BankType, connectBankId: string) => Promise<boolean>;
    enablePullTransaction: (originId: string, clientId: string, accountType: BankType, connectBankId: string) => Promise<boolean>;
    restore: (originId: string, targetId: string) => Promise<boolean>;
    deleteInvitation: (originId: string, inviteId: string) => Promise<boolean>;
    disableClient: (originId: string, targetId: string) => Promise<boolean>;
    deleteClient: (originId: string, clientId: string) => Promise<boolean>;
    delete: (_id: string) => any;
}

export default IManagerBusiness;
