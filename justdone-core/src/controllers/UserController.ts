import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IUserBusiness from '../app/business/interfaces/IUserBusiness'; // eslint-disable-line
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate';
import FileHelper from 'justdone-system-package/dest/helpers/FileHelper';
import UploadHelper from 'justdone-system-package/dest/helpers/UploadHelper';
import {UserStatus} from 'justdone-system-package/dest/app/model/common/CommonType';
import User from 'justdone-system-package/dest/app/model/user/User';// eslint-disable-line 
import UserCreate from 'justdone-system-package/dest/app/model/user/UserCreate';
import UserUpdate from 'justdone-system-package/dest/app/model/user/UserUpdate';
import UserAuthentication from 'justdone-system-package/dest/app/model/user/UserAuthentication'; // eslint-disable-line
import UserPaymentCard from 'justdone-system-package/dest/app/model/user/UserPaymentCard';
import UserPersonalInfo from 'justdone-system-package/dest/app/model/user/UserPersonalInfo';
import UserChartAccountOpeningBalance from 'justdone-system-package/dest/app/model/user/UserChartAccountOpeningBalance';
import UserTradingQuestion from 'justdone-system-package/dest/app/model/user/UserTradingQuestion';
import UserBusinessInfo from 'justdone-system-package/dest/app/model/user/UserBusinessInfo';

