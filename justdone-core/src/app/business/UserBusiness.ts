// import * as path from 'path';
import * as validator from 'validator';
import * as crypto from 'crypto';
import * as _ from 'lodash';
import * as fs from 'fs';
import module from 'justdone-system-package/dest/resources/permission/module';
import {ProductCode, RoleCode, BankType, LoginProvider} from 'justdone-system-package/dest/app/model/common/CommonType'; // eslint-disable-line
import UserRepository from 'justdone-system-package/dest/app/repository/UserRepository';
import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate'; // eslint-disable-line
import Project from '../../config/Project';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import IUserBusiness from './interfaces/IUserBusiness'; // eslint-disable-line
import BusinessLoader from '../../system/BusinessLoader';
import User from 'justdone-system-package/dest/app/model/user/User';
import UserCreate from 'justdone-system-package/dest/app/model/user/UserCreate';// eslint-disable-line
import UserUpdate from 'justdone-system-package/dest/app/model/user/UserUpdate';// eslint-disable-line
import UserAuthentication from 'justdone-system-package/dest/app/model/user/UserAuthentication';
import UserToken from 'justdone-system-package/dest/app/model/user/UserToken';
import UserPaymentCard from 'justdone-system-package/dest/app/model/user/UserPaymentCard';// eslint-disable-line
import UserConnectedBank from 'justdone-system-package/dest/app/model/user/UserConnectedBank';
import UserProfile from 'justdone-system-package/dest/app/model/user/UserProfile';
import UserPermission from 'justdone-system-package/dest/app/model/user/UserPermission';
import UserPersonalInfo from 'justdone-system-package/dest/app/model/user/UserPersonalInfo'; // eslint-disable-line
import UserTradingQuestion from 'justdone-system-package/dest/app/model/user/UserTradingQuestion'; // eslint-disable-line
import UserBusinessInfo from 'justdone-system-package/dest/app/model/user/UserBusinessInfo';// eslint-disable-line
import UserChartAccountOpeningBalance from 'justdone-system-package/dest/app/model/user/UserChartAccountOpeningBalance';// eslint-disable-line
import AddressifyHelper from 'justdone-system-package/dest/helpers/AddressifyHelper';
import BankServiceHelper from 'justdone-system-package/dest/helpers/BankServiceHelper';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import GoogleStorageHelper from 'justdone-system-package/dest/helpers/GoogleStorageHelper';
import DateHelper from 'justdone-system-package/dest/helpers/DateHelper';
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import {StatusConnectBank} from 'justdone-system-package/dest/app/model/common/CommonType';
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';
import Permission from 'justdone-system-package/dest/app/model/permission/Permission';
import CustomPermission from 'justdone-system-package/dest/app/model/permission/CustomPermission';
import InvitationRepository from 'justdone-system-package/dest/app/repository/InvitationRepository';
import MailHelper from 'justdone-system-package/dest/helpers/MailHelper';
import LogHelper from 'justdone-system-package/dest/helpers/LogHelper';

