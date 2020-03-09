import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IManagerBusiness from '../app/business/interfaces/IManagerBusiness'; // eslint-disable-line
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate';
import FileHelper from 'justdone-system-package/dest/helpers/FileHelper';
import UploadHelper from 'justdone-system-package/dest/helpers/UploadHelper';
import UserUpdate from 'justdone-system-package/dest/app/model/user/UserUpdate';
import User from 'justdone-system-package/dest/app/model/user/User'; // eslint-disable-line 
import UserPersonalInfo from 'justdone-system-package/dest/app/model/user/UserPersonalInfo'; // eslint-disable-line

const uploadAvatarOpt = {
    mimetype: ['image/jpg', 'image/jpeg', 'image/png'],
    single: 'avatar'
};
const uploadBusinessLogoOpt = {
    mimetype: ['image/jpg', 'image/jpeg', 'image/png'],
    single: 'businessLogo'
};

class ManagerController extends BaseController {
    private managerBusiness: IManagerBusiness = BusinessLoader.managerBusiness;

    constructor() {
        super();

        this.get('/user-last-access', Authenticator.isAuthenticated, this.getUserLastAccess.bind(this));
        this.get('/count-client-info', Authenticator.isAuthenticated, this.getCountClientInfo.bind(this));
        this.get('/count-all-user', Authenticator.isAuthenticated, this.getCountAllUser.bind(this));
        this.get('/count-new-user', Authenticator.isAuthenticated, this.getCountNewUser.bind(this));
        this.get('/count-all-cancel', Authenticator.isAuthenticated, this.getCountAllCancel.bind(this));
        this.get('/count-cancel-user', Authenticator.isAuthenticated, this.getCountCancel.bind(this));
        this.get('/client-info/:_id', Authenticator.isAuthenticated, this.getClientInfo.bind(this));
        this.get('/profile/:_id', Authenticator.isAuthenticated, this.getUserProfileByManager.bind(this));
        this.get('/personal-info/:_id', Authenticator.isAuthenticated, this.getUserPersonalInfoByManager.bind(this));
        this.get('/business-info/:_id', Authenticator.isAuthenticated, this.getUserBusinessInfoByManager.bind(this));
        this.get('/inviteds', Authenticator.isAuthenticated, this.validatePagination(10), this.getUserInvited.bind(this));
        this.get('/count-inviteds', Authenticator.isAuthenticated, this.getCountUserInvited.bind(this));
        this.get('/connected-bank/:id', Authenticator.isAuthenticated, this.getConnectedBanksByManager.bind(this));
        this.get('/user-authoriation', Authenticator.isAuthenticated, this.getUserAuthentication.bind(this));
        this.get('/managers', Authenticator.isAuthenticated, this.validatePagination(10), this.getManagers.bind(this));
        this.get('/count-managers', Authenticator.isAuthenticated, this.getCountManagers.bind(this));
        this.get('/managers-assignment', Authenticator.isAuthenticated, this.validatePagination(10), this.getManagersAssignment.bind(this));
        this.get('/count-managers-assignment', Authenticator.isAuthenticated, this.getCountManagersAssignment.bind(this));
        this.get('/managers-for-assign', Authenticator.isAuthenticated, this.validatePagination(10), this.getManagersForAssign.bind(this));
        // this.get('/count-managers-for-assign', this.getCountManagersForAssign.bind(this));
        this.get('/client-by-date', Authenticator.isAuthenticated, this.validatePagination(10), this.getClientsByDate.bind(this));
        this.get('/clients', Authenticator.isAuthenticated, this.validatePagination(10), this.getClients.bind(this));
        this.get('/count-clients', Authenticator.isAuthenticated, this.getCountClients.bind(this));
        this.get('/clients-by-manager', Authenticator.isAuthenticated, this.validatePagination(10), this.getClientsByManager.bind(this));
        this.get('/count-clients-by-manager', Authenticator.isAuthenticated, this.getCountClientsByManager.bind(this));
        this.get('/clients-lookup', Authenticator.isAuthenticated, this.validateData({field: 'productCode', type: 'NUM'}), this.validatePagination(10), this.getClientsLookup.bind(this));
        this.get('/count-clients-lookup', Authenticator.isAuthenticated, this.validateData({field: 'productCode', type: 'NUM'}), this.getCountClientsLookup.bind(this));
        this.get('/clients-by-coa', Authenticator.isAuthenticated, this.validateData({field: 'productCode', type: 'NUM'}), this.validatePagination(10), this.getClientsByProductCoa.bind(this));
        this.get('/count-clients-by-coa', Authenticator.isAuthenticated, this.validateData({field: 'productCode', type: 'NUM'}), this.getCountClientsByProductCoa.bind(this));
        this.get('/assigned-client', Authenticator.isAuthenticated, this.validateData({field: 'productCode', type: 'NUM'}), this.validatePagination(10), this.getAssignedClientChartAccount.bind(this));
        this.get('/count-assigned-client', Authenticator.isAuthenticated, this.validateData({field: 'productCode', type: 'NUM'}), this.getCountAssignedClientChartAccount.bind(this));
        this.get('/assigned-users', Authenticator.isAuthenticated, this.getAssignedUsers.bind(this));
        this.get('/verify-invitation', this.verifyInvitation.bind(this));

        this.post('/managers-by-users', Authenticator.isAuthenticated, this.getManagersByUsers.bind(this));
        this.post('/count-managers-by-users', Authenticator.isAuthenticated, this.getCountManagersByUsers.bind(this));
        this.post('/count-clients-by-managers', Authenticator.isAuthenticated, this.getCountClientsByManagers.bind(this));
        this.post('/status-invitation', Authenticator.isAuthenticated, this.getStatusInvited.bind(this));
        this.post('/send-email', Authenticator.isAuthenticated, this.sendEmail.bind(this));
        this.post('/invitation-client', Authenticator.isAuthenticated, this.inviteClient.bind(this));
        this.post('/expire-Invitation', Authenticator.isAuthenticated, this.expireInvitation.bind(this));
        this.post('/avatar/:_id', Authenticator.isAuthenticated, UploadHelper.upload(uploadAvatarOpt), this.uploadAvatar.bind(this));
        this.post('/business-logo/:_id', Authenticator.isAuthenticated, UploadHelper.upload(uploadBusinessLogoOpt), this.uploadBusinessLogo.bind(this));
        this.post('/', Authenticator.isAuthenticated, this.validateData({target: 'query', field: 'productCode', type: 'NUM'}, {target: 'query', field: 'roleCode', type: 'NUM'}), this.createManager.bind(this));
        this.post('/create-client', Authenticator.isAuthenticated, this.validateData({target: 'query', field: 'productCode', type: 'NUM'}), this.createClient.bind(this));
        this.post('/copy-connect', this.coppyConnect.bind(this));

        this.put('/profile/:_id', Authenticator.isAuthenticated, this.updateProfile.bind(this));
        this.put('/re-invitation-client', Authenticator.isAuthenticated, this.reInvitation.bind(this));
        this.put('/assign-product', Authenticator.isAuthenticated, this.assignProduct.bind(this));
        this.put('/assign', Authenticator.isAuthenticated, this.assignManagers.bind(this));
        this.put('/unassign', Authenticator.isAuthenticated, this.unAssignManagers.bind(this));
        this.put('/reconnect-bank', Authenticator.isAuthenticated, this.reconnectBank.bind(this));
        this.put('/disable-pull', Authenticator.isAuthenticated, this.disablePullTransaction.bind(this));
        this.put('/enable-pull', Authenticator.isAuthenticated, this.enablePullTransaction.bind(this));
        this.put('/business-type', Authenticator.isAuthenticated, this.updateBusinessType.bind(this));
        // this.put('/move-client', Authenticator.isAuthenticated, this.moveClient.bind(this));
        this.put('/move-client-multi-bank', Authenticator.isAuthenticated, this.moveClientMultiBank.bind(this));
        this.put('/reconnect-bank-user-old', Authenticator.isAuthenticated, this.reconnectBankUserOld.bind(this));

        this.put('/restore/:_id', Authenticator.isAuthenticated, this.restoreUser.bind(this));
        this.put('/change-password/:_id', Authenticator.isAuthenticated, this.updatePassword.bind(this));
        this.put('/update-password/:_id', Authenticator.isAuthenticated, this.updatePasswordNotCheck.bind(this));

        this.delete('/:_id', Authenticator.isAuthenticated, this.disableClient.bind(this));
        this.delete('/:_id/real-delete', Authenticator.isAuthenticated, this.deleteClient.bind(this));
        this.delete('/invitation', Authenticator.isAuthenticated, this.deleteInvitation.bind(this));
    }