const uploadAvatarOpt = {
    mimetype: ['image/jpg', 'image/jpeg', 'image/png'],
    single: 'avatar'
};
const uploadBusinessLogoOpt = {
    mimetype: ['image/jpg', 'image/jpeg', 'image/png'],
    single: 'businessLogo'
};
const uploadDriverOpt = {
    mimetype: ['image/jpg', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'],
    single: 'driverlicense'
};
const uploadVehicleOpt = {
    mimetype: ['application/pdf'],
    single: 'vehicleAttachments'
};

class UserController extends BaseController {
    private userBusiness: IUserBusiness = BusinessLoader.userBusiness;

    constructor() {
        super();

        this.get('/all-client', this.getAllClients.bind(this));
        this.get('/profile', Authenticator.isAuthenticated, this.getProfile.bind(this));
        this.get('/address', Authenticator.isAuthenticated, this.validateData({field: 'limit', type: 'NUM'}), this.searchAddress.bind(this));
        this.get('/personal-info', Authenticator.isAuthenticated, this.getUserPersonalInfo.bind(this));
        this.get('/business-info', Authenticator.isAuthenticated, this.getUserBusinessInfo.bind(this));
        this.get('/connected-banks', Authenticator.isAuthenticated, this.getConnectedBanksByClient.bind(this));
        this.get('/user-by-access-token', Authenticator.isAuthenticated, this.getUserByAccessToken.bind(this));
        this.get('/forgot-key', this.retrieveForgotKey.bind(this));
        this.get('/trading-questions', Authenticator.isAuthenticated, this.getTradingQuestion.bind(this));
        this.get('/check-email', this.validateEmail.bind(this));
        // this.get('/chat/relative-user/:_id/:idUser/:idRole', this.getUserRelative.bind(this));
        this.get('/permissions', this.getClaimAndCustomPermissions.bind(this));
        // this.get('/client-by-product-list', this.validatePagination(10), this.getByNameAndProduct.bind(this));
        this.get('/get-role-admin', this.getIdRoleAdmin.bind(this));
        this.get('/chart-account-opening-balance/:_id', Authenticator.isAuthenticated, this.getChartAccountOpeningBalance.bind(this));
        this.get('/get-by-id/:_id', this.getById.bind(this));
        this.get('/switch-data-bank', this.switchDataConnectBank.bind(this));
        this.get('/get-by-productId/:_id', this.getByProductId.bind(this));

        this.post('/get-user-by-email', this.getUserByEmail.bind(this));
        this.post('/signup', this.validateData({target: 'query', field: 'productCode', type: 'NUM'}), this.signup.bind(this));
        this.post('/signin', this.validateData({target: 'query', field: 'productCode', type: 'NUM'}), this.signin.bind(this));
        this.post('/signout', Authenticator.isAuthenticated, this.signout.bind(this));
        this.post('/driverlicense', Authenticator.isAuthenticated, UploadHelper.upload(uploadDriverOpt), this.uploadUserDriverLicense.bind(this));
        this.post('/vehicleattachments', Authenticator.isAuthenticated, UploadHelper.upload(uploadVehicleOpt), this.uploadVehicleAttachments.bind(this));
        this.post('/avatar', Authenticator.isAuthenticated, UploadHelper.upload(uploadAvatarOpt), this.uploadAvatar.bind(this));
        this.post('/business-logo', Authenticator.isAuthenticated, UploadHelper.upload(uploadBusinessLogoOpt), this.uploadBusinessLogo.bind(this));
        this.post('/validate-forgotkey', Authenticator.isAuthenticated, this.validateForgotkey.bind(this));

        this.put('/create-and-update-chart-account-opening-balance/:_id', Authenticator.isAuthenticated, this.createAndUpdateUserChartAccountOpeningBalance.bind(this));
        this.put('/profile', Authenticator.isAuthenticated, this.updateProfile.bind(this));
        this.put('/trading-questions', Authenticator.isAuthenticated, this.updateTradingQuestion.bind(this));
        this.put('/personal-info', Authenticator.isAuthenticated, this.updatePersonalInfo.bind(this));
        this.put('/business-info', Authenticator.isAuthenticated, this.updateBusinessInfo.bind(this));
        this.put('/payment-card', Authenticator.isAuthenticated, this.updatePaymentCard.bind(this));
        this.put('/connected-banks', Authenticator.isAuthenticated, this.updateConnectedBanks.bind(this));
        this.put('/updateFinancialStart', this.updateFinancialStart.bind(this));
        this.put('/sub-contractors', Authenticator.isAuthenticated, this.updateSubContractors.bind(this));
        this.put('/change-password', Authenticator.isAuthenticated, this.updatePassword.bind(this));
        this.put('/reset-password', this.resetPassword.bind(this));
        this.put('/update-financial', this.updateFinancial.bind(this));
        this.patch('/activate/:_id', Authenticator.isAuthenticated, this.activateUser.bind(this));
    }

    async getByProductId(req) {
        return await this.userBusiness.getByProductId(req.params._id);
    }

    async getIdRoleAdmin(req) {
        return await this.userBusiness.getIdRoleAdmin();
    }

    async getAllClients(req) {
        return await this.userBusiness.getAllClients();
    }

    async getById(req) {
        return await this.userBusiness.getUserProfile(req.params._id);
    }

    async getProfile(req): Promise<any> {
        let userAuth: UserAuthentication = req[Authenticator.userKey];
        return await this.userBusiness.getUserProfile(userAuth._id);
    }

    async getUserByEmail(req) {
        return await this.userBusiness.getUserByEmail(req.body.email);
    }

    async updateFinancial(req) {
        return await this.userBusiness.updateFinancial(req.body.newYear, req.body.userId);
    }

    async validateEmail(req): Promise<boolean> {
        return await this.userBusiness.validateEmail(req.query.email, true);
    }

    async searchAddress(req): Promise<any> {
        return await this.userBusiness.searchAddress(req.query.keyword, req.query.limit);
    }

    async getUserPersonalInfo(req): Promise<any> {
        let userAuth: UserAuthentication = req[Authenticator.userKey];
        return await this.userBusiness.getUserPersonalInfo(userAuth._id);
    }

    async getUserBusinessInfo(req): Promise<any> {
        let userAuth: UserAuthentication = req[Authenticator.userKey];
        return await this.userBusiness.getUserBusinessInfo(userAuth._id);
    }

    async getConnectedBanksByClient(req): Promise<any> {
        let userAuth: UserAuthentication = req[Authenticator.userKey];
        return await this.userBusiness.getConnectedBanks(userAuth._id);
    }

    async getUserByAccessToken(req): Promise<any> {
        return req[Authenticator.userKey];
    }

    async getTradingQuestion(req): Promise<any> {
        let userAuth: UserAuthentication = req[Authenticator.userKey];
        return await this.userBusiness.getTradingQuestion(userAuth._id);
    }

    // async getUserRelative(req): Promise<any> {
    //     return await this.userBusiness.getUserRelative(req.params._id, req.params.idUser, req.params.idRole);
    // }

    async getClaimAndCustomPermissions(req): Promise<any> {
        return await this.userBusiness.getClaimAndCustomPermissions(req.query.token);
    }

    async getChartAccountOpeningBalance(req) {
        return await this.userBusiness.getUserChartAccountOpeningBalance(req.params._id);
    }

    async switchDataConnectBank(req) {
        return await this.userBusiness.switchDataConnectBank();
    }

    // async getByNameAndProduct(req): Promise<any> {
    //     return await this.userBusiness.getByNameAndProduct(req.query.keyword, req.query.productCode, req.query.page, req.query.limit);
    // }

    async createAndUpdateUserChartAccountOpeningBalance(req) {
        return await this.userBusiness.createAndUpdateUserChartAccountOpeningBalance(req.params._id, req.body.data);
    }

    async signup(req): Promise<any> {
        // let userAuth: UserAuthentication = req[Authenticator.userKey];
        return await this.userBusiness.signup(req.query.productCode, new UserCreate(req.body), req.query.inviteToken);
    }

    async signin(req): Promise<any> {
        return await this.userBusiness.authenticate(req.query.productCode, req.body.email, req.body.password);
    }

    signout(req): any {
        let userAuth: UserAuthentication = req[Authenticator.userKey];
        if (userAuth)
            Authenticator.removeAuthenticator(userAuth._id);
        return true;
    }

    async retrieveForgotKey(req): Promise<any> {
        return await this.userBusiness.retrieveForgotKey(req.query.productcode, 'suporter@justdone.com.au', 'suporter', req.query.email);
    }

    async validateForgotkey(req): Promise<any> {
        return await this.userBusiness.validateForgotkey(req.body.forgotKey);
    }

    async uploadUserDriverLicense(req): Promise<any> {
        if (req.file) {
            let fileCreate = new FileCreate(<any>{
                name: req.file.originalNameWithoutExtension,
                size: req.file.size,
                type: FileHelper.getFileTypeByExtension(req.file.extension),
                extension: req.file.extension,
                url: req.file.filename,
                userId: req[Authenticator.userKey]._id
            });

            return await this.userBusiness.uploadUserDriverLicense(req[Authenticator.userKey].permission.product.code, fileCreate);
        }
        return null;
    }

    async uploadVehicleAttachments(req): Promise<any> {
        if (req.file) {
            let fileCreate = new FileCreate(<any>{
                name: req.file.originalNameWithoutExtension,
                size: req.file.size,
                type: FileHelper.getFileTypeByExtension(req.file.extension),
                extension: req.file.extension,
                url: req.file.filename,
                userId: req[Authenticator.userKey]._id
            });

            return await this.userBusiness.uploadVehicleAttachments(req[Authenticator.userKey].permission.product.code, fileCreate);
        }
        return null;
    }

    async uploadAvatar(req): Promise<any> {
        if (req.file) {
            let fileCreate = new FileCreate(<any>{
                name: req.file.originalNameWithoutExtension,
                size: req.file.size,
                type: FileHelper.getFileTypeByExtension(req.file.extension),
                extension: req.file.extension,
                url: req.file.filename,
                userId: req[Authenticator.userKey]._id
            });

            return await this.userBusiness.uploadAvatar(req[Authenticator.userKey]._id, req[Authenticator.userKey].permission.product.code, fileCreate);
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
                userId: req[Authenticator.userKey]._id
            });
            return await this.userBusiness.uploadBusinessLogo(req[Authenticator.userKey].permission.product.code, fileCreate);
        }
        return null;
    }

    async updateProfile(req): Promise<any> {
        await this.userBusiness.updatePersonalInfo(req[Authenticator.userKey]._id, new UserPersonalInfo(req.body.personalInfo));
        return await this.userBusiness.update(req[Authenticator.userKey]._id, new UserUpdate(req.body));
    }

    async updateTradingQuestion(req): Promise<any> {
        return await this.userBusiness.updateTradingQuestion(req[Authenticator.userKey]._id, new UserTradingQuestion(req.body));
    }

    async updatePersonalInfo(req): Promise<any> {
        return await this.userBusiness.updatePersonalInfo(req[Authenticator.userKey]._id, new UserPersonalInfo(req.body));
    }

    async updateBusinessInfo(req): Promise<any> {
        return await this.userBusiness.updateBusinessInfo(req[Authenticator.userKey]._id, new UserBusinessInfo(req.body));
    }

    async updatePaymentCard(req): Promise<any> {
        return await this.userBusiness.updatePaymentCard(req[Authenticator.userKey]._id, new UserPaymentCard(req.body));
    }

    async updateConnectedBanks(req): Promise<any> {
        return await this.userBusiness.updateConnectedBanks(req[Authenticator.userKey]._id, req.body.connectedBank);
    }

    async updateSubContractors(req): Promise<any> {
        return await this.userBusiness.updateSubContractors(req[Authenticator.userKey]._id, req.body.contractors);
    }

    async updatePassword(req): Promise<any> {
        return await this.userBusiness.updatePassword(req[Authenticator.userKey]._id, req.body);
    }

    async resetPassword(req): Promise<any> {
        return await this.userBusiness.resetPassword(req.body);
    }

    async activateUser(req): Promise<any> {
        return await this.userBusiness.updateStatus(req.params._id, UserStatus.Active);
    }

    async updateFinancialStart() {
        return await this.userBusiness.updateFinancialStart();
    }
}

Object.seal(UserController);
export default UserController;