class UserBusiness implements IUserBusiness {
    private userRepository: UserRepository;
    private invitationRepository: InvitationRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.invitationRepository = new InvitationRepository();
    }

    // user move data , not use dev
    async getAllClients():Promise<User[]> {
        let roleClient = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        if (!roleClient)
            return [];

        let param = {
            query: {
                'permission.role': DataHelper.toObjectId(roleClient._id),
                'deletedAt': null
            }
        };
        return await this.userRepository.findAll(param);
    }

    async searchAddress(keyword: string, limit: number): Promise<any> {
        if (!keyword || !limit)
            throw new ErrorCommon(101, 'Request');

        return await AddressifyHelper.getAddressAutoComplete(keyword, limit);
    }

    async get(_id: string): Promise<User | null> {
        if (!_id)
            return null;
        let user = (await this.userRepository.get(_id));

        return user;
    }

    async authenticate(productCode: number, email: string, password: string): Promise<UserAuthentication | null> {
        if (!productCode || !email || !validator.isEmail(email) || !password)
            throw new ErrorCommon(101, 'Email or password');

        let user = await Authenticator.authenticate(productCode, email, password).catch(error => {
            return Promise.resolve(null);
        });

        if (user)
            LogHelper.historyService.create({userId: user._id, roleId: user.permission.role._id, productCode: productCode, target: {email: user.email}, claim: module.SYSTEM.claim.ACCESS.code, description: `Login success`, status: 1});

        return user && new UserAuthentication(user);
    }

    async updateFinancialStart() {
        let users = await this.userRepository.updateManyFinancialStart({$set: {financialStart: 2016}});
        return users;
    }

    async getUserByEmail(email: string) {
        let user = await this.getByEmail(email);
        return user;
    }

    async updateFinancial(newYear: number, userId: string) {
        let user = await this.get(userId);
        let rp;
        if (user) {
            let oldFinancialYear = user.financialStart;
            if (oldFinancialYear > newYear) {
                rp = await this.userRepository.update(userId, {$set: {financialStart: newYear}});
            }
            else
                throw new ErrorCommon(101, 'This year');
        }
        else
            throw new ErrorCommon(105, 'User');

        return rp;
    }

    async getClaimAndCustomPermissions(token: string): Promise<{claims: Permission[], customs: CustomPermission[]}> {
        if (!token)
            throw new ErrorCommon(101, 'Request');

        let result = {claims: <Permission[]>[], customs: <CustomPermission[]>[]};
        let user = await AuthorizationHelper.userService.getByToken(token);
        if (!user || !user.permission || !user.permission.role || !user.permission.role._id)
            return result;

        result.claims = await AuthorizationHelper.permissionService.getClaimPermissions(user.permission.product.code, user.permission.role.code);
        result.customs = [];
        return result;
    }

    async getByEmail(email: string): Promise<User | null> {
        if (!email)
            return null;

        email = email.trim().toLowerCase();
        let param = {
            query: {
                email: email
            }
        };
        let user = await this.userRepository.findOne(param);
        return user && new User(user);
    }

    async getByRole(role: string): Promise<User[]> {
        if (!role)
            return [];

        let param = {
            query: {
                'permission.role': DataHelper.toObjectId(role)
            }
        };
        let users = await this.userRepository.findAll(param);
        return User.parseArray(users);
    }

    async getByProductId(productId: string): Promise<any> {
        if (!productId)
            return {status: 400, message: "ProductId is required!"}

        let param = {
            query: {
                'permission.product': DataHelper.toObjectId(productId)
            }
        };
        let users = await this.userRepository.findAll(param);
        return users;
    }

    async getPermission(_id: string): Promise<UserPermission | null> {
        if (!_id)
            return null;

        let user: any = await this.userRepository.get(_id);
        return user && new UserPermission(user.permission);
    }

    async getUserProfile(_id: string, managerId?: string): Promise<UserProfile | null> {
        if (!_id)
            return null;

        let param = {
            query: <any>{
                _id: DataHelper.toObjectId(_id),
            },
            select: 'email firstName lastName gender avatar status financialStart',
            populate: {
                path: 'avatar',
                select: '_id name url'
            }
        };
        if (managerId)
            param.query['permission.managers'] = {$in: [DataHelper.toObjectId(managerId)]};

        let user = await this.userRepository.findOne(param);
        return user && new UserProfile(user);
    }

    async getUsersByRole(users: string[], role: string) : Promise<any[]> {
        if (!users || (users && !users.length) || !role)
            return [];
        let lstUserHaveRole: Object[] = [];
        for (let i = 0; i < users.length; i++) {
            let user = await AuthorizationHelper.userService.get(users[i]);
            if (user && user.permission && user.permission.role && user.permission.role._id && user.permission.role._id === role) {
                let userInfor = {
                    fullName: '',
                    email: '',
                    avatar: ''
                };
                userInfor.fullName = user.fullName;
                userInfor.email = user.email;
                userInfor.avatar = user.avatar;
                lstUserHaveRole.push(userInfor);
            }
        }
        return lstUserHaveRole ? lstUserHaveRole : [];
    }

    // async getByNameAndProduct(keyword: string, products: string[], page: number, limit: number): Promise<User[]> {
    //     let param = {
    //         query: <any>{
    //             'permission.product': {
    //                 $in: products
    //             }
    //         }
    //     };
    //     if (keyword)
    //         param.query.fullName = new RegExp(keyword, 'i');

    //     return await this.userRepository.find(param, {fullName: 1}, page, limit);
    // }

    // async getClientInfo(managerId: string, userId: string): Promise<ClientInfo | null> {
    //     let role = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
    //     if (!role)
    //         return null;

    //     let param = {
    //         query: <any>{
    //             '_id': DataHelper.toObjectId(userId),
    //             'permission.role': {
    //                 $in: [DataHelper.toObjectId(role._id)]
    //             }
    //         },
    //         populate: {
    //             path: 'avatar',
    //             select: '_id name url',
    //         }
    //     };
    //     if (managerId)
    //         param.query['permission.managers'] = {$in: [DataHelper.toObjectId(managerId)]};

    //     let user = await this.userRepository.findOne(param);
    //     let dataUpdate: any = {lastViewed: Date.now()};
    //     if (user)
    //         this.userRepository.update(userId, dataUpdate);
    //     return user && new ClientInfo(user);
    // }

    async getConnectedBanks(originId: string, managerId?: string): Promise<UserConnectedBank[]> {
        let role: any = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        if (!originId || !role)
            return [];
        // get connect bank with permission
        let products = await Authenticator.filterProductsPermission([module.USER.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];

        let param = {
            query: <any>{
                '_id': DataHelper.toObjectId(originId),
                'permission.role': {
                    $in: [DataHelper.toObjectId(role._id)]
                },
                'permission.product': {
                    $in: products.map(product => DataHelper.toObjectId(product._id))
                }
            },
            select: 'connectedBanks'
        };
        if (managerId)
            param.query['permission.managers'] = {$in: [DataHelper.toObjectId(managerId)]};

        let user = await this.userRepository.findOne(param);
        return user && user.connectedBanks ? UserConnectedBank.parseArray(user.connectedBanks) : [];
    }

    async getUserPersonalInfo(_id: string): Promise<UserPersonalInfo | null> {
        if (!_id)
            return null;

        let param = {
            query: <any>{
                '_id': DataHelper.toObjectId(_id),
            },
            select: 'personalInfo',
            populate: {
                path: 'personalInfo.driverLicense',
                select: '_id name url'
            }
        };

        let user = await this.userRepository.findOne(param);
        return user && user.personalInfo!;
    }

    async getUserBusinessInfo(_id: string): Promise<UserBusinessInfo | null> {
        if (!_id)
            return null;

        let param = {
            query: <any>{
                '_id': DataHelper.toObjectId(_id),
            },
            select: 'businessInfo',
            populate: {
                path: 'businessInfo.avatar',
                select: '_id name url'
            }
        };

        let user = await this.userRepository.findOne(param);
        return user && user.businessInfo!;
    }

    async getUserChartAccountOpeningBalance(_id: string): Promise<any> {
        if (!_id)
            return null;

        let populate = {
                path: 'chartAccountOpeningBalance.dataCoaOpeningBalance.coaId',
                select: '_id name code gstType'
            };
    
        let user = await this.userRepository.get(_id, populate);
        return user && user.chartAccountOpeningBalance!;
    }

    async getTradingQuestion(_id: string, managerId?: string): Promise<UserTradingQuestion | null> {
        let role: any = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        if (!_id || !role)
            throw new ErrorCommon(1);

        let param = {
            query: <any>{
                '_id': DataHelper.toObjectId(_id),
                'permission.role': {
                    $in: [DataHelper.toObjectId(role._id)]
                }
            },
            select: 'tradingQuestion'
        };
        if (managerId)
            param.query['permission.managers'] = {$in: [DataHelper.toObjectId(managerId)]};

        let user = await this.userRepository.findOne(param);
        return user && user.tradingQuestion ? new UserTradingQuestion(user.tradingQuestion) : null;
    }

    async getCountUser(_ids: string[]): Promise<number> {
        let params = {
            query: {
                _id: {$in: _ids},
            }
        };
        return await this.userRepository.getCount(params);
    }

    // async searchClientAll(keyword: string, roleName: string, page: number, limit: number): Promise<ClientAccount[]> {
    //     let role = await BusinessLoader.roleBusiness.getByCode(RoleCode[`${roleName}`]);
    //     if (!role)
    //         return [];
    //     if (!keyword)
    //         return [];
    //     let regSearch = new RegExp(keyword, 'i');
    //     let params = {
    //         query: <any>{
    //             'permission.role': {$in: [DataHelper.toObjectId(role._id)]},
    //             '$or': [
    //                 {fullName: regSearch},
    //                 {email: regSearch},
    //                 {'personalInfo.phone': regSearch},
    //                 {'businessInfo.abnCode': regSearch}]
    //         }
    //     };
    //     let result = await this.userRepository.find(params, null, page, limit);
    //     return ClientAccount.parseArray(result);
    // }

    async validateEmail(email: string, isCheckExists?: boolean): Promise<boolean> {
        if (!email)
            throw new ErrorCommon(105, 'Email');
        else if (!validator.isEmail(email))
            throw new ErrorCommon(101, 'Email');

        email = email.trim().toLowerCase();
        let users = await this.userRepository.aggregate([{
            $match: {
                email: email
            }
        }]);
        if (isCheckExists && users.length)
            throw new ErrorCommon(104, 'Email');
        // disable check real email
        // if (!email.endsWith('@justdone.com.au') && !(await MailHelper.checkRealEmail(email)))
        //     throw new ErrorCommon(108, 'Email');

        return true;
    }

    // async getUserRelative(_id: string, idUser: string, idRole: string): Promise<UserAuthentication | null> {
    //     if (!_id || !idUser || !idRole)
    //         throw new ErrorCommon(3);
    //     let role = await BusinessLoader.roleBusiness.get(idRole);
    //     if (!role)
    //         throw new ErrorCommon(102, 'Role');
    //     let user: any;
    //     if (role && role.name === 'Manager') {
    //         let param = {
    //             query: <any>{
    //                 '_id': DataHelper.toObjectId(idUser),
    //                 'permission.managers': {
    //                     $in: [DataHelper.toObjectId(_id)]
    //                 }
    //             }
    //         };
    //         user = await this.userRepository.findOne(param);
    //         return user && new UserAuthentication(user);
    //     }
    //     else {
    //         let param = {
    //             query: <any>{
    //                 '_id': DataHelper.toObjectId(_id),
    //                 'permission.managers': {
    //                     $in: [DataHelper.toObjectId(idUser)]
    //                 }
    //             }
    //         };
    //         let isUserRelatived = await this.userRepository.findOne(param);
    //         if (isUserRelatived) {
    //             let param = {
    //                 query: <any>{
    //                     _id: DataHelper.toObjectId(idUser),
    //                 }
    //             };
    //             user = await this.userRepository.findOne(param);
    //             return user && new UserAuthentication(user);
    //         }
    //         else {
    //             return null;
    //         }
    //     }
    // }

    // Not use this time
    async retrieveForgotKey(productCode: number, fromEmail: string, fromName: string, email: string): Promise<boolean> {
        email = email.toLowerCase().trim();
        if (this.validateEmail(email)) {
            let user = await this.getByEmail(email);
            if (!user)
                throw new ErrorCommon(101, 'Data');
            else if (!email.trim().endsWith('@justdone.com.au')) {
                let forgotKey = Math.random().toString(36).substr(2) + 'A' + Math.random().toString(36).substr(3);
                user.forgotKey = {
                    key: forgotKey,
                    expiryDate: DateHelper.addDays(new Date(), 1)
                };

                if (this.sendEmail(productCode, fromEmail, fromName, email, user.firstName, user.lastName, forgotKey)) {
                    await this.userRepository.update(user._id, user);
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        return false;
    }

    async sendEmail(productCode: number, fromEmail: string, fromName: string, toEmail: string, toFirstName: string, toLastName: string, forgotKey: string): Promise<boolean> {
        let fullName = toFirstName + ' ' + toLastName;

        let product = await BusinessLoader.productBusiness.getByCode(productCode);
        if (!product)
            throw new ErrorCommon(101, 'Request');

        let data = {
            title: 'Forgot your password?',
            toName: fullName,
            // directionLink: `${product.config.domain}/reset?token=${forgotKey}`,
            // directionLink: `${Project.SERVER.WHITE_LABEL.PROTOTYPE}://${Project.SERVER.WHITE_LABEL.DOMAIN}/reset?token=${forgotKey}`,
            directionLink: `${Project.SERVER.WHITE_LABEL.PROTOTYPE}://${product.config.domain}/reset?token=${forgotKey}`,

            content: 'Not to worry, we got you! Let is get you a new password.',
            note: '',
            fromEmail,
            fromName
        };
        // let fromData = {
        //     email: fromEmail,
        //     name: fromName
        // };
        // to do check real-email
        let toData = {};
        toData[toEmail] = fullName;
        let content = await MailHelper.loadMailTemplate('./src/resources/templates/mail/forgot-mail.html', data);
        let result;
        try {
            result = await MailHelper.sendMailAdvanced(null, toData, 'Join our system', content);
        }
        catch (e) {}

        return result;
    }

    // Not use this time
    async validateForgotkey(forgotKey: string): Promise<boolean> {
        let param = {
            query: <any>{
                'forgotKey.key': forgotKey,
                'forgotKey.expiryDate': {$gte: new Date()}
            }
        };
        let user = await this.userRepository.findOne(param);
        if (user) {
            return true;
        }
        else {
            return false;
        }
    }

    // Not use this time
    async resetPassword(data: any): Promise<boolean> {
        if (!data || !data.forgotKey || !data.password)
            throw new ErrorCommon(111, 'ForgotKey');

        let result;
        let param = {
            query: <any>{
                'forgotKey.key': data.forgotKey,
                'forgotKey.expiryDate': {$gte: new Date()}
            }
        };
        let user = await this.userRepository.findOne(param);
        if (!this.validateForgotkey(data.forgotKey))
            throw new ErrorCommon(111, 'ForgotKey');
        else {
            if (!user) {
                throw new ErrorCommon(111, 'Data');
            }
            let dataUpdate: any = {password: hashPassword(data.password), forgotKey: {}};
            result = await this.userRepository.update(user._id, dataUpdate);
        }
        return result ? true : false;
    }

    async getIdRoleAdmin(): Promise<any> {
        let arrRoles = await BusinessLoader.roleBusiness.getByCodes([2]);
        let resultUser: any = [];

        for (let i = 0; i < arrRoles.length; i++) {
            let result = await this.getByRole(String(arrRoles[i]._id));
            result.forEach(item => {
                resultUser.push(item._id);
            });
        }

        return resultUser;
    }

    async create(data: UserCreate): Promise<User> {
        let user;
        let rolePermis = await this.getIdRoleAdmin();
        if (data.permission) {
            for (let i = 0; i < rolePermis.length; i++) {
                data.permission.managers.push(rolePermis[i]);
            }
        }
        data.email = data.email.toLowerCase().trim();
        if (await this.validateEmail(data.email, true) && data.password && validatePassword(data.password)) {
            data.password = hashPassword(data.password);
            user = await this.userRepository.create(data);
        }
        return user;
    }

    async createAndUpdateUserChartAccountOpeningBalance(_id: string, data: any): Promise<any> {
        if(!data.dataCoaOpeningBalance || !_id || !data.month || !data.year)
            return false
        let date = new Date();
        if(new Date(data.year, data.month, 1) > new Date(date.getFullYear(), date.getMonth() + 1, 1))
            return false
        let user = await this.get(_id);
        if(!user)
            return false

        data.dataCoaOpeningBalance.filter((item) => {
            if (item.coaName === "Drawing" || !item.coaId) {
                item.specialCoaName = item.coaName;
                console.log("We have 1 coa Drawing here =>>>>>>>>>>>>>>>>");
            }
        })
        
        let dataUpdate: any = {chartAccountOpeningBalance: data};
        await this.userRepository.update(_id, dataUpdate);
        return true;
    }

    // use when convert user justdone old => live;
    async createWithoutValidateEmail(data: UserCreate): Promise<User> {
        data.email = data.email.toLowerCase().trim();
        data.password = validatePassword(data.password) ? data.password : 'Kitty123!';

        let product = await BusinessLoader.productBusiness.getByCode(ProductCode.Precis);
        if (!product)
            throw new ErrorCommon(101, 'Request');

        let roleClient = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        let roleSuperAdmin = await BusinessLoader.roleBusiness.getByCode(RoleCode.SuperAdmin);
        if (!roleClient || !roleSuperAdmin)
            throw new ErrorCommon(101, 'Request');

        let superAdmin = await this.userRepository.findOne({
            query: {
                'permission.role': DataHelper.toObjectId(roleSuperAdmin._id)
            }
        });
        if (!superAdmin)
            throw new ErrorCommon(101, 'Request');

        let managers: string[] = [superAdmin._id];

        data.permission = {
            product: product._id,
            role: roleClient._id,
            managers
        };

        return await this.create(data);
    }

    // Need split this function to 2 functions: signup & signupByInvitation
    async signup(productCode: number, data: UserCreate, inviteToken?: string): Promise<UserAuthentication> {
        if (!productCode || !data)
            throw new ErrorCommon(101, 'Request');

        data.activationKey = Math.random().toString(36).substr(2);
        data.email = data.email.toLowerCase().trim();

        let product = await BusinessLoader.productBusiness.getByCode(productCode);
        if (!product)
            throw new ErrorCommon(101, 'Request');
        let isCreate = await this.checkLimitClient(productCode);
        if (!isCreate)
            throw new ErrorCommon(101, 'Limit Client');
        let roleClient = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        if (!roleClient)
            throw new ErrorCommon(3);

        data.permission = new UserPermission({
            product: product._id,
            role: roleClient._id,
            managers: []
        });

        let managerIds: string[] = [];
        let invite: any;
        let managers: any = [];

        /** Check email had register with system-db */
        let bodyEmail = {
            query: {
                email: data.email
            }
        };
        if (await this.userRepository.findOne(bodyEmail))
            throw new ErrorCommon(101, 'Request');

        /** Check inviteToken */
        if (inviteToken && inviteToken.length > 0) {
            let params = {
                query: {
                    'token.accessToken': inviteToken
                }
            };
            invite = await this.invitationRepository.findOne(params);

            if (!invite || !invite._id || !invite.userId)
                throw new ErrorCommon(101, 'Request');

            /* * Get user and managers of user invite client */
            let body = {
                query: {
                    _id: DataHelper.toObjectId(invite.userId)
                },
                select: 'permission'
            };
            let manager: any = await this.userRepository.findOne(body);
            if (!manager || !manager.permission.managers.length)
                throw new ErrorCommon(101, 'Request');

            /** Get manager in product of user and send notification to manager */
            let paramsManager = {
                query: {
                    '_id': {$in: manager.permission.managers.map(managerId => DataHelper.toObjectId(managerId))},
                    'permission.product': DataHelper.toObjectId(product._id)
                }
            };
            let managersOnlyProduct = await this.userRepository.findAll(paramsManager);
            managersOnlyProduct.forEach(manager => {
                managerIds.push(manager._id);
            });

            /** Manager List assign to client */
            managers = managers.concat(manager.permission.managers);
            managers.push(invite.userId);

            data.permission.managers = managers;
        }
        else {
            /** Signup client's Self */
            let roleSuperAdmin = await BusinessLoader.roleBusiness.getByCode(RoleCode.SuperAdmin);
            if (!roleSuperAdmin)
                throw new ErrorCommon(3);

            let managers = await BusinessLoader.managerBusiness.getManagersByRole(roleSuperAdmin._id);
            if (!managers)
                throw new ErrorCommon(3);
            managerIds.push(managers[0]._id);
            data.permission.managers = managerIds;
        }

        let user = await this.create(data);
        user.permission!.product = product;
        user.permission!.role = roleClient;

        user.token = await this.updateUserToken(user._id, new UserToken(<any>{provider: LoginProvider.Local}));
        if (!user)
            throw new ErrorCommon(113, 'Signup');

        if (inviteToken) {
            this.invitationRepository.delete(invite._id, true);
        }

        // notification to manager
        LogHelper.notificationService.createMultipleToReceiverIds({title: 'Create client', message: `Create client <a href="/client-management" target="_blank">${user.email}</a>`, receiverIds: managerIds});

        // this.updateYodleeAccount(user._id);
        // BankServiceHelper.createAccount(user._id.toString(), user.email);

        // notification to manager
        //     LogHelper.notificationService.createMultiple({title: 'Create client', message: `Create client <a href="/client-management" target="_blank">${user.email}</a>`, receiverIds: managers});
        // End of assign
        return user && new UserAuthentication(<any>user);
    }

    async switchDataConnectBank(): Promise<any> {
        let param = {
            query: {
                'connectedBanks': {$exists:true}, $where:'this.connectedBanks.length > 0',
            }
        };
        let user = await this.userRepository.findConnectBankUsers(param);
        if(!user.length)
            return true;
        let connectedBanks: any[] = [];
        let accountConnectedBanks: any[] = [];
        for(let i = 0; i < user.length; i++) {
            let item = user[i];
            item.connectedBanks.forEach((element: any) => {
                element.userId = item._id;
                element.createdAt = item.createdAt;
            });
            connectedBanks = connectedBanks.concat(item.connectedBanks);
        }
        for(let j = 0; j < connectedBanks.length; j++) {
            let item: any = connectedBanks[j];
            let userId: any = {userId: item.userId, createdAt: item.createdAt};
            if (item.accounts && item.accounts.length > 0) {
                let data: any[] = [];
                item.accounts.forEach((element: any) => {
                    let object = {...element, ...userId};
                    data.push(object);
                });
                accountConnectedBanks = accountConnectedBanks.concat(data);
            }
        }
        let dataCreateSuccess: any[] = [];
        let dataCreateFailed: any[] = [];
        let seperateData: any[] = [];
        const limit: number = 10;
        for(let x = 1; x < accountConnectedBanks.length; x++) {
            let item: any = accountConnectedBanks[x - 1];
            seperateData.push(item);
            if (x % limit === 0 || x === accountConnectedBanks.length) {
                for(let y = 0; y < seperateData.length; y++) {
                    let element: any = seperateData[y];
                    let checkStatus = await BankServiceHelper.getStatusConnectingBank(element.userId, element.providerAccountId);
                    if (checkStatus && checkStatus.providerAccount) {
                        let bank = await BankServiceHelper.getProviderById(element.userId, element.providerId);
                        if (checkStatus.providerAccount.refreshInfo.status === 'SUCCESS' || checkStatus.providerAccount.refreshInfo.status === 'PARTIAL_SUCCESS') {
                            let checkAccountId = dataCreateSuccess.findIndex(ele => String(ele.accountId) === String(element.id));
                            if(checkAccountId !== -1)
                                dataCreateSuccess.splice(checkAccountId,1);
                            dataCreateSuccess.push({
                                userId: element.userId,
                                providerAccountId: element.providerAccountId,
                                providerId: element.providerId,
                                providerName: bank.provider[0].name,
                                refreshinfo: {
                                    lastRefreshed: element.refreshinfo.lastRefreshed,
                                    nextRefreshScheduled: element.refreshinfo.nextRefreshScheduled,
                                    lastRefreshAttempt: element.refreshinfo.lastRefreshAttempt,
                                    statusMessage: element.refreshinfo.statusMessage,
                                    statusCode: element.refreshinfo.statusCode
                                },
                                type: element.CONTAINER === 'bank' ? BankType.Bank : BankType.CreditCard,
                                accountId: element.id,
                                accountStatus: element.accountStatus,
                                accountNumber: element.accountNumber ? element.accountNumber : '',
                                accountName: element.accountName,
                                currentBalance: element.balance.amount,
                                favicon: bank.provider[0].favicon || '',
                                getTransactionAt: new Date(new Date(element.createdAt).setFullYear(new Date(element.createdAt).getFullYear() - 1)),
                                status: StatusConnectBank.Connected
                            });
                        } else if (checkStatus.providerAccount.refreshInfo.status === 'FAILED') {
                            let checkProviderAccountId = dataCreateFailed.find(ele => String(ele.providerAccountId) === String(element.providerAccountId));
                            if(!checkProviderAccountId) {
                                dataCreateFailed.push({
                                    userId: element.userId,
                                    providerAccountId: element.providerAccountId,
                                    providerId: element.providerId,
                                    providerName: bank.provider[0].name,
                                    favicon: bank.provider[0].favicon || '',
                                    status: StatusConnectBank.Connecting
                                });
                            }
                        }
                    }
                }
                seperateData = [];
            }
        }
        dataCreateSuccess = dataCreateSuccess.concat(dataCreateFailed);
        if (dataCreateSuccess.length) {
            // fs.writeFileSync(path.join(__dirname, '../../uploads/test'), String(dataCreate) , 'utf8');
            await BusinessLoader.connectBankBusiness.createConnectBankMultiple(dataCreateSuccess);
        }

        return true;
    }

    async uploadUserDriverLicense(productCode: number, data: FileCreate): Promise<string | null> {
        let user = await this.userRepository.get(data.userId);
        if (!user)
            throw new ErrorCommon(101, 'Request');

        let prefix = GoogleStorageHelper.getProfilePrefix(data.userId, productCode);
        data.prefix = prefix;
        data.productCode = productCode;

        let file = await BusinessLoader.fileBusiness.create(data);

        let result = await this.userRepository.update(file.userId, <any>{'personalInfo.driverLicense': file._id});

        if (result)
            return file.url ? file.url : null;
        return null;
    }

    async checkLimitClient(productCode) : Promise<boolean> {
        let product = await BusinessLoader.productBusiness.getByCode(productCode);
        if (!product)
            return false;
        let clientLimit = product.config.clientLimit >= 0 ? product.config.clientLimit : -1;
        if (clientLimit === -1)
            return true;
        let clientRole = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        if (!clientRole)
            return false;
        let param = {
            query: <any>{
                'permission.role': {
                    $in: [DataHelper.toObjectId(clientRole._id)]
                },
                'permission.product': {
                    $in: [DataHelper.toObjectId(product._id)]
                }
            }
        };
        let numberClient = await this.userRepository.getCount(param);
        if (numberClient > clientLimit)
            return false;
        else
            return true;
    }

    async uploadVehicleAttachments(productCode: number, data: FileCreate): Promise<string | null> {
        let user = await this.userRepository.get(data.userId);
        if (!user)
            throw new ErrorCommon(101, 'Request');

        let prefix = GoogleStorageHelper.getProfilePrefix(data.userId, productCode);
        data.prefix = prefix;
        data.productCode = productCode;

        let file = await BusinessLoader.fileBusiness.create(data);

        let fileIds = user.tradingQuestion && user.tradingQuestion.vehicleAttachments;

        if (!fileIds)
            fileIds = [];
        fileIds.push(file._id.toString());

        let result = await this.userRepository.update(file.userId, <any>{'tradingQuestion.vehicleAttachments': fileIds});

        if (result)
            return file.url ? file.url : null;
        return null;
    }

    async uploadAvatar(originId: string, productCode: number, data: FileCreate): Promise<string | null> {
        let user = await this.userRepository.get(originId);
        if (!user)
            throw new ErrorCommon(101, 'Request');

        let prefix = GoogleStorageHelper.getProfilePrefix(originId, productCode);
        data.prefix = prefix;
        data.productCode = productCode;

        let file = await BusinessLoader.fileBusiness.create(data);

        let result = await this.userRepository.update(file.userId, <any>{avatar: file._id});

        if (result) {
            Authenticator.removeAuthenticator(file.userId);
            return file.url ? file.url : null;
        }
        return null;
    }

    async uploadBusinessLogo(productCode: number, data: FileCreate): Promise<string | null> {
        let user = await this.userRepository.get(data.userId);
        if (!user)
            throw new ErrorCommon(101, 'Request');

        let prefix = GoogleStorageHelper.getProfilePrefix(data.userId, productCode);
        data.prefix = prefix;
        data.productCode = productCode;

        let file = await BusinessLoader.fileBusiness.create(data);

        let result = await this.userRepository.update(file.userId, <any>{'businessInfo.avatar': file._id});

        if (result)
            return file.url ? file.url : null;
        return null;
    }

    async update(_id: string, data: UserUpdate): Promise<UserProfile | null> {
        let result = await this.userRepository.update(_id, data);
        if (result) {
            Authenticator.removeAuthenticator(_id);
            return await this.getUserProfile(_id);
        }
        return null;
    }

    private async updateUserToken(_id: string, token: UserToken): Promise<UserToken> {
        token.accessToken = createAccessToken();
        token.tokenExpire = DateHelper.addDays(new Date(), Project.EXPIRE_DAYS);
        let dataUpdate: any = {token};
        await this.userRepository.update(_id, dataUpdate);
        Authenticator.removeAuthenticator(_id);
        return token;
    }

    async updateYodleeAccount(_id: string):Promise<any> {
        let loginName = `JustDone_Live_${_id.toString()}`;
        let password = '@69n@mTech@hungLive!';

        let yodleeAccount = {
            user: loginName,
            password: password
        };
        await this.userRepository.update(_id, <any>{yodleeAccount});
    }

    async updateStatus(_id: string, status: number): Promise<string | null> {
        let result = await this.userRepository.update(_id, <any>{status});
        if (result)
            Authenticator.removeAuthenticator(_id);
        return result ? _id : null;
    }

    // async assignUser(_id: string, managerId: string): Promise<boolean> {
    //     let result = await this.userRepository.update(_id, <any>{'permission.managers': [DataHelper.toObjectId(managerId)]});
    //     if (result)
    //         Authenticator.removeAuthenticator(_id);
    //     return result;
    // }

    async updatePersonalInfo(_id: string, personalInfo: UserPersonalInfo): Promise<boolean> {
        if (personalInfo && personalInfo.driverLicense)
            delete personalInfo.driverLicense;
        return await this.userRepository.update(_id, <any>{personalInfo});
    }

    async updateTradingQuestion(_id: string, tradingQuestion: UserTradingQuestion): Promise<boolean> {
        return await this.userRepository.update(_id, <any>{tradingQuestion});
    }

    async updateBusinessInfo(_id: string, businessInfo: UserBusinessInfo): Promise<boolean> {
        return await this.userRepository.update(_id, <any>{
            'businessInfo.abnCode': businessInfo.abnCode,
            'businessInfo.entityName': businessInfo.entityName,
            'businessInfo.entityType': businessInfo.entityType,
            'businessInfo.address': businessInfo.address,
        });
    }

    async updatePaymentCard(_id: string, paymentCard: UserPaymentCard): Promise<boolean> {
        return await this.userRepository.update(_id, <any>{paymentCard});
    }

    async updateConnectedBanks(_id: string, userConnectedBanks: any): Promise<boolean> {
        if (!userConnectedBanks && !userConnectedBanks.type)
            new ErrorCommon(102, 'Type Connected');
        if (UserConnectedBank['type'] !== BankType.Bank && UserConnectedBank['type'] !== BankType.CreditCard)
            new ErrorCommon(102, 'Type Bank');
        let user = await this.userRepository.get(_id);
        if (!user)
            throw new ErrorCommon(102, 'User');
        let connectedBanks = user.connectedBanks ? user.connectedBanks : [];
        let indexConnected = _.findIndex(connectedBanks, (item) => {
            return item.type === userConnectedBanks.type;
        });
        if (indexConnected === -1) {
            if (!userConnectedBanks.providerId)
                throw new ErrorCommon(114, 'ProviderId');
            connectedBanks.push({
                currentBalance: userConnectedBanks.currentBalance ? userConnectedBanks.currentBalance : 0,
                type: userConnectedBanks.type,
                providerId: userConnectedBanks.providerId ? userConnectedBanks.providerId : '',
                connectedId: userConnectedBanks.connectedId ? userConnectedBanks.connectedId : '',
                connectedName: userConnectedBanks.connectedName ? userConnectedBanks.connectedName : '',
                bankId: userConnectedBanks.bankId ? userConnectedBanks.bankId : '',
            });
        }
        else {
            if (_.isArray(connectedBanks[indexConnected].accounts) && connectedBanks[indexConnected].accounts.length !== 0 && userConnectedBanks.connectedId) {
                let typeBank = connectedBanks[indexConnected].type === BankType.Bank ? 'bank' : 'creditCard';
                let account = connectedBanks[indexConnected].accounts.find((account) => {
                    return account.id === userConnectedBanks.connectedId && account.CONTAINER === typeBank;
                });
                if (!account)
                    return false;
                let accounts = [account];
                connectedBanks[indexConnected] = {
                    currentBalance: account ? (connectedBanks[indexConnected].type === BankType.Bank ? account.currentBalance.amount : account.balance.amount) : (connectedBanks[indexConnected] ? connectedBanks[indexConnected].currentBalance : 0),
                    type: connectedBanks[indexConnected].type,
                    providerId: userConnectedBanks.providerId ? userConnectedBanks.providerId : connectedBanks[indexConnected].providerId,
                    connectedId: userConnectedBanks.connectedId ? userConnectedBanks.connectedId : connectedBanks[indexConnected].connectedId,
                    connectedName: userConnectedBanks.connectedName ? userConnectedBanks.connectedName : connectedBanks[indexConnected].connectedName,
                    bankId: userConnectedBanks.bankId ? userConnectedBanks.bankId : connectedBanks[indexConnected].bankId,
                    accounts: accounts
                };
            }
            else
                connectedBanks[indexConnected] = {
                    currentBalance: userConnectedBanks.currentBalance ? userConnectedBanks.currentBalance : connectedBanks[indexConnected] ? connectedBanks[indexConnected].currentBalance : 0,
                    type: connectedBanks[indexConnected].type,
                    providerId: userConnectedBanks.providerId ? userConnectedBanks.providerId : connectedBanks[indexConnected].providerId,
                    connectedId: userConnectedBanks.connectedId ? userConnectedBanks.connectedId : connectedBanks[indexConnected].connectedId,
                    connectedName: userConnectedBanks.connectedName ? userConnectedBanks.connectedName : connectedBanks[indexConnected].connectedName,
                    bankId: userConnectedBanks.bankId ? userConnectedBanks.bankId : connectedBanks[indexConnected].bankId,
                    accounts: userConnectedBanks.accounts ? userConnectedBanks.accounts : (connectedBanks[indexConnected].accounts ? connectedBanks[indexConnected].accounts : [])
                };
        }

        return await this.userRepository.update(_id, <any>{connectedBanks});
    }

    async updateSubContractors(_id: string, subContractors: any): Promise<boolean> {
        for (let i = 0; i < subContractors.length; i++) {
            if (!subContractors[i].name || !subContractors[i].abnCode) {
                throw new ErrorCommon(3);
            };
        };
        return await this.userRepository.update(_id, <any>{subContractors});
    }

    // async updateProduct(_id: string, productId: string): Promise<boolean> {
    //     Authenticator.removeAuthenticator(_id);
    //     let dataUpdate: any = {
    //         'permission.product': DataHelper.toObjectId(productId)
    //     };
    //     return await this.userRepository.update(_id, dataUpdate);
    // }

    // async updateRole(_id: string, roleId: string): Promise<boolean> {
    //     Authenticator.removeAuthenticator(_id);
    //     let dataUpdate: any = {
    //         'permission.role': DataHelper.toObjectId(roleId)
    //     };
    //     return await this.userRepository.update(_id, dataUpdate);
    // }

    async updatePassword(_id: string, data: any): Promise<boolean> {
        if (!data.oldPassword || !data.newPassword)
            throw new ErrorCommon(3);
        let params = {
            query: <any>{
                _id: DataHelper.toObjectId(_id),
                password: hashPassword(data.oldPassword)
            }
        };
        let user = await this.userRepository.findOne(params);
        if (!user)
            throw new ErrorCommon(108, 'Password');
        return await this.userRepository.update(_id, <any>{password: hashPassword(data.newPassword)});
    }

    async delete(_id: string): Promise<boolean> {
        Authenticator.removeAuthenticator(_id);
        return await this.userRepository.delete(_id);
    }

    async yodleeValidateData(userId: string, fullName: any, type: number) {
        let user = await this.userRepository.get(userId);
        if (!user)
            throw new ErrorCommon(105, 'Password');
        let data = {
            userId: userId,
            tracking: fullName,
            type: type
        };
        let text = JSON.stringify(data);
        let time = new Date().getTime();
        fs.writeFile(`./ks/${userId}_${time}`, text, (err) => {
            if (err) {
                
            }
        } );
        return true;
    }
}

function validatePassword(password: string | undefined): boolean {
    if (!password)
        throw new ErrorCommon(105, 'Password');

    let regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;
    if (!regExp.test(password))
        throw new ErrorCommon(4);

    return true;
}

function hashPassword(password: string) {
    if (password)
        return crypto.createHash('md5').update('$$' + password).digest('hex');
    return '';
}

function createAccessToken() {
    return crypto.randomBytes(64).toString('hex').substr(0, 128);
}

// function selectUserLoginFields() {
//     return '-status -activationKey -intercomId -personalInfo -businessInfo -paymentCard -paymentInfo -connectedBanks -subContractors';
// };

Object.seal(UserBusiness);
export default UserBusiness;