    async getUserLastAccess(req): Promise<any> {
        return await this.managerBusiness.getUserLastAccess(req[Authenticator.userKey]._id, JSON.parse(req.query.isChoice), JSON.parse(req.query.productCode));
    }

    async getCountAllUser(req): Promise<any> {
        return await this.managerBusiness.getCountAllUser();
    }

    async getCountClientInfo(req): Promise<any> {
        return await this.managerBusiness.getCountClientInfo(req[Authenticator.userKey]._id);
    }

    async getCountNewUser(req): Promise<any> {
        return await this.managerBusiness.getCountNewUser();
    }

    async getCountAllCancel(req): Promise<any> {
        return await this.managerBusiness.getCountAllCancel();
    }

    async getCountCancel(req): Promise<any> {
        req.query.productCode = req.query.productCode ? Number(req.query.productCode) : 0;
        return await this.managerBusiness.getCountCancel(req[Authenticator.userKey]._id, req.query.productCode);
    }

    async getClientInfo(req): Promise<any> {
        return await this.managerBusiness.getClientInfo(req[Authenticator.userKey]._id, req.params._id);
    }

    async getUserProfileByManager(req): Promise<any> {
        return await this.managerBusiness.getUserProfile(req[Authenticator.userKey]._id, req.params._id);
    }

    async getUserPersonalInfoByManager(req): Promise<any> {
        return await this.managerBusiness.getUserPersonalInfo(req[Authenticator.userKey]._id, req.params._id);
    }

    async getUserBusinessInfoByManager(req): Promise<any> {
        return await this.managerBusiness.getUserBusinessInfo(req[Authenticator.userKey]._id, req.params._id);
    }

    async getUserInvited(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        return await this.managerBusiness.getUserInvited(req[Authenticator.userKey]._id, req.query.productCodes, req.query.keyword, req.query.page, req.query.limit);
    }

    async getCountUserInvited(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        return await this.managerBusiness.getCountUserInvited(req[Authenticator.userKey]._id, req.query.productCodes, req.query.keyword);
    }

    async getConnectedBanksByManager(req): Promise<any> {
        return await this.managerBusiness.getConnectedBanks(req[Authenticator.userKey]._id, req.params.id);
    }

    async getUserAuthentication(req): Promise<any> {
        req.query.productCode = req.query.productCode ? Number(req.query.productCode) : 0;
        req.query.roleCode = req.query.roleCode ? Number(req.query.roleCode) : 0;
        return await this.managerBusiness.getUserAuthentication(req[Authenticator.userKey]._id, req.query.productCode, req.query.roleCode);
    }

    async getManagers(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        req.query.roleCodes = req.query.roleCodes ? req.query.roleCodes.split(',').map(roleCode => Number(roleCode)) : [];
        req.query.isDeleted = JSON.parse(req.query.isDeleted);
        return await this.managerBusiness.getManagers(req[Authenticator.userKey]._id, req.query.productCodes, req.query.roleCodes, req.query.keyword, req.query.isDeleted, req.query.page, req.query.limit);
    }

    async getCountManagers(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        req.query.roleCodes = req.query.roleCodes ? req.query.roleCodes.split(',').map(roleCode => Number(roleCode)) : [];
        req.query.isDeleted = JSON.parse(req.query.isDeleted);
        return await this.managerBusiness.getCountManagers(req[Authenticator.userKey]._id, req.query.productCodes, req.query.roleCodes, req.query.keyword, req.query.isDeleted);
    }

    async getManagersAssignment(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        req.query.roleCodes = req.query.roleCodes ? req.query.roleCodes.split(',').map(roleCode => Number(roleCode)) : [];
        req.query.productCodeAssignments = req.query.productCodeAssignments ? req.query.productCodeAssignments.split(',').map(productCode => Number(productCode)) : [];
        req.query.isDeleted = JSON.parse(req.query.isDeleted);
        return await this.managerBusiness.getManagersAssignment(req[Authenticator.userKey]._id, req.query.productCodes, req.query.roleCodes, req.query.productCodeAssignments, req.query.keyword, req.query.isDeleted, req.query.page, req.query.limit);
    }

    async getCountManagersAssignment(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        req.query.roleCodes = req.query.roleCodes ? req.query.roleCodes.split(',').map(roleCode => Number(roleCode)) : [];
        req.query.productCodeAssignments = req.query.productCodeAssignments ? req.query.productCodeAssignments.split(',').map(productCode => Number(productCode)) : [];
        req.query.isDeleted = JSON.parse(req.query.isDeleted);
        return await this.managerBusiness.getCountManagersAssignment(req[Authenticator.userKey]._id, req.query.productCodes, req.query.roleCodes, req.query.productCodeAssignments, req.query.keyword, req.query.isDeleted);
    }

    async getManagersForAssign(req): Promise<any> {
        req.query.productCode = req.query.productCode ? Number(req.query.productCode) : 0;
        req.query.roleCodes = req.query.roleCodes ? req.query.roleCodes.split(',').map(roleCode => Number(roleCode)) : [];
        return await this.managerBusiness.getManagersForAssign(req[Authenticator.userKey]._id, req.query.targetId, req.query.productCode, req.query.roleCodes, req.query.keyword, req.query.page, req.query.limit);
    }

    async getCountManagersForAssign(req): Promise<any> {
        req.query.productCode = req.query.productCode ? Number(req.query.productCode) : 0;
        req.query.roleCodes = req.query.roleCodes ? req.query.roleCodes.split(',').map(roleCode => Number(roleCode)) : [];
        return await this.managerBusiness.getCountManagersForAssign(req[Authenticator.userKey]._id, req.query.productCode, req.query.roleCodes, req.query.keyword);
    }

    async getClients(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        req.query.roleCodes = req.query.roleCodes ? req.query.roleCodes.split(',').map(roleCode => Number(roleCode)) : [];
        req.query.isDeleted = JSON.parse(req.query.isDeleted);
        return await this.managerBusiness.getClients(req[Authenticator.userKey]._id, req.query.productCodes, req.query.roleCodes, req.query.keyword, req.query.isDeleted, req.query.page, req.query.limit);
    }

    async getClientsByDate(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        req.query.roleCodes = req.query.roleCodes ? req.query.roleCodes.split(',').map(roleCode => Number(roleCode)) : [];
        req.query.isDeleted = JSON.parse(req.query.isDeleted);
        return await this.managerBusiness.getClientsByDate(req[Authenticator.userKey]._id, req.query.productCodes, req.query.roleCodes, req.query.keyword, req.query.isDeleted, req.query.page, req.query.limit);
    }

    async getCountClients(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        req.query.roleCodes = req.query.roleCodes ? req.query.roleCodes.split(',').map(roleCode => Number(roleCode)) : [];
        req.query.isDeleted = JSON.parse(req.query.isDeleted);
        return await this.managerBusiness.getCountClients(req[Authenticator.userKey]._id, req.query.productCodes, req.query.roleCodes, req.query.keyword, req.query.isDeleted);
    }

    async getClientsByManager(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        req.query.isDeleted = JSON.parse(req.query.isDeleted);
        return await this.managerBusiness.getClientsByManager(req[Authenticator.userKey]._id, req.query.managerId, req.query.productCodes, req.query.keyword, req.query.isDeleted, req.query.page, req.query.limit);
    }

    async getCountClientsByManager(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        req.query.isDeleted = JSON.parse(req.query.isDeleted);
        return await this.managerBusiness.getCountClientsByManager(req[Authenticator.userKey]._id, req.query.managerId, req.query.productCodes, req.query.keyword, req.query.isDeleted);
    }

    async getCountClientsByManagers(req): Promise<any> {
        return await this.managerBusiness.getCountClientsByManagers(req[Authenticator.userKey]._id, req.body.managerIds, req.body.productCode);
    }

    async getClientsLookup(req): Promise<any> {
        return await this.managerBusiness.getClientsLookup(req[Authenticator.userKey]._id, req.query.productCode, req.query.keyword, req.query.page, req.query.limit);
    }

    async getCountClientsLookup(req): Promise<any> {
        return await this.managerBusiness.getCountClientsLookup(req[Authenticator.userKey]._id, req.query.productCode, req.query.keyword);
    }

    async getClientsByProductCoa(req): Promise<any> {
        return await this.managerBusiness.getClientsByProductCoa(req[Authenticator.userKey]._id, req.query.productCode, req.query.coaId, req.query.page, req.query.limit, req.query.keyword);
    }

    async getCountClientsByProductCoa(req): Promise<any> {
        return await this.managerBusiness.getCountClientsByProductCoa(req[Authenticator.userKey]._id, req.query.productCode, req.query.coaId, req.query.keyword);
    }

    async getAssignedClientChartAccount(req): Promise<any> {
        return await this.managerBusiness.getAssignedClientChartAccount(req[Authenticator.userKey]._id, req.query.productCode, req.query.coaId, req.query.page, req.query.limit, req.query.keyword);
    }

    async getCountAssignedClientChartAccount(req): Promise<any> {
        return await this.managerBusiness.getCountAssignedClientChartAccount(req[Authenticator.userKey]._id, req.query.productCode, req.query.coaId);
    }

    async getAssignedUsers(req): Promise<any> {
        return await this.managerBusiness.getAssignedUsers(req[Authenticator.userKey]._id);
    }

    async getManagersByUsers(req): Promise<any> {
        return await this.managerBusiness.getManagersByUsers(req[Authenticator.userKey]._id, req.body.clientIds, req.body.productCodes, req.body.roleCodes);
    }

    async getCountManagersByUsers(req): Promise<any> {
        return await this.managerBusiness.getCountManagersByUsers(req[Authenticator.userKey]._id, req.body.clientIds, req.body.productCodes, req.body.roleCodes);
    }

    async assignManagers(req): Promise<any> {
        return await this.managerBusiness.assignManagers(req[Authenticator.userKey]._id, req.body._id, req.body.managerIds);
    }

    async unAssignManagers(req):Promise<any> {
        return await this.managerBusiness.unAssignManagers(req[Authenticator.userKey]._id, req.body._id, req.body.managerIds);
    }

    async reconnectBank(req): Promise<any> {
        return await this.managerBusiness.reconnectBank(req[Authenticator.userKey]._id, req.body.clientId, req.body.productCode, req.body.accountType);
    }

    async reconnectBankUserOld(req): Promise<any> {
        return await this.managerBusiness.reconnectBankUserOld(req[Authenticator.userKey]._id, req.body.clientId, req.body.productCode, req.body.providerId, req.body.bankId);
    }

    async disablePullTransaction(req): Promise<any> {
        return await this.managerBusiness.disablePullTransaction(req[Authenticator.userKey]._id, req.body.clientId, req.body.accountType, req.body.accountId);
    }

    async enablePullTransaction(req): Promise<any> {
        return await this.managerBusiness.enablePullTransaction(req[Authenticator.userKey]._id, req.body.clientId, req.body.accountType, req.body.accountId);
    }

    async createManager(req): Promise<any> {
        return await this.managerBusiness.createManager(req[Authenticator.userKey]._id, req.query.productCode, req.query.roleCode, req.body);
    }

    async createClient(req): Promise<any> {
        return await this.managerBusiness.createClient(req[Authenticator.userKey]._id, req.query.productCode, req.body);
    }

    async updateProfile(req): Promise<any> {
        await this.managerBusiness.updatePersonalInfo(req[Authenticator.userKey]._id, req.params._id, new UserPersonalInfo(req.body.personalInfo));
        return await this.managerBusiness.updateUser(req[Authenticator.userKey]._id, req.params._id, new UserUpdate(req.body));
    }

    async updatePassword(req): Promise<any> {
        return await this.managerBusiness.updatePassword(req[Authenticator.userKey]._id, req.params._id, req.body);
    }

    async updateBusinessType(req): Promise<any> {
        return await this.managerBusiness.updateBusinessType(req[Authenticator.userKey]._id, req.body.userId, req.body.type);
    }

    async updatePasswordNotCheck(req): Promise<any> {
        return await this.managerBusiness.updatePasswordNotCheck(req[Authenticator.userKey]._id, req.params._id, req.body.newPassword);
    }

    async uploadAvatar(req): Promise<any> {
        if (req.file) {
            let fileCreate = new FileCreate(<any>{
                name: req.file.originalNameWithoutExtension,
                size: req.file.size,
                type: FileHelper.getFileTypeByExtension(req.file.extension),
                extension: req.file.extension,
                url: req.file.filename,
                userId: req.params._id
            });

            return await this.managerBusiness.uploadAvatar(req[Authenticator.userKey]._id, req[Authenticator.userKey].permission.product.code, fileCreate);
        }
        return null;
    }

    async uploadBusinessLogo(req): Promise<any> {
        if (req.file) {
            let fileCreate = new FileCreate(<any>{
                name: req.file.originalNameWithoutExtension,
                size: req.file.size,
                type: FileHelper.getFileTypeByExtension(req.file.extension),
                extension: req.file.extension,
                url: req.file.filename,
                userId: req.params._id
            });
            return await this.managerBusiness.uploadBusinessLogo(req[Authenticator.userKey]._id, req[Authenticator.userKey].permission.product.code, fileCreate);
        }
        return null;
    }

    async getStatusInvited(req): Promise<any> {
        return await this.managerBusiness.getStatusInvited(req.body);
    }

    async assignProduct(req): Promise<any> {
        req.query.productCode = req.query.productCode ? Number(req.query.productCode) : 0;
        return await this.managerBusiness.assignProduct(req[Authenticator.userKey]._id, req.query.userId, req.query.productCode);
    }

    async inviteClient(req): Promise<any> {
        let userAuth: User = req[Authenticator.userKey];
        return await this.managerBusiness.inviteClient(userAuth._id, req[Authenticator.userKey].permission.product.code, userAuth.email, userAuth.firstName + ' ' + userAuth.lastName, req.body.email, req.body.firstName, req.body.lastName);
    }

    async sendEmail(req): Promise<any> {
        let userAuth: User = req[Authenticator.userKey];
        return await this.managerBusiness.sendEmail(userAuth._id, req.body);
    }

    async verifyInvitation(req): Promise<any> {
        return await this.managerBusiness.verifyInvitation(req.query.token);
    }

    async expireInvitation(req): Promise<any> {
        return await this.managerBusiness.expireInvitation(req[Authenticator.userKey]._id);
    }

    async reInvitation(req): Promise<any> {
        return await this.managerBusiness.reInvitation(req.query.inviteId);
    }

    // async moveClient(req): Promise<any> {
    //     return await this.managerBusiness.moveClient(req[Authenticator.userKey]._id, req.body.clientId, req.body.productId).catch(err => {
    //     });
    // }

    async moveClientMultiBank(req): Promise<any> {
        return await this.managerBusiness.moveClientMultiBank(req[Authenticator.userKey]._id, req.body.userId, req.body.productId);
    }

    async coppyConnect(req): Promise<any> {
        return await this.managerBusiness.copyConnectBank(req.body.fromId, req.body.toId, Number(req.body.copyType));
    }

    async restoreUser(req): Promise<any> {
        return await this.managerBusiness.restore(req[Authenticator.userKey]._id, req.params._id);
    }

    async disableClient(req): Promise<any> {
        return await this.managerBusiness.disableClient(req[Authenticator.userKey]._id, req.params._id);
    }

    async deleteClient(req): Promise<any> {
        return await this.managerBusiness.deleteClient(req[Authenticator.userKey]._id, req.params._id);
    }

    async deleteInvitation(req): Promise<any> {
        return await this.managerBusiness.deleteInvitation(req[Authenticator.userKey]._id, req.query.inviteId);
    }
}

Object.seal(ManagerController);
export default ManagerController;
