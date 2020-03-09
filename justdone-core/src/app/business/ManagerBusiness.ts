import * as crypto from 'crypto';
import * as _ from 'lodash';
import { Types } from "mongoose";
import * as moment from 'moment';
import module from 'justdone-system-package/dest/resources/permission/module';
import IManagerBusiness from './interfaces/IManagerBusiness'; // eslint-disable-line
import BusinessLoader from '../../system/BusinessLoader';
import UserRepository from 'justdone-system-package/dest/app/repository/UserRepository';
import ConnectBankRepository from "justdone-system-package/dest/app/repository/ConnectBankRepository";
import InvitationRepository from 'justdone-system-package/dest/app/repository/InvitationRepository';
import {ProductCode, RoleCode, BankType, UserStatus, GenderType, LoginProvider, ProductType} from 'justdone-system-package/dest/app/model/common/CommonType'; // eslint-disable-line
import Project from '../../config/Project';
import User from 'justdone-system-package/dest/app/model/user/User';
import UserCreate from 'justdone-system-package/dest/app/model/user/UserCreate'; // eslint-disable-line
import UserUpdate from 'justdone-system-package/dest/app/model/user/UserUpdate'; // eslint-disable-line
import ClientLookup from 'justdone-system-package/dest/app/model/user/ClientLookup';
import UserToken from 'justdone-system-package/dest/app/model/user/UserToken';
import UserAuthentication from 'justdone-system-package/dest/app/model/user/UserAuthentication';
import UserProfile from 'justdone-system-package/dest/app/model/user/UserProfile';
import UserPersonalInfo from 'justdone-system-package/dest/app/model/user/UserPersonalInfo'; // eslint-disable-line
import UserConnectedBank from 'justdone-system-package/dest/app/model/user/UserConnectedBank';
import ClientInfo from 'justdone-system-package/dest/app/model/user/ClientInfo';
import ClientAccount from 'justdone-system-package/dest/app/model/user/ClientAccount';
import ManagerAccount from 'justdone-system-package/dest/app/model/user/ManagerAccount';
import UserBusinessInfo from 'justdone-system-package/dest/app/model/user/UserBusinessInfo'; // eslint-disable-line
import UserPermission from 'justdone-system-package/dest/app/model/user/UserPermission';
import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate'; // eslint-disable-line
import Invitation from 'justdone-system-package/dest/app/model/invitation/Invitation';
import InvitationToken from 'justdone-system-package/dest/app/model/invitation/InvitationToken';
import InvitationCreate from 'justdone-system-package/dest/app/model/invitation/InvitationCreate';
import InvitationUpdate from 'justdone-system-package/dest/app/model/invitation/InvitationUpdate';
import Pagination from 'justdone-system-package/dest/app/model/common/Pagination';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import DateHelper from 'justdone-system-package/dest/helpers/DateHelper';
import MailHelper from 'justdone-system-package/dest/helpers/MailHelper';
import GoogleStorageHelper from 'justdone-system-package/dest/helpers/GoogleStorageHelper';
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';
import LogHelper from 'justdone-system-package/dest/helpers/LogHelper';
import ConnectBank from 'justdone-system-package/dest/app/model/connectBank/ConnectBank';

class ManagerBusiness implements IManagerBusiness {
    private userRepository: UserRepository;
    private _connectBankReponsitory:ConnectBankRepository;
    private invitationRepository: InvitationRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.invitationRepository = new InvitationRepository();
        this._connectBankReponsitory = new ConnectBankRepository();
    }

    // not use at the moment
    async get(_id: string): Promise<User | null> {
        return null;
    }

    async getClientInfo(originId: string, targetId: string): Promise<ClientInfo | null> {
        if (!originId)
            return null;

        let targetUser = await AuthorizationHelper.userService.get(targetId);
        if (!targetUser || !targetUser.permission ||
            !targetUser.permission.role || targetUser.permission.role.code !== RoleCode.Client ||
            !targetUser.permission.managers.find(managerId => managerId.toString() === originId))
            return null;

        let targetProduct = targetUser.permission && targetUser.permission.product;
        if (!targetProduct || !targetProduct.code)
            return null;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, [targetProduct.code], [RoleCode.Client]);
        if (!products || !products.length)
            return null;
        let param = {
            query: <any>{
                _id: DataHelper.toObjectId(targetId)
            },
            populate: [{
                path: 'avatar',
                select: 'name url',
            }, {
                path: 'permission.role',
                select: 'name code',
            }, {
                path: 'permission.product',
                select: 'name code',
            }],

        };

        let user = await this.userRepository.findOne(param);
        let dataUpdate: any = {lastViewed: Date.now()};
        if (user) {
            user.permission!.product.config = products[0].config;
            this.userRepository.update(targetId, dataUpdate);
        }
        return user && new ClientInfo(user);
    }

    // Get profile of client or manager
    async getUserProfile(originId: string, targetId: string): Promise<UserProfile | null> {
        if (!originId || !targetId)
            return null;

        let targetUser = await AuthorizationHelper.userService.get(targetId);
        if (!targetUser || !targetUser.permission ||
            !targetUser.permission.role ||
            !targetUser.permission.managers.find(managerId => managerId.toString() === originId))
            return null;

        let targetProduct = targetUser.permission && targetUser.permission.product;
        if (!targetProduct || !targetProduct.code)
            return null;

        let products;
        if (targetUser.permission.role.code === RoleCode.Client)
            products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, [targetProduct.code], [RoleCode.Client]);
        else
            products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET.code], originId, [targetProduct.code], [targetUser.permission.role.code]);
        if (!products || !products.length)
            return null;

        let param = {
            query: <any>{
                _id: DataHelper.toObjectId(targetId)
            },
            select: 'email firstName lastName gender avatar status',
            populate: {
                path: 'avatar',
                select: '_id name url'
            }
        };

        let user = await this.userRepository.findOne(param);
        return user && new UserProfile(user);
    }

    async getUserPersonalInfo(originId: string, targetId: string): Promise<UserPersonalInfo | null> {
        if (!originId || !targetId)
            return null;
        let targetUser = await AuthorizationHelper.userService.get(targetId);
        if (!targetUser || !targetUser.permission ||
            !targetUser.permission.role ||
            !targetUser.permission.role || targetUser.permission.role.code !== RoleCode.Client ||
            !targetUser.permission.managers.find(managerId => managerId.toString() === originId))
            return null;

        let targetProduct = targetUser.permission && targetUser.permission.product;
        if (!targetProduct || !targetProduct.code)
            return null;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT_PERSONAL_INFO.code], originId, [targetProduct.code], [RoleCode.Client]);
        if (!products || !products.length)
            return null;

        let param = {
            query: <any>{
                '_id': DataHelper.toObjectId(targetId),
                // 'permission.role': {
                //     $in: [DataHelper.toObjectId(role._id)]
                // }
            },
            select: 'personalInfo',
            populate: {
                path: 'personalInfo.driverLicense',
                select: '_id name url'
            }
        };
        // if (originId)
        //     param.query['permission.managers'] = {$in: [DataHelper.toObjectId(originId)]};
        let user = await this.userRepository.findOne(param);

        return user && user.personalInfo!;
    }

    async getUserBusinessInfo(originId: string, targetId: string): Promise<UserBusinessInfo | null> {
        if (!originId || !targetId)
            return null;
        let targetUser = await AuthorizationHelper.userService.get(targetId);
        if (!targetUser || !targetUser.permission ||
            !targetUser.permission.role ||
            !targetUser.permission.role || targetUser.permission.role.code !== RoleCode.Client ||
            !targetUser.permission.managers.find(managerId => managerId.toString() === originId))
            return null;

        let targetProduct = targetUser.permission && targetUser.permission.product;
        if (!targetProduct || !targetProduct.code)
            return null;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT_BUSINESS_INFO.code], originId, [targetProduct.code], [RoleCode.Client]);
        if (!products || !products.length)
            return null;

        let param = {
            query: <any>{
                '_id': DataHelper.toObjectId(targetId),
                // 'permission.role': {
                //     $in: [DataHelper.toObjectId(role._id)]
                // }
            },
            select: 'businessInfo',
            populate: {
                path: 'businessInfo.avatar',
                select: '_id name url'
            }
        };
        // if (managerId)
        //     param.query['permission.managers'] = {$in: [DataHelper.toObjectId(managerId)]};

        let user = await this.userRepository.findOne(param);

        return user && user.businessInfo!;
    }

    async getInvitationById(originId: string, targetId: string): Promise<Invitation | null> {
        if (!originId || !targetId)
            return null;

        let targetUser = await AuthorizationHelper.userService.get(targetId);
        if (!targetUser || !targetUser.permission ||
            !targetUser.permission.role || targetUser.permission.role.code !== RoleCode.Client ||
            !targetUser.permission.managers.find(managerId => managerId.toString() === originId))
            return null;

        let targetProduct = targetUser.permission && targetUser.permission.product;
        if (!targetProduct || !targetProduct.code)
            return null;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, [targetProduct.code], [RoleCode.Client]);
        if (!products || !products.length)
            return null;
        let invite = await this.invitationRepository.get(targetId);
        return invite && new Invitation(invite);
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

    async getUserInvited(originId: string, productCodes: number[], keyword: string, page?: number, limit?: number): Promise<Invitation[]> {
        if (!originId)
            return [];

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodes, [RoleCode.Client]);
        if (!products || !products.length)
            return [];

        let params: any[] = [{
            $match: {'userId': DataHelper.toObjectId(originId)}
        }, {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userId'
            }
        }, {
            $unwind: '$userId'
        }, {
            $lookup: {
                from: 'files',
                localField: 'userId.avatar',
                foreignField: '_id',
                as: 'userId.avatar'
            }
        }];

        if (keyword)
            params.push({$match: {$or: [{'fullName': {$regex: new RegExp(keyword, 'i')}}, {'email': {$regex: new RegExp(keyword, 'i')}}]}});

        params.push({$match: {'productId': {$in: products.map(product => DataHelper.toObjectId(product._id))}}});

        params.push({
            $lookup: {
                from: 'products',
                localField: 'productId',
                foreignField: '_id',
                as: 'productId'
            }
        }, {
            $project: {
                '_id': 1,
                'fullName': 1,
                'email': 1,
                'sendAt': 1,
                'userId._id': 1,
                'userId.email': 1,
                'userId.fullName': 1,
                'userId.avatar.url': 1,
                'productId._id': 1,
                'productId.name': 1
            }
        }, {
            $unwind: '$productId'
        });

        let pagination = new Pagination(page, limit);
        params.push({$skip: pagination.skip}, {$limit: pagination.limit});

        let result = await this.invitationRepository.aggregate(params);
        return Invitation.parseArray(result);
    }

    async getCountUserInvited(originId: string, productCodes: number[], keyword: string): Promise<number> {
        if (!originId)
            return 0;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodes, [RoleCode.Client]);
        if (!products || !products.length)
            return 0;

        let params: any[] = [{$match: {'userId': DataHelper.toObjectId(originId)}}];

        if (keyword)
            params.push({$match: {$or: [{'fullName': {$regex: new RegExp(keyword, 'i')}}, {'email': {$regex: new RegExp(keyword, 'i')}}]}});

        params.push({$match: {'productId': {$in: products.map(product => DataHelper.toObjectId(product._id))}}});
        params.push({$count: 'count'});

        let result = await this.invitationRepository.aggregate(params);
        if (result && result.length)
            return result[0].count;
        return 0;
    }

    async getConnectedBanks(originId: string, targetId: string): Promise<UserConnectedBank[]> {
        // let role: any = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        // if (!targetId || !role)
        //     return [];
        if (!originId || !targetId)
            throw new ErrorCommon(101, 'Request');
        let {roles} = await Authenticator.filterPermission([module.MANAGER.claim.GET_CLIENT_CONNECTED_BANK.code], originId, [], [RoleCode.Client]);
        if (!roles || !roles.length)
            return [];
        let param = {
            query: <any>{
                '_id': DataHelper.toObjectId(targetId),
                'permission.role': {
                    // $in: [DataHelper.toObjectId(role._id)]
                    $in: roles.map(role => DataHelper.toObjectId(role._id))
                }
            },
            select: 'connectedBanks'
        };
        if (originId)
            param.query['permission.managers'] = {$in: [DataHelper.toObjectId(originId)]};

        let user = await this.userRepository.findOne(param);
        return user && user.connectedBanks ? UserConnectedBank.parseArray(user.connectedBanks) : [];
    }

    // async getTradingQuestion(_id: string, managerId?: string): Promise<UserTradingQuestion | null> {
    //     let role: any = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
    //     if (!_id || !role)
    //         throw new ErrorCommon(1);

    //     let param = {
    //         query: <any>{
    //             '_id': DataHelper.toObjectId(_id),
    //             'permission.role': {
    //                 $in: [DataHelper.toObjectId(role._id)]
    //             }
    //         },
    //         select: 'tradingQuestion'
    //     };
    //     if (managerId)
    //         param.query['permission.managers'] = {$in: [DataHelper.toObjectId(managerId)]};

    //     let user = await this.userRepository.findOne(param);
    //     return user && user.tradingQuestion ? new UserTradingQuestion(user.tradingQuestion) : null;
    // }

    // async getSubContractors(_id: string, managerId?: string): Promise<UserSubContractor[]> {
    //     let role: any = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
    //     if (!_id || !role)
    //         throw new ErrorCommon(1);

    //     let param = {
    //         query: <any>{
    //             '_id': DataHelper.toObjectId(_id),
    //             'permission.role': {
    //                 $in: [DataHelper.toObjectId(role._id)]
    //             }
    //         },
    //         select: 'subContractors'
    //     };
    //     if (managerId)
    //         param.query['permission.managers'] = {$in: [DataHelper.toObjectId(managerId)]};

    //     let user = await this.userRepository.findOne(param);
    //     return user && user.subContractors ? UserSubContractor.parseArray(user.subContractors) : [];
    // }

    async getUserAuthentication(originId: string, productCode: number, roleCode: number): Promise<UserAuthentication | null> {
        if (!originId || !productCode || !roleCode)
            throw new ErrorCommon(101, 'Request');

        let {products, roles} = await Authenticator.filterPermission([module.MANAGER.claim.GET.code], originId, [productCode], [roleCode]);
        if (!products || !products.length || !roles || !roles.length)
            return null;

        let params = {
            query: {
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'permission.role': {$in: roles.map(role => DataHelper.toObjectId(role._id))},
                'permission.managers': DataHelper.toObjectId(originId),
                'deletedAt': null
            },
            populate: [{
                path: 'permission.product',
                select: 'code name type logo config',
            }, {
                path: 'permission.role',
                select: 'code name',
            }, {
                path: 'avatar',
                select: '_id url',
            }]
        };

        let user = await this.userRepository.findOne(params);
        if (!user || !user.permission || !user.permission.product || !user.permission.role || !user.permission.product._id || user.permission.product.code !== productCode)
            return null;

        if (!user.token || user.token.provider !== LoginProvider.Local || !user.token.accessToken || !user.token.tokenExpire || user.token.tokenExpire < new Date())
            user.token = await this.updateUserToken(user._id, new UserToken(<any>{provider: LoginProvider.Local}));

        return user && new UserAuthentication(user);
    }

    private async updateUserToken(_id: string, token: UserToken): Promise<UserToken> {
        token.accessToken = createAccessToken();
        token.tokenExpire = DateHelper.addDays(new Date(), Project.EXPIRE_DAYS);

        await this.userRepository.update(_id, {token});
        this.delete(_id);
        return token;
    }

    async getManagers(originId: string, productCodes?: number[], roleCodes?: number[], keyword?: string, isDeleted?: boolean, page?: number, limit?: number): Promise<ManagerAccount[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let {products, roles} = await Authenticator.filterPermission([module.MANAGER.claim.GET.code], originId, productCodes, roleCodes);
        if (!products || !products.length || !roles || !roles.length)
            return [];

        let param = {
            query: <any>{
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'permission.role': {$in: roles.map(role => DataHelper.toObjectId(role._id))},
                'permission.managers': DataHelper.toObjectId(originId),
                'deletedAt': isDeleted ? {$ne: null} : null
            },
            select: 'fullName email avatar permission createdAt lastAccess',
            populate: [{
                path: 'permission.product',
                select: 'code name'
            }, {
                path: 'permission.role',
                select: 'code name'
            }, {
                path: 'avatar',
                select: 'url'
            }/* , {
                path: 'permission.managers',
                select: 'fullName email'
            }*/]
        };

        if (keyword) {
            let regex = new RegExp(keyword, 'i');
            param.query.$or = [{
                fullName: regex
            }, {
                email: regex
            }];
        }

        let users = await this.userRepository.find(param, undefined, page, limit);
        return ManagerAccount.parseArray(users);
    }

    async getCountManagers(originId: string, productCodes?: number[], roleCodes?: number[], keyword?: string, isDeleted?: boolean): Promise<number> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let {products, roles} = await Authenticator.filterPermission([module.MANAGER.claim.GET.code], originId, productCodes, roleCodes);
        if (!products || !products.length || !roles || !roles.length)
            return 0;

        let param = {
            query: <any>{
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'permission.role': {$in: roles.map(role => DataHelper.toObjectId(role._id))},
                'permission.managers': DataHelper.toObjectId(originId),
                'deletedAt': isDeleted ? {$ne: null} : null
            }
        };

        if (keyword) {
            let regex = new RegExp(keyword, 'i');
            param.query.$or = [{
                fullName: regex
            }, {
                email: regex
            }];
        }
        return await this.userRepository.getCount(param);
    }

    async getManagersAssignment(originId: string, productCodes?: number[], roleCodes?: number[], productCodeAssignments?: number[], keyword?: string, isDeleted?: boolean, page?: number, limit?: number): Promise<ManagerAccount[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let {products, roles} = await Authenticator.filterPermission([module.MANAGER.claim.GET.code], originId, productCodes, roleCodes);
        let result = await Authenticator.filterPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodeAssignments, [RoleCode.Client]);
        if (!products || !products.length || !roles || !roles.length || !result.products || !result.products.length || !result.roles || !result.roles.length)
            return [];

        let param = {
            query: <any>{
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'permission.role': {$in: roles.map(role => DataHelper.toObjectId(role._id))},
                'permission.managers': DataHelper.toObjectId(originId),
                'deletedAt': isDeleted ? {$ne: null} : null
            }
        };
        if (keyword) {
            let regex = new RegExp(keyword, 'i');
            param.query.$or = [{
                fullName: regex
            }, {
                email: regex
            }];
        }
        let managers = await this.userRepository.findAll(param);

        let pagination = new Pagination(page, limit);
        let query = <any[]>[{
            $match: {
                'permission.product': {$in: result.products.map(product => DataHelper.toObjectId(product._id))},
                'permission.role': {$in: result.roles.map(role => DataHelper.toObjectId(role._id))},
                'deletedAt': isDeleted ? {$ne: null} : null
            }
        }, {
            $unwind: '$permission.managers'
        }, {
            $match: {
                'permission.managers': {$in: managers.map(manager => manager._id)}
            }
        }, {
            $group: {
                _id: '$permission.managers'
            }
        }, {
            $project: {
                '_id': 1
            }
        }, {
            $skip: pagination.skip
        }, {
            $limit: pagination.limit
        }, {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'users'
            }
        }, {
            $lookup: {
                from: 'products',
                localField: 'users.permission.product',
                foreignField: '_id',
                as: 'products'
            }
        }, {
            $lookup: {
                from: 'roles',
                localField: 'users.permission.role',
                foreignField: '_id',
                as: 'roles'
            }
        }, {
            $lookup: {
                from: 'files',
                localField: 'users.avatar',
                foreignField: '_id',
                as: 'avatars'
            }
        }];

        let list = await this.userRepository.aggregate(query);
        managers = list.filter(item => item.users && item.users.length).map(manager => {
            let user = manager.users[0];
            user.avatar = manager.avatars && manager.avatars[0];
            user.permission.product = manager.products && manager.products[0];
            user.permission.role = manager.roles && manager.roles[0];
            return user;
        });
        return ManagerAccount.parseArray(managers);
    }

    async getCountManagersAssignment(originId: string, productCodes?: number[], roleCodes?: number[], productCodeAssignments?: number[], keyword?: string, isDeleted?: boolean): Promise<number> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let {products, roles} = await Authenticator.filterPermission([module.MANAGER.claim.GET.code], originId, productCodes, roleCodes);
        let result = await Authenticator.filterPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodeAssignments, [RoleCode.Client]);
        if (!products || !products.length || !roles || !roles.length || !result.products || !result.products.length || !result.roles || !result.roles.length)
            return 0;

        let param = {
            query: <any>{
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'permission.role': {$in: roles.map(role => DataHelper.toObjectId(role._id))},
                'permission.managers': DataHelper.toObjectId(originId),
                'deletedAt': isDeleted ? {$ne: null} : null
            }
        };
        if (keyword) {
            let regex = new RegExp(keyword, 'i');
            param.query.$or = [{
                fullName: regex
            }, {
                email: regex
            }];
        }
        let managers = await this.userRepository.findAll(param);

        let query = <any[]>[{
            $match: {
                'permission.product': {$in: result.products.map(product => DataHelper.toObjectId(product._id))},
                'permission.role': {$in: result.roles.map(role => DataHelper.toObjectId(role._id))},
                'deletedAt': isDeleted ? {$ne: null} : null
            }
        }, {
            $unwind: '$permission.managers'
        }, {
            $match: {
                'permission.managers': {$in: managers.map(manager => manager._id)}
            }
        }, {
            $group: {
                _id: '$permission.managers'
            }
        }];
        let list = await this.userRepository.aggregate(query);
        return list.length;
    }

    async getManagersForAssign(originId: string, targetId: string, productCode: number, roleCodes?: number[], keyword?: string, page?: number, limit?: number): Promise<ManagerAccount[]> {
        if (!originId || !targetId || !productCode)
            throw new ErrorCommon(101, 'Request');

        let roleClient = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        if (!roleClient)
            return [];

        let {products, roles} = await Authenticator.filterPermission([module.MANAGER.claim.GET.code], originId, [productCode], roleCodes);
        if (!products || !products.length || !roles || !roles.length)
            return [];

        let target: any = await AuthorizationHelper.userService.get(targetId);
        if (!target || !target.permission.managers.find(managerId => managerId === originId))
            return [];

        let managerIds = target.permission.managers.filter(managerId => managerId !== originId);

        let param = {
            query: <any>{
                '_id': {$nin: managerIds.map(managerId => DataHelper.toObjectId(managerId))},
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                '$and': [{
                    'permission.role': {$in: roles.map(role => DataHelper.toObjectId(role._id))}
                }, {
                    'permission.role': {$ne: DataHelper.toObjectId(roleClient._id)}
                }],
                'permission.managers': DataHelper.toObjectId(originId),
            },
            select: 'fullName email avatar permission.role createdAt',
            populate: [{
                path: 'permission.role',
                select: 'code name'
            }, {
                path: 'avatar',
                select: 'url'
            }]
        };

        if (keyword) {
            let regex = new RegExp(keyword, 'i');
            param.query.$or = [{
                fullName: regex
            }, {
                email: regex
            }];
        }

        let users = await this.userRepository.find(param, null, page, limit);
        return ManagerAccount.parseArray(users);
    }

    async getCountManagersForAssign(originId: string, productCode: number, roleCodes?: number[], keyword?: string): Promise<number> {
        if (!originId || !productCode)
            throw new ErrorCommon(101, 'Request');

        let {products, roles} = await Authenticator.filterPermission([module.MANAGER.claim.GET_MANAGER_FOR_ASSIGN.code], originId, [productCode], roleCodes);
        if (!products || !products.length || !roles || !roles.length)
            return 0;

        let param = {
            query: <any>{
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'permission.role': {$in: roles.map(role => DataHelper.toObjectId(role._id))},
            }
        };

        if (keyword) {
            let regex = new RegExp(keyword, 'i');
            param.query.$or = [{
                fullName: regex
            }, {
                email: regex
            }];
        }

        return await this.userRepository.getCount(param);
    }

    async getClients(originId: string, productCodes?: number[], roleCodes?: number[], keyword?: string, isDeleted?: boolean, page?: number, limit?: number): Promise<ClientAccount[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let clientRole = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        if (!clientRole)
            return [];

        // let {products, roles} = await Authenticator.filterPermission([module.MANAGER.claim.GET_CLIENT.code], originId, [], [clientRole.code]);
        // if (!products || !products.length || !roles || !roles.length)
        //     return [];
        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodes);
        if (!products || !products.length)
            return [];

        let param = {
            query: <any>{
                'permission.role': DataHelper.toObjectId(clientRole._id),
                'permission.managers': DataHelper.toObjectId(originId),
                'deletedAt': isDeleted ? {$ne: null} : null,
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))}
            },
            select: 'fullName email avatar businessInfo permission createdAt lastAccess',
            populate: [{
                path: 'permission.product',
                select: 'code name'
            }, {
                path: 'avatar',
                select: 'url'
            }, {
                path: 'permission.role',
                select: 'code name'
            }]
        };

        // if (productCodes && productCodes.length) {
        //     // let productsPermission = await BusinessLoader.productBusiness.getByCodes(productCodes);
        //     param.query['permission.product'] = {$in: products.map(product => DataHelper.toObjectId(product._id))};
        // }

        if (keyword) {
            let regex = new RegExp(keyword, 'i');
            param.query.$or = [{
                fullName: regex
            }, {
                email: regex
            }, {
                'businessInfo.abnCode': regex
            }, {
                'businessInfo.entityName': regex
            }];
        }

        let clients = await this.userRepository.find(param, {createdAt: -1}, page, limit);
        return ClientAccount.parseArray(clients);
    }

    async getCountClients(originId: string, productCodes?: number[], roleCodes?: number[], keyword?: string, isDeleted?: boolean): Promise<number> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let clientRole = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        if (!clientRole)
            return 0;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodes);
        if (!products || !products.length)
            return 0;

        // let {products, roles} = await Authenticator.filterPermission([module.MANAGER.claim.GET_CLIENT.code], originId, [], [clientRole.code]);
        // if (!products || !products.length || !roles || !roles.length)
        //     return 0;

        let param = {
            query: <any>{
                'permission.role': DataHelper.toObjectId(clientRole._id),
                'permission.managers': DataHelper.toObjectId(originId),
                'deletedAt': isDeleted ? {$ne: null} : null,
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))}
            },
        };
        // param.query['permission.product'] = {$in: products.map(product => DataHelper.toObjectId(product._id))};
        if (keyword) {
            let regex = new RegExp(keyword, 'i');
            param.query.$or = [{
                fullName: regex
            }, {
                email: regex
            }, {
                'businessInfo.abnCode': regex
            }, {
                'businessInfo.entityName': regex
            }];
        }
        let tests = await this.userRepository.getCount(param);
        return tests;
    }

    async getClientsByManager(originId: string, managerId: string, productCodes?: number[], keyword?: string, isDeleted?: boolean, page?: number, limit?: number): Promise<ClientAccount[]> {
        if (!originId || !managerId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodes);
        if (!products || !products.length)
            return [];
        let clientRole = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        if (!clientRole)
            return [];

        let manager = await AuthorizationHelper.userService.get(managerId);
        if (!manager)
            return [];

        let managerRole = manager.permission && manager.permission.role;
        if (!managerRole)
            return [];

        // let {products, roles} = await Authenticator.filterPermission([module.MANAGER.claim.GET_CLIENT_BY_MANAGER.code], originId, productCodes, [managerRole.code]);
        // if (!products || !products.length || !roles || !roles.length)
        //     return [];
        // create client with permission

        let param = {
            query: <any>{
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'permission.role': DataHelper.toObjectId(clientRole._id),
                'permission.managers': DataHelper.toObjectId(managerId),
                'deletedAt': isDeleted ? {$ne: null} : null
            },
            select: 'fullName email avatar businessInfo permission createdAt lastAccess',
            populate: [{
                path: 'permission.product',
                select: 'code name'
            }, {
                path: 'avatar',
                select: 'url'
            }, {
                path: 'permission.role',
                select: 'code name'
            }]
        };

        if (keyword) {
            let regex = new RegExp(keyword, 'i');
            param.query.$or = [{
                fullName: regex
            }, {
                email: regex
            }, {
                'businessInfo.abnCode': regex
            }, {
                'businessInfo.entityName': regex
            }];
        }

        let clients = await this.userRepository.find(param, {createdAt: -1}, page, limit);
        return ClientAccount.parseArray(clients);
    }

    async getCountClientsByManager(originId: string, managerId: string, productCodes?: number[], keyword?: string, isDeleted?: boolean): Promise<number> {
        if (!originId || !managerId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodes);
        if (!products || !products.length)
            return 0;

        let clientRole = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        if (!clientRole)
            return 0;

        let manager = await AuthorizationHelper.userService.get(managerId);
        if (!manager)
            return 0;

        let managerRole = manager.permission && manager.permission.role;
        if (!managerRole)
            return 0;

        // let {products, roles} = await Authenticator.filterPermission([module.MANAGER.claim.GET_CLIENT_BY_MANAGER.code], originId, productCodes, [managerRole.code]);
        // if (!products || !products.length || !roles || !roles.length)
        //     return 0;

        let param = {
            query: <any>{
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'permission.role': DataHelper.toObjectId(clientRole._id),
                'permission.managers': DataHelper.toObjectId(managerId),
                'deletedAt': isDeleted ? {$ne: null} : null
            },
        };

        if (keyword) {
            let regex = new RegExp(keyword, 'i');
            param.query.$or = [{
                fullName: regex
            }, {
                email: regex
            }, {
                'businessInfo.abnCode': regex
            }, {
                'businessInfo.entityName': regex
            }];
        }
        return await this.userRepository.getCount(param);
    }

    async getCountClientsByManagers(originId: string, managerIds: string[], productCode?: number): Promise<{_id: string, count: number}[]> {
        if (!originId || !managerIds || !Array.isArray(managerIds) || !managerIds.length)
            return [];

        let list: {_id: string, count: number}[] = managerIds.map(managerId => ({_id: managerId, count: 0}));
        let clientRole = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        if (!clientRole)
            return list;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCode ? [productCode] : []);
        if (!products || !products.length)
            return list;
        // let {products, roles} = await Authenticator.filterPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCode ? [productCode] : []);
        // if (!products || !products.length || !roles || !roles.length)
        //     return list;

        let query = [{
            $unwind: '$permission.managers'
        }, {
            $match: {
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'permission.role': DataHelper.toObjectId(clientRole._id),
                'permission.managers': {$in: managerIds.map(id => DataHelper.toObjectId(id))},
                'deletedAt': null
            }
        }, {
            $group: {
                _id: '$permission.managers',
                count: {$sum: 1}
            }
        }];
        list = await this.userRepository.aggregate(query);

        return list.map(item => ({
            _id: DataHelper.handleIdDataModel(item._id),
            count: item.count
        }));
    }

    async getClientsLookup(originId: string, productCode: number, keyword: string, page?: number, limit?: number): Promise<ClientLookup[]> {
        if (!originId || !productCode)
            throw new ErrorCommon(101, 'Request');

        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     return [];
        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCode ? [productCode] : [], [RoleCode.Client]);
        if (!products || !products.length)
            return [];

        let role: any = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        let param = {
            query: <any>{
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'permission.role': DataHelper.toObjectId(role._id)
            },
            select: 'fullName email businessInfo'
        };

        if (keyword) {
            let regex = new RegExp(keyword, 'i');
            param.query.$or = [{
                fullName: regex
            }, {
                email: regex
            }, {
                'businessInfo.abnCode': regex
            }, {
                'businessInfo.entityName': regex
            }];
        }

        let result = await this.userRepository.find(param, {fullName: 1}, page, limit);
        return ClientLookup.parseArray(result);
    }

    async getCountClientsLookup(originId: string, productCode: number, keyword?: string): Promise<number> {
        if (!originId || !productCode)
            throw new ErrorCommon(101, 'Request');

        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     return 0;
        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCode ? [productCode] : [], [RoleCode.Client]);
        if (!products || !products.length)
            return 0;

        let role: any = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        let param = {
            query: <any>{
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'permission.role': DataHelper.toObjectId(role._id)
            }
        };

        if (keyword) {
            let regex = new RegExp(keyword, 'i');
            param.query.$or = [{
                fullName: regex
            }, {
                email: regex
            }, {
                'businessInfo.abnCode': regex
            }, {
                'businessInfo.entityName': regex
            }];
        }

        return await this.userRepository.getCount(param);
    }

    async getClientsByProductCoa(originId: string, productCode: number, coaId: string, page?: number, limit?: number, keyword?: string): Promise<ClientInfo[]> {
        // let RoleSuperAdmin: any = await BusinessLoader.roleBusiness.getByCode(RoleCode.SuperAdmin);
        let RoleClient: any = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     return [];
        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCode ? [productCode] : [], [RoleCode.Client]);
        if (!products || !products.length)
            return [];
        // let roleExist = userRoles.find(rol => rol === RoleSuperAdmin._id);
        // if (!roleExist)
        //     throw new ErrorCommon(1);
        let listClientAssigned = await BusinessLoader.chartAccountAssignmentBusiness.getClientAssignedByProduct(originId, productCode, coaId);
        let param = {
            query: <any>{
                '_id': {$nin: listClientAssigned},
                'permission.product': {
                    // $in: [product._id]
                    $in: products.map(product => DataHelper.toObjectId(product._id))
                },
                'permission.role': {
                    $in: [DataHelper.toObjectId(RoleClient._id)]
                }
            }
        };

        if (keyword)
            param.query.fullName = {$regex: new RegExp(keyword, 'i')};

        let clients;

        if (!page && !limit)
            clients = await this.userRepository.findAll(param);
        else
            clients = await this.userRepository.find(param, null, page, limit);

        return ClientInfo.parseArray(clients);
    }

    async getCountClientsByProductCoa(originId: string, productCode: number, coaId: string, keyword: string): Promise<number> {
        // let RoleSuperAdmin: any = await BusinessLoader.roleBusiness.getByCode(RoleCode.SuperAdmin);
        let RoleClient: any = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     return 0;
        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCode ? [productCode] : [], [RoleCode.Client]);
        if (!products || !products.length)
            return 0;

        // let roleExist = userRoles.find(rol => rol === RoleSuperAdmin._id);
        // if (!roleExist)
        //     throw new ErrorCommon(1);
        let listClientAssigned = await BusinessLoader.chartAccountAssignmentBusiness.getClientAssignedByProduct(originId, productCode, coaId);

        let param = {
            query: <any>{
                '_id': {$nin: listClientAssigned},
                'permission.product': {
                    // $in: [product._id]
                    $in: products.map(product => DataHelper.toObjectId(product._id))
                },
                'permission.role': {
                    $in: [DataHelper.toObjectId(RoleClient._id)]
                },
            }
        };
        if (keyword)
            param.query.fullName = {$regex: new RegExp(keyword, 'i')};
        return await this.userRepository.getCount(param);
    }

    async getAssignedClientChartAccount(originId: string, productCode: number, coaId: string, page: number, limit: number, keyword: string): Promise<ClientInfo[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCode ? [productCode] : []);
        if (!products || !products.length)
            return [];

        let proCode = products.find(item => item.code === productCode);
        if (!proCode)
            return [];

        let assignedUsers = await BusinessLoader.chartAccountAssignmentBusiness.getUserByProductCoa(originId, proCode.code, coaId);
        let param = {
            query: <any>{}
        };
        let clientIds: string[] = [];
        for (let i = 0; i < assignedUsers.length; i++) {
            clientIds.push(assignedUsers[i].client);
        }
        if (clientIds && clientIds.length > 0) {
            param.query._id = {$in: clientIds};

            if (keyword)
                param.query.fullName = {$regex: new RegExp(keyword, 'i')};

            let result = await this.userRepository.find(param, null, page, limit);
            return ClientInfo.parseArray(result);
        }
        else {
            return [];
        }
    }

    async getCountAssignedClientChartAccount(originId: string, productCode: number, coaId: string, keyword: string): Promise<number> {
        if (!coaId || !productCode)
            throw new ErrorCommon(1);
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCode ? [productCode] : []);
        if (!products || !products.length)
            return 0;

        let proCode = products.find(item => item.code === productCode);
        if (!proCode)
            return 0;
        if (keyword) {
            let result = await BusinessLoader.chartAccountAssignmentBusiness.getUserByProductCoa(originId, proCode.code, coaId);
            let param = {
                query: <any>{
                    $and: [
                        {fullName: {$regex: new RegExp(keyword, 'i')}},
                        {_id: {$in: result}}
                    ]
                }
            };
            let data = await this.userRepository.getCount(param);

            return data;
        }
        else
            return await BusinessLoader.chartAccountAssignmentBusiness.getCountUserByProductCoa(originId, proCode.code, coaId);
    }

    async getAssignedUsers(originId: string): Promise<User[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, [], []);
        if (!products || !products.length)
            return [];

        let param = {
            query: {
                'permission.managers': DataHelper.toObjectId(originId)
            }
        };
        let users = await this.userRepository.findAll(param);
        return User.parseArray(users);
    }

    // async getUserRelative(_id: string, userId: string, roleId: string): Promise<UserAuthentication | null> {
    //     if (!_id || !userId || !roleId)
    //         throw new ErrorCommon(3);
    //     let role = await BusinessLoader.roleBusiness.get(roleId);
    //     if (!role)
    //         throw new ErrorCommon(102, 'Role');
    //     let user: any;
    //     if (role && role.name === 'Manager') {
    //         let param = {
    //             query: <any>{
    //                 '_id': DataHelper.toObjectId(userId),
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
    //                     $in: [DataHelper.toObjectId(userId)]
    //                 }
    //             }
    //         };
    //         let isUserRelatived = await this.userRepository.findOne(param);
    //         if (isUserRelatived) {
    //             let param = {
    //                 query: <any>{
    //                     _id: DataHelper.toObjectId(userId),
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

    async getManagersByUsers(originId: string, clientIds: string[], productCodes?: number[], roleCodes?: number[]): Promise<{_id: string, managers: ManagerAccount[]}[]> {
        if (!originId || !clientIds || !clientIds.length)
            throw new ErrorCommon(101, 'Request');

        let list: {_id: string, managers: ManagerAccount[]}[] = clientIds.map(clientId => ({_id: clientId, managers: <ManagerAccount[]>[]}));
        let {products, roles} = await Authenticator.filterPermission([module.MANAGER.claim.GET.code], originId, productCodes, roleCodes);
        if (!products || !products.length || !roles || !roles.length)
            return list;

        // let roleClient = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        // if (!roleClient)
        //     return list;

        let query: any = [{
            $match: {
                '_id': {$in: clientIds.map(id => DataHelper.toObjectId(id))},
                // 'permission.role': DataHelper.toObjectId(roleClient._id),
            }
        }, {
            $project: {
                '_id': 1,
                'permission.managers': 1
            }
        }, {
            $unwind: '$permission.managers'
        }, {
            $lookup: {
                from: 'users',
                localField: 'permission.managers',
                foreignField: '_id',
                as: 'managers'
            }
        }, {
            $match: {
                'managers.permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'managers.permission.role': {$in: roles.map(role => DataHelper.toObjectId(role._id))}
            }
        }, {
            $lookup: {
                from: 'files',
                localField: 'managers.avatar',
                foreignField: '_id',
                as: 'avatars'
            }
        }, {
            $project: {
                '_id': 1,
                'managers._id': 1,
                'managers.fullName': 1,
                'managers.email': 1,
                'managers.avatar': 1,
                'managers.permission.role': 1,
                'avatars._id': 1,
                'avatars.url': 1
            }
        }];

        let results = await this.userRepository.aggregate(query);

        for (let i = 0; i < list.length; i++) {
            let objs = results.filter(result => result._id.toString() === list[i]._id);

            for (let j = 0; j < objs.length; j++) {
                let obj = objs[j];
                for (let n = 0; n < obj.managers.length; n++) {
                    let manager = new ManagerAccount(obj.managers[n]);
                    if (!list[i].managers.find(m => m._id === manager._id)) {
                        let avatar = obj.avatars.find(avatar => manager.avatar && avatar._id.toString() === manager.avatar.toString());
                        manager.avatar = DataHelper.handleFileDataModel(avatar);
                        manager.permission!.role = roles.find(role => manager.permission! && role._id === manager.permission!.role);
                        list[i].managers.push(manager);
                    }
                }
            }
        }
        return list;
    }

    async getCountManagersByUsers(originId: string, clientIds: string[], productCodes?: number[], roleCodes?: number[]): Promise<{_id: string, count: number}[]> {
        if (!originId || !clientIds || !clientIds.length)
            throw new ErrorCommon(101, 'Request');

        let list: {_id: string, count: number}[] = clientIds.map(clientId => ({_id: clientId, count: 0}));
        let {products, roles} = await Authenticator.filterPermission([module.MANAGER.claim.GET.code], originId, [], roleCodes);
        if (!products || !products.length || !roles || !roles.length)
            return list;

        let roleClient = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        if (!roleClient)
            return list;

        let query: any = [{
            $match: {
                '_id': {$in: clientIds.map(id => DataHelper.toObjectId(id))},
                // 'permission.role': DataHelper.toObjectId(roleClient._id),
            }
        }, {
            $project: {
                '_id': 1,
                'permission.managers': 1
            }
        }, {
            $unwind: '$permission.managers'
        }, {
            $lookup: {
                from: 'users',
                localField: 'permission.managers',
                foreignField: '_id',
                as: 'managers'
            }
        }, {
            $match: {
                'managers.permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'managers.permission.role': {$in: roles.map(role => DataHelper.toObjectId(role._id))}
            }
        }];

        let results = await this.userRepository.aggregate(query);

        for (let i = 0; i < list.length; i++) {
            list[i].count = results.filter(result => result._id.toString() === list[i]._id).length;
        }

        return list;
    }

    async getManagersByRole(roleId: string): Promise<ManagerAccount[]> {
        if (!roleId)
            throw new ErrorCommon(101, 'Request');

        let param = {
            query: <any>{
                'permission.role': DataHelper.toObjectId(roleId)
            },
            select: 'fullName email avatar permission createdAt lastAccess',
            populate: [{
                path: 'permission.product',
                select: 'code name'
            }, {
                path: 'permission.role',
                select: 'code name'
            }, {
                path: 'avatar',
                select: 'url'
            }/* , {
                path: 'permission.managers',
                select: 'fullName email'
            }*/]
        };

        let users = await this.userRepository.findAll(param);
        return ManagerAccount.parseArray(users);
    }

    async create(data: UserCreate): Promise<User> {
        let user;
        if (!data)
            throw new ErrorCommon(101, 'Request');

        let roleRegions = await BusinessLoader.userBusiness.getIdRoleAdmin();

        data.email = data.email.toLowerCase().trim();

        if (await BusinessLoader.userBusiness.validateEmail(data.email, true) && data.password && validatePassword(data.password)) {
            data.password = hashPassword(data.password);

            let roleSuperAdmin = await BusinessLoader.roleBusiness.getByCode(RoleCode.SuperAdmin);
            if (!roleSuperAdmin)
                throw new ErrorCommon(101, 'Request');

            let superAdmin = await this.userRepository.findOne({
                query: {
                    'permission.role': DataHelper.toObjectId(roleSuperAdmin._id)
                }
            });
            if (!superAdmin)
                throw new ErrorCommon(101, 'Request');
            if (!data.permission)
                throw new ErrorCommon(101, 'Request');

            if (!data.permission.managers)
                data.permission.managers = [];

            if (!data.permission.managers.find(id => id === superAdmin!._id.toString()))
                data.permission.managers.push(superAdmin._id);

            for (let i = 0; i < roleRegions.length; i++) {
                data.permission.managers.push(roleRegions[i]);
            }

            user = await this.userRepository.create(data);
        }
        return user;
    }

    async createManager(originId: string, productCode: number, roleCode: RoleCode, data: any): Promise<User | null> {
        if (!originId || !productCode || !roleCode || roleCode === RoleCode.Client || !data)
            return null;
        data = new UserCreate(data);
        let {products, roles} = await Authenticator.filterPermission([module.MANAGER.claim.CREATE.code], originId, [productCode], [roleCode]);
        if (!products || !products.length || !roles || !roles.length)
            return null;
        // data.permission = new UserPermission({
        //     product: products[0]._id,
        //     role: roles[0]._id,
        //     managers: [originId]
        // });

        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     return null;

        // let role = await BusinessLoader.roleBusiness.getByCode(roleCode);
        // if (!role)
        //     return null;

        data.permission = new UserPermission({
            product: products[0]._id,
            role: roles[0]._id,
            managers: [originId]
        });

        let result = await this.create(data);
        if (!result)
            return null;

        // Write history
        LogHelper.historyService.createUserByRole(products[0].name, originId, data.email, module.MANAGER.claim.CREATE.code, roles[0].name, 1);
        return result;
    }

    // async moveClient(originId: string, targetId: string, productId: string): Promise<any> {
    //     if (!originId || !targetId || !productId)
    //         return {status: 400, message: "userId and productId is required"};
    //     const client = await this.userRepository.get(targetId);
    //     const managers = client && client.permission && client.permission.managers ? client.permission.managers : [];
    //     const product = await BusinessLoader.productBusiness.get(productId);

    //     if (!product || managers.length === 0)
    //         return {status: 400, message: "Product or Manager not found"};

    //     let populate = [{
    //         path: 'permission.role',
    //         select: 'level code',
    //     }];

    //     let adminUser = await this.userRepository.get(originId, populate);
    //     if (!adminUser || !adminUser.permission || !adminUser.permission.role || adminUser.permission.role.code !== 1)
    //         return false;

    //     await BusinessLoader.fileBusiness.moveProduction(targetId, product.code);
    //     await BusinessLoader.chartAccountAssignmentBusiness.moveClientInProduction(targetId, product._id).catch(err => {
    //     });
    //     await BusinessLoader.generalJournalBusiness.moveClientInProduct(targetId, product._id);
    //     await this.userRepository.update(targetId, {'permission.product': product._id});
    //     return true;
    // }

    async moveClientMultiBank(originId: string, userId: string, productId: string): Promise<any> {
        if (!userId || !productId)
            throw new ErrorCommon(105, "UserId and ProductId");
        const client = await this.userRepository.get(userId);
        const managers = client && client.permission && client.permission.managers ? client.permission.managers : [];
        const product = await BusinessLoader.productBusiness.get(productId);

        if (!product || managers.length === 0)
            throw new ErrorCommon(112, "Product");

        let populate = [{
            path: 'permission.role',
            select: 'level code',
        }];

        let adminUser = await this.userRepository.get(originId, populate);
        if (!adminUser || !adminUser.permission || !adminUser.permission.role || adminUser.permission.role.code !== 1)
            throw new ErrorCommon(101, "Permission");
        
        // await BusinessLoader.fileBusiness.moveClientAndProductMagicLink(userId, product.code);
        await BusinessLoader.fileBusiness.moveProduction(userId, product.code);
        await BusinessLoader.chartAccountAssignmentBusiness.moveClientInProduction(userId, product._id).catch(err => {
        });
        await BusinessLoader.generalJournalBusiness.moveClientInProduct(userId, product._id);
        await this.userRepository.update(userId, {'permission.product': product._id});
        return true;
    }

    async createClient(originId: string, productCode: ProductCode, data: any): Promise<User | null> {
        if (!originId || !productCode || !data)
            return null;
        data = new UserCreate(data);

        // create client with permission
        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.CREATE_CLIENT.code], originId, [productCode]);
        if (!products || !products.length)
            return null;
        let isCreate = await this.checkLimitClient(productCode);
        if (!isCreate)
            return null;
        let role = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        if (!role)
            return null;

        let manager = await BusinessLoader.userBusiness.get(originId);
        if (!manager)
            return null;

        data.permission = new UserPermission({
            product: products[0]._id,
            role: role._id,
            managers: [originId]
        });

        if (manager.permission && manager.permission.managers) {
            manager.permission.managers.forEach(managerId => {
                if (!data.permission.managers.includes(managerId))
                    data.permission.managers.push(managerId);
            });
        }

        let managementProduct = await BusinessLoader.productBusiness.getByCode(ProductCode.Management);

        if (!managementProduct)
            throw new ErrorCommon(101, 'Product management system');

        let result = await this.create(data);
        if (result) {
            // Write history
            LogHelper.historyService.createUserByRole(products[0].name, originId, data.email, module.MANAGER.claim.CREATE_CLIENT.code, role.name, 1);
            // LogHelper.historyService.create({userId: originId, target: {email: data.email}, claim: module.MANAGER.claim.CREATE_CLIENT.code, description: `Create client <a href="/client-management" target="_blank">${data.email}</a>`, status: 1});

            // Wirte notification
            LogHelper.notificationService.createUserByRole(products[0].name, originId, data.permission!.managers, data.email, role.name);

            // LogHelper.notificationService.createMultipleToReceiverIds({title: 'Create client', message: `Create client <a href="/client-management/invited-client" target="_blank">${data.email}</a>`, receiverIds: data.permission!.managers});
        }
        else {
            // Write history
            LogHelper.historyService.create({userId: originId, target: {email: data.email}, claim: module.MANAGER.claim.CREATE_CLIENT.code, description: `Create client <a href="/client-management" target="_blank">${data.email}</a>`, status: 2});
        }
        return result;
    }

    async getStatusInvited(inviteIds: string[]): Promise<any[]> {
        let validTime = new Date();
        let result: any[] = [];
        let i = 0;
        do {
            let params = {
                query: <any> {
                    '_id': DataHelper.toObjectId(inviteIds[i]),
                    'token.tokenExpire': {$gte: validTime}
                }
            };
            let invite = await this.invitationRepository.findOne(params);
            if (invite)
                result.push({_id: inviteIds[i], status: true});
            else
                result.push({_id: inviteIds[i], status: false});
            i++;
        } while (i < inviteIds.length);
        return result;
    }

    async verifyInvitation(token: string): Promise<Invitation | null> {
        if (!token)
            return null;

        let validTime = new Date();
        let params = {
            query: {
                'token.accessToken': token,
                'token.tokenExpire': {$gte: validTime}
            }
        };

        let result = await this.invitationRepository.findOne(params);
        return result;
    }

    async expireInvitation(originId: string): Promise<boolean> {
        let validTime = new Date();
        let params = {
            query: {
                'token.tokenExpire': {$lt: validTime}
            }
        };
        let invites = await this.invitationRepository.findAll(params);
        if (!invites || !invites.length)
            return false;

        for (let i = 0; i < invites.length; i++) {
            this.deleteInvitation(originId, invites[i]._id);
        }
        return true;
    }

    async inviteClient(originId: string, productCode: number, fromEmail: string, fromName: string, toEmail: string, toFirstName: string, toLastName: string): Promise<boolean> {
        if (!productCode || !fromEmail || !fromName || !toEmail || !toFirstName || !toLastName)
            throw new ErrorCommon(101, 'Request');

        let fullName = toFirstName + ' ' + toLastName;
        // get products permission.
        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.INVITE_CLIENT.code], originId, [productCode], [RoleCode.Client]);
        if (!products || !products.length)
            return false;
        let isCreate = await this.checkLimitClient(productCode);
        if (!isCreate)
            return false;
        toEmail = toEmail.trim().toLowerCase();
        await BusinessLoader.userBusiness.validateEmail(toEmail, true);

        let body: any = {
            email: toEmail,
            fullName: fullName,
            firstName: toFirstName,
            lastName: toLastName,
            userId: originId,
            productId: products[0]._id,
            token: {},
        };

        let params = {
            query: {
                email: toEmail
            }
        };

        let invite: any;
        invite = await this.invitationRepository.findOne(params);
        if (invite) {
            if (invite.userId.toString() === originId.toString()) {
                body.sendAt = new Date();
                body.token.accessToken = invite.token.accessToken;
            }
            else
                throw new ErrorCommon(104, 'Email');
        }
        else
            body.token.accessToken = createAccessToken();

        body.token.tokenExpire = DateHelper.addMonths(new Date(), 1);

        if (!body.token || !body.token.accessToken || !body.token.tokenExpire)
            throw new ErrorCommon(101, 'User invite');

        let data = {
            title: 'Welcome',
            productName: products[0].name,
            toName: fullName,
            directionLink: `${Project.SERVER.WHITE_LABEL.PROTOTYPE}://${products[0].config.domain}/register?token=${body.token.accessToken}`,
            content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using.',
            note: '',
            fromEmail,
            fromName
        };

        // to do check real-email
        let toData = {};
        toData[toEmail] = fullName;
        let content = await MailHelper.loadMailTemplate('./src/resources/templates/mail/invite-client.html', data);
        let result;
        try {
            result = await MailHelper.sendMailAdvanced(null, toData, 'Join our system', content);
        }
        catch (e) {
            // Write history
            LogHelper.historyService.create({userId: originId, target: {email: toEmail}, claim: module.MANAGER.claim.INVITE_CLIENT.code, description: `<a href="/client-management/invited-client" target="_blank">Invite</a> client fail`, status: 2});
        }

        if (result) {
            let user = await AuthorizationHelper.userService.get(originId);
            if (!user || !user.permission)
                throw new ErrorCommon(101, 'Request');

            let paramsManager = {
                query: {
                    '_id': {$in: user.permission.managers.map(manager => DataHelper.toObjectId(manager))},
                    'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))}
                }
            };
            let managers = await this.userRepository.findAll(paramsManager);
            let managerIds: any = [];
            managers.forEach(manager => {
                managerIds.push(manager._id);
            });

            if (invite) {
                result = await this.updateInvitation(invite._id, new InvitationUpdate(body));
                await this.updateInvitationToken(invite._id, new InvitationToken(body.token));
                // Write history
                LogHelper.historyService.create({userId: originId, target: {email: toEmail}, claim: module.MANAGER.claim.INVITE_CLIENT.code, description: `You resend invite client <a href="/client-management/invited-client" target="_blank">${toEmail}</a>`, status: 1});

                // Wirte notification
                LogHelper.notificationService.invite(products[0].name, originId, managerIds, toEmail);
                // LogHelper.notificationService.createMultipleToReceiverIds({title: 'Re-invite client', message: `Re-invite client <a href="/client-management/invited-client" target="_blank">${toEmail}</a>`, receiverIds: managerIds});
            }
            else {
                result = await this.createInvitation(new InvitationCreate(body));

                // Write history
                LogHelper.historyService.create({userId: originId, target: {email: toEmail}, claim: module.MANAGER.claim.INVITE_CLIENT.code, action: 'inviteClient', description: `You invite client <a href="/client-management/invited-client" target="_blank">${toEmail}</a>`, status: 1});

                // Wirte notification
                LogHelper.notificationService.invite(products[0].name, originId, managerIds, toEmail);
                // LogHelper.notificationService.createMultipleToReceiverIds({title: 'Invite client', message: `Invite client <a href="/client-management/invited-client" target="_blank">${toEmail}</a>`, receiverIds: managerIds});
            }
        }
        return result;
    }

    async sendEmail(originId: string, data: any): Promise<boolean> {
        if (!data.firstName || !data.lastName || !data.pdf || !data.email)
            throw new ErrorCommon(101, 'Request');
        let manager = await AuthorizationHelper.userService.get(originId);
        if (!manager)
            throw new ErrorCommon(101, 'Manager');

        // let fromData = {
        //     email: manager.email,
        //     name: manager.fullName
        // };
        let fullName = data.firstName + ' ' + data.lastName;
        let toEmail = data.email.trim().toLowerCase();
        let toData = {};
        toData[toEmail] = fullName;

        let content = `<p>Hi ${fullName},</p>`
                    + ` My name is: ${manager.fullName}, here is the <a href="${data.pdf}"> link </a> to the data report as promised.<br>`
                    + `Thank you and warm regards,<br/>`
                    + `<p>${manager.fullName}</p><br/>`;
        let result;
        try {
            result = await MailHelper.sendMailAdvanced(null, toData, 'Cruncher Report', content);
        }
        catch (e) {
            throw new ErrorCommon(101, 'Request');
        }
        return result;
    }

    async reInvitation(inviteId: string): Promise<boolean> {
        if (!inviteId)
            throw new ErrorCommon(101, 'Request');

        let params: any = {
            query: {
                _id: DataHelper.toObjectId(inviteId)
            },
            populate: [{
                path: 'userId', select: 'email fullName'
            }, {
                path: 'productId', select: 'code'
            }]
        };
        let invite = await this.invitationRepository.findOne(params);
        if (!invite)
            throw new ErrorCommon(101, 'Request');

        return await this.inviteClient(invite.userId._id, invite.productId.code, invite.userId.email, invite.userId.fullName, invite.email, invite.firstName, invite.lastName);
    }

    async createInvitation(data: InvitationCreate): Promise<Invitation> {
        let invite;
        if (!data)
            throw new ErrorCommon(101, 'Request');

        data.email = data.email.toLowerCase().trim();

        if (await BusinessLoader.userBusiness.validateEmail(data.email, true))
            invite = await this.invitationRepository.create(data);

        return invite;
    }

    async createMultipleInvitation(data: InvitationCreate[]): Promise<Invitation[]> {
        if (!data || !data.length)
            throw new ErrorCommon(101, 'Request');

        let invites = await this.invitationRepository.createMultiple(data);
        return Invitation.parseArray(invites);
    }

    async copyConnectBank(fromId:string, toId:string, copyType: number):Promise<boolean> {
        const fromUser = await this.userRepository.get(fromId);
        const toUser = await this.userRepository.get(toId);
        if (!fromUser || !fromUser.yodleeAccount || !toUser)
            return false;
        
        const yodleeAccount = fromUser.yodleeAccount;
        let connectBankToUser = await this._connectBankReponsitory.find({query:{userId:toId}});
        if(connectBankToUser.length)
            return false;
        let connectBankFromUser = await this._connectBankReponsitory.find({query:{userId:fromId}});
        if(!connectBankFromUser.length)
            return false;
        // const userToConnectBanks = toUser.connectedBanks;
        const connectBanksCoppy = fromUser.connectedBanks;
        const connectBanksUpdate:any[] = [];
        connectBankFromUser.forEach(connectBank => {
            const isCoppy = copyType === 3 || (copyType === 1 && connectBank.type === BankType.Bank) || (copyType === 2 && connectBank.type === BankType.CreditCard) ? true : false;
            if (isCoppy) {
                
                delete connectBank._id;
                delete connectBank.userId;
                connectBanksUpdate.push({
                   
                    userId:toId,...connectBank 
                });
            }
        });
        // userToConnectBanks.forEach(connectBank => {
        //     if (connectBank.connectedId && connectBank.connectedName)
        //         throw new ErrorCommon(101, 'toId');
        // });
        // console.log(connectBankFromUser);
        if(!connectBanksUpdate.length)
            return false;
        this._connectBankReponsitory.createMultiple(connectBanksUpdate).then(res=>{
            console.log(res)
        }).catch(err=>console.error(err))
        // console.log(connectBanksUpdate)
        return await this.userRepository.update(toId, {yodleeAccount});
    }

    async updatePassword(originId: string, targetId: string, data: any): Promise<boolean> {
        if (!originId || !targetId)
            throw new ErrorCommon(101, 'Request');
        if (!data.oldPassword || !data.newPassword)
            throw new ErrorCommon(3);

        let targetUser = await AuthorizationHelper.userService.get(targetId);
        if (!targetUser)
            return false;

        let targetProduct = targetUser.permission && targetUser.permission.product;
        if (!targetProduct || !targetProduct.code)
            return false;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.UPDATE.code], originId, [], []);
        if (!products || !products.length)
            return false;

        let productId = targetUser.permission && targetUser.permission.product && targetUser.permission.product._id;
        if (!products.find(product => product._id === productId))
            return false;

        let params = {
            query: <any>{
                _id: DataHelper.toObjectId(targetId),
                password: hashPassword(data.oldPassword)
            }
        };
        let user = await this.userRepository.findOne(params);
        if (!user)
            throw new ErrorCommon(108, 'Password');
        return await this.userRepository.update(targetId, <any>{password: hashPassword(data.newPassword)});
    }

    async updatePasswordNotCheck(originId: string, targetId: string, newPassword: string): Promise<any> {
        if (!originId || !targetId)
            throw new ErrorCommon(101, 'Request');
        if (!newPassword)
            throw new ErrorCommon(3);

        let targetUser = await this.userRepository.get(targetId);
        if (!targetUser)
            return false;

        let populate = [{
            path: 'permission.role',
            select: 'level code',
        }];

        let adminUser = await this.userRepository.get(originId, populate);
        if (!adminUser || !adminUser.permission || !adminUser.permission.role || adminUser.permission.role.code !== 1)
            return false;
        let params = {
            query: <any>{
                _id: DataHelper.toObjectId(targetId)
            }
        };
        let user = await this.userRepository.findOne(params);
        if (!user)
            throw new ErrorCommon(108, 'Password');
        return await this.userRepository.update(targetId, <any>{password: hashPassword(newPassword)});
    }

    async updateInvitation(_id: string, data: InvitationUpdate): Promise<Invitation | null> {
        let result = await this.invitationRepository.update(_id, data);
        if (result)
            return await this.invitationRepository.get(_id);
            // return await this.getInvitationById(originId, _id);
        return null;
    }

    async updateInvitationToken(inviteId: string, token: InvitationToken): Promise<InvitationToken | null> {
        let dataUpdate: any = {token};
        let result = await this.invitationRepository.update(inviteId, dataUpdate);
        if (result)
            return token;
        else
            return null;
    }

    async update(_id: string, data: UserUpdate): Promise<UserProfile | null> {
        let result = await this.userRepository.update(_id, data);
        if (result) {
            Authenticator.removeAuthenticator(_id);
            let user = await this.get(_id);
            return user && new UserProfile(<any>user);
        }
        return null;
    }

    async updateUser(originId: string, targetId: string, data: UserUpdate): Promise<UserProfile | null> {
        if (!originId || !targetId)
            return null;
        let targetUser = await AuthorizationHelper.userService.get(targetId);
        if (!targetUser || !targetUser.permission ||
            !targetUser.permission.role ||
            !targetUser.permission.role || targetUser.permission.role.code !== RoleCode.Client ||
            !targetUser.permission.managers.find(managerId => managerId.toString() === originId))
            return null;

        let targetProduct = targetUser.permission && targetUser.permission.product;
        if (!targetProduct || !targetProduct.code)
            return null;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.UPDATE_CLIENT.code], originId, [targetProduct.code], [RoleCode.Client]);
        if (!products || !products.length)
            return null;
        let result = await this.userRepository.update(targetId, data);
        if (result) {
            Authenticator.removeAuthenticator(targetId);

            // write history log
            LogHelper.historyService.create({userId: originId, target: {id: targetUser._id, email: targetUser.email}, claim: module.MANAGER.claim.UPDATE_CLIENT.code, description: `You update info client ${targetUser.email}`, status: 1});

            return await this.getUserProfile(originId, targetId);
        }
        return null;
    }

    // async updateStatus(_id: string, status: number): Promise<string | null> {
    //     let result = await this.userRepository.update(_id, <any>{status});
    //     if (result)
    //         Authenticator.removeAuthenticator(_id);
    //     return result ? _id : null;
    // }

    async uploadAvatar(originId: string, productCode: number, data: FileCreate): Promise<string | null> {
        if (!originId)
            return null;
        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.CREATE.code], originId, [productCode], []);
        if (!products || !products.length)
            return null;

        let user = await this.userRepository.get(data.userId);
        if (!user)
            throw new ErrorCommon(101, 'Request');

        let prefix = GoogleStorageHelper.getProfilePrefix(data.userId, products[0].code);
        data.prefix = prefix;
        data.productCode = products[0].code;

        let file = await BusinessLoader.fileBusiness.create(data);

        let result = await this.userRepository.update(file.userId, <any>{avatar: file._id});

        if (result) {
            Authenticator.removeAuthenticator(file.userId);
            return file.url ? file.url : null;
        }
        return null;
    }

    async uploadBusinessLogo(originId: string, productCode: number, data: FileCreate): Promise<string | null> {
        if (!originId)
            return null;
        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.CREATE.code], originId, [productCode], []);
        if (!products || !products.length)
            return null;
        let user = await this.userRepository.get(data.userId);
        if (!user)
            throw new ErrorCommon(101, 'Request');

        let prefix = GoogleStorageHelper.getProfilePrefix(data.userId, products[0].code);
        data.prefix = prefix;
        data.productCode = products[0].code;

        let file = await BusinessLoader.fileBusiness.create(data);

        let result = await this.userRepository.update(file.userId, <any>{'businessInfo.avatar': file._id});

        if (result)
            return file.url ? file.url : null;
        return null;
    }

    async assignProduct(originId: string, targetId: string, productCode: number): Promise<boolean> {
        if (!originId || !targetId || !productCode)
            throw new ErrorCommon(101, 'Request');

        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     return false;
        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.ASSIGN_MANAGER.code], originId, productCode ? [productCode] : [], []);
        if (!products || !products.length)
            return false;
        let user = await BusinessLoader.userBusiness.get(targetId);
        if (!user)
            throw new ErrorCommon(101, 'Request');

        // TODO: check permission for assign product

        let productId = user && user.permission && user.permission.product ? user.permission.product : null;
        // if (productId === product._id)
        products.forEach((item) => {
            if (item._id === productId)
                return true;
        });
        Authenticator.removeAuthenticator(targetId);
        let data: any = {
            'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))}
        };
        return await this.userRepository.update(targetId, data);
    }

    async assignManagers(originId: string, targetId: string, managerIds: string[]): Promise<boolean> {
        if (!originId)
            return false;

        let targetUser = await AuthorizationHelper.userService.get(targetId);
        if (!targetUser || !targetUser.permission ||
        !targetUser.permission.managers.find(managerId => managerId.toString() === originId))
            return false;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.ASSIGN_MANAGER.code], originId, [], []);
        if (!products || !products.length)
            return false;

        let user = await this.userRepository.get(targetId);
        if (!user)
            return false;

        let managers = user.permission ? user.permission.managers : [];

        let managersDiff = _.differenceWith(managerIds, managers, (value1, value2) => {
            return value1.toString() === value2.toString();
        });

        let managetUpdate = managers.concat(managersDiff);

        let result = await this.userRepository.update(targetId, <any>{'permission.managers': managetUpdate.map(item => {
            return DataHelper.toObjectId(item);
        })});

        let productTarget = await BusinessLoader.productBusiness.get(targetUser.permission.product);

        // Write history
        // LogHelper.historyService.create({userId: originId, target: {id: user._id, email: user.email}, claim: module.MANAGER.claim.ASSIGN_MANAGER.code, description: `Assign manager <a href="/team-management" target="_blank">${user.email}</a>`, status: 1});
        LogHelper.historyService.assign(productTarget!.name, originId, managerIds[0], targetId, module.MANAGER.claim.ASSIGN_MANAGER.code, 1, 'assign');

        // Wirte notification
        LogHelper.notificationService.assign(productTarget!.name, originId, managerIds[0], targetId, 'assign');

        if (result)
            Authenticator.removeAuthenticator(targetId);
        return result;
    }

    async unAssignManagers(originId: string, targetId: string, managerIds: string[]): Promise<boolean> {
        if (!originId)
            return false;

        let targetUser = await AuthorizationHelper.userService.get(targetId);
        if (!targetUser || !targetUser.permission ||
        !targetUser.permission.managers.find(managerId => managerId.toString() === originId))
            return false;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.ASSIGN_MANAGER.code], originId, [], []);
        if (!products || !products.length)
            return false;

        let user = await this.userRepository.get(targetId);
        if (!user)
            return false;

        let managers = user.permission ? user.permission.managers : [];
        let managersUpdate = _.differenceWith(managers, managerIds, (value1, value2) => {
            return value1.toString() === value2.toString();
        });
        let result = await this.userRepository.update(targetId, <any>{
            'permission.managers': managersUpdate.map(managerId => DataHelper.toObjectId(managerId))
        });

        if (result)
            Authenticator.removeAuthenticator(targetId);

        let productTarget = await BusinessLoader.productBusiness.get(targetUser.permission.product);

        // Write History Log
        LogHelper.historyService.assign(productTarget!.name, originId, managerIds[0], targetId, module.MANAGER.claim.ASSIGN_MANAGER.code, 1, 'unassign');
        // LogHelper.historyService.create({userId: originId, target: {id: user._id, email: user.email}, claim: module.MANAGER.claim.ASSIGN_MANAGER.code, description: `Assign manager <a href="/team-management" target="_blank">${user.email}</a>`, status: 1});

        // Write notification
        LogHelper.notificationService.assign(productTarget!.name, originId, managerIds[0], targetId, 'unassign');

        return result;
    }

    async reconnectBank(originId: string, clientId: string, productCode: number, accountType: BankType): Promise<boolean> {
        if (!BankType[accountType])
            return false;
        if (!originId || !clientId || !productCode)
            return false;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.UPDATE_CLIENT_RECONNECT_BANK.code], originId, [productCode], []);
        if (!products || !products.length)
            return false;

        let client = await this.userRepository.get(clientId);
        if (!client || !client.permission)
            return false;

        let manager = client.permission.managers.find(managerId => managerId.toString() === originId);
        if (!manager)
            return false;

        let userConectBanks: UserConnectedBank[] = client.connectedBanks;
        let index = userConectBanks.findIndex(userConnectBank => userConnectBank.type === accountType);

        if (index < 0)
            return false;

        if (!userConectBanks[index].connectedName || !userConectBanks[index].connectedId || !userConectBanks[index].providerId)
            return false;

        let update = {};
        update[`connectedBanks.${index}.isReconnectBank`] = true;
        return await this.userRepository.update(clientId, update);
    }

    async reconnectBankUserOld(originId: string, clientId: string, productCode: number, providerId: string, bankId: string): Promise<any> {
        if (!originId || !clientId || !productCode || !providerId || !bankId)
            return {code: 400, message: "Please check body"};

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.UPDATE_CLIENT_RECONNECT_BANK.code], originId, [productCode], []);
        if (!products || !products.length)
            return {code: 400, message: "Can't found product!"};

        let client = await this.userRepository.get(clientId);
        if (!client || !client.permission)
            return {code: 400, message: "Can't found User!"};

        let manager = client.permission.managers.find(managerId => managerId.toString() === originId);
        if (!manager)
            return {code: 400, message: "You are not manager of this client, please check authorization code!"};

        let userConectBanks: UserConnectedBank[] = client.connectedBanks;
        let index = userConectBanks.findIndex(userConnectBank => Number(userConnectBank.providerId) === Number(providerId));

        if (index < 0)
            return {code: 400, message: "Can't find bank"};

        // if (!userConectBanks[index].connectedName || !userConectBanks[index].connectedId || !userConectBanks[index].providerId)
        //     return {code: 400, message: "Check connectedNam, connectedId failed"};

        let update = {};
        update[`connectedBanks.${index}.isReconnectBank`] = true;
        return await this.userRepository.update(clientId, update);
    }

    async disablePullTransaction(originId: string, clientId: string, accountType: BankType, connectBankId: string): Promise<boolean> {
        if (!BankType[accountType])
            return false;
        if (!originId || !clientId || !connectBankId)
            return false;

        let client = await this.userRepository.get(clientId);
        if (!client || !client.permission)
            return false;

        let manager = client.permission.managers.find(managerId => managerId.toString() === originId);
        if (!manager)
            return false;
        let connectBank = await BusinessLoader.connectBankBusiness.getConnectBank(clientId, connectBankId);
        if (!connectBank || !connectBank.accountId || !connectBank.providerAccountId || !connectBank.providerId || !connectBank.accountName )
            throw new ErrorCommon(101, 'connectBank');
        if (connectBank.type !== accountType)
            throw new ErrorCommon(101, 'connectBank type');
        let updateConnectBank = await BusinessLoader.connectBankBusiness.updateConnectBank(clientId, connectBank._id, {
            providerAccountId: connectBank.providerAccountId,
            providerId: connectBank.providerId,
            disabledPullTransaction: true}
        );

        if (!updateConnectBank)
            return false;
        return true;
        // let userConectBanks: UserConnectedBank[] = client.connectedBanks;
        // let index = userConectBanks.findIndex(userConnectBank => userConnectBank.type === accountType);
        // if (index < 0)
        //     return false;
        // if (!userConectBanks[index].connectedName || !userConectBanks[index].connectedId || !userConectBanks[index].providerId)
        //     return false;
        // let update = {};
        // update[`connectedBanks.${index}.disabledPullTransaction`] = true;
        // return await this.userRepository.update(clientId, update);
    }

    async enablePullTransaction(originId: string, clientId: string, accountType: BankType, connectBankId: string): Promise<boolean> {
        if (!BankType[accountType])
            return false;
        if (!originId || !clientId || !connectBankId)
            return false;

        let client = await this.userRepository.get(clientId);
        if (!client || !client.permission)
            return false;

        let manager = client.permission.managers.find(managerId => managerId.toString() === originId);
        if (!manager)
            return false;
        let connectBank = await BusinessLoader.connectBankBusiness.getConnectBank(clientId, connectBankId);
        if (!connectBank || !connectBank.accountId || !connectBank.providerAccountId || !connectBank.providerId || !connectBank.accountName )
            throw new ErrorCommon(101, 'connectBank');
        if (connectBank.type !== accountType)
            throw new ErrorCommon(101, 'connectBank type');
        let updateConnectBank = await BusinessLoader.connectBankBusiness.updateConnectBank(clientId, connectBank._id, {
            providerAccountId: connectBank.providerAccountId,
            providerId: connectBank.providerId,
            disabledPullTransaction: false}
        );

        if (!updateConnectBank)
            return false;
        return true;
        // let userConectBanks: UserConnectedBank[] = client.connectedBanks;
        // let index = userConectBanks.findIndex(userConnectBank => userConnectBank.type === accountType);
        // if (index < 0)
        //     return false;
        // if (!userConectBanks[index].connectedName || !userConectBanks[index].connectedId || !userConectBanks[index].providerId)
        //     return false;
        // let update = {};
        // update[`connectedBanks.${index}.disabledPullTransaction`] = false;
        // return await this.userRepository.update(clientId, update);
    }

    async updateBusinessType(originId: string, clientId: string, businessType: number):Promise<boolean> {
        if (!originId || !clientId)
            return false;

        let client = await this.userRepository.get(clientId);
        if (!client || !client.permission)
            return false;

        let manager = client.permission.managers.find(managerId => managerId.toString() === originId);
        if (!manager)
            return false;

        return await this.userRepository.update(clientId, <any>{'businessInfo.type': businessType});
    }

    async updatePersonalInfo(originId: string, targetId: string, personalInfo: UserPersonalInfo): Promise<boolean> {
        if (!originId)
            return false;

        let targetUser = await AuthorizationHelper.userService.get(targetId);
        if (!targetUser || !targetUser.permission ||
        !targetUser.permission.managers.find(managerId => managerId.toString() === originId))
            return false;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.UPDATE_CLIENT_PERSONAL_INFO.code], originId, [], [RoleCode.Client]);
        if (!products || !products.length)
            return false;

        let productId = targetUser.permission.product && targetUser.permission.product._id;
        if (!products.find(product => product._id === productId))
            return false;
        if (personalInfo && personalInfo.driverLicense)
            delete personalInfo.driverLicense;
        return await this.userRepository.update(targetId, <any>{personalInfo});
    }

    async restore(originId: string, targetId: string): Promise<boolean> {
        if (!originId)
            return false;

        Authenticator.removeAuthenticator(targetId);
        let result = await this.userRepository.update(targetId, {deletedAt: null});
        if (!result)
            return false;

        let target = await AuthorizationHelper.userService.get(targetId);
        let productTarget = await BusinessLoader.productBusiness.get(target!.permission!.product);

        // Write history log
        LogHelper.historyService.create({userId: originId, target: {id: target!._id, email: target!.email}, claim: module.MANAGER.claim.DELETE.code, description: `You enable account ${target!.email}`, status: 1});

        // Write notification
        LogHelper.notificationService.actionAccount(productTarget!.name, originId, target!.permission!.managers, target!.email, target!.fullName, 'enable');

        return result;
    }

    async deleteInvitation(originId: string, inviteId: string): Promise<boolean> {
        if (!originId)
            return false;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.DELETE_INVITE_CLIENT.code], originId, [], []);
        if (!products || !products.length)
            return false;

        let invite = await this.invitationRepository.findOne({_id: DataHelper.toObjectId(inviteId)});
        if (!invite)
            throw new ErrorCommon(101, 'Request');

        // Write history
        LogHelper.historyService.create({userId: originId, target: {email: invite.email}, claim: module.MANAGER.claim.INVITE_CLIENT.code, description: `You delete invite client ${invite.email} in ${products[0].name} product`, status: 1});
        return await this.invitationRepository.delete(inviteId, true);
    }

    async disableClient(originId: string, clientId: string): Promise<boolean> {
        if (!originId)
            return false;

        let client = await AuthorizationHelper.userService.get(clientId);
        if (!client || !client.permission || !client.permission.managers.find(managerId => managerId.toString() === originId))
            return false;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.DELETE.code], originId, [], []);
        if (!products || !products.length)
            return false;

        Authenticator.removeAuthenticator(clientId);

        let productTarget = await BusinessLoader.productBusiness.get(client.permission.product);

        let result = await this.userRepository.delete(clientId);
        if (!result)
            return false;

        // Write History Log
        LogHelper.historyService.create({userId: originId, target: {id: client._id, email: client.email}, claim: module.MANAGER.claim.DELETE.code, description: `You disable account ${client.email}`, status: 1});
        // Write notification
        LogHelper.notificationService.actionAccount(productTarget!.name, originId, client.permission.managers, client.email, client.fullName, 'disable');
        return result;
    }

    async deleteClient(originId: string, clientId: string): Promise<boolean> {
        if (!originId)
            return false;

        let manager = await AuthorizationHelper.userService.get(originId);
        let roleSuperAdmin = await BusinessLoader.roleBusiness.getByCode(RoleCode.SuperAdmin);
        if (!manager || !manager.permission || !manager.permission.role || !roleSuperAdmin || manager.permission.role._id.toString() !== roleSuperAdmin._id)
            return false;

        await BusinessLoader.chartAccountAssignmentBusiness.deleteAllByUser(originId, clientId);
        await BusinessLoader.crunchBusiness.deleteAllByUser(originId, clientId);
        await BusinessLoader.statementBusiness.deleteAllByUser(originId, clientId);
        await BusinessLoader.fileBusiness.deleteAllByUser(originId, clientId);
        await BusinessLoader.transactionBusiness.deleteAllByUser(originId, clientId);
        await this.userRepository.delete(clientId, true);
        await Authenticator.removeAuthenticator(clientId);
        return true;
    }

    delete(_id: string): any {}

    async yodleeValidateData(userId: string, fullName: any, type: number) {
        let user = await this.userRepository.get(userId);
        if (!user)
            throw new ErrorCommon(105, 'Password');
        if (type === 1)
            await this.userRepository.update(userId, <any>{bacTracking: fullName});
        else
            await this.userRepository.update(userId, <any>{cacheTracking: fullName});
        return true;
    }

    async getCountAllUser(): Promise<number> {
        return await this.userRepository.getCount();
    }

    async getCountNewUser(): Promise<{_id: string; count: number}[]> {
        let dateBegin = new Date(moment().startOf('month').format());
        let dateNow = new Date(moment().format());

        let clientRole = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        if (!clientRole)
            return [];

        let params = [{
            $match: {
                createdAt: {$gte: dateBegin, $lte: dateNow}
            }
        }, {
            $match: {
                'permission.role': DataHelper.toObjectId(clientRole._id),
            }
        }, {
            $group: {
                _id: {userId: '$_id', product: '$permission.product'},
                count: {$sum: 1}
            }
        }, {
            $lookup: {
                from: 'products',
                localField: '_id.product',
                foreignField: '_id',
                as: 'products'
            }
        }, {
            $unwind: '$products'
        }, {
            $project: {'products.name': 1, 'products.code': 1, 'products.createdAt': 1, 'products.logo': 1, 'count': 1}
        }];

        let results = await this.userRepository.aggregate(params);
        return results;
    }

    async getCountAllCancel(): Promise<number> {
        let param = {
            query: {
                'deletedAt': {$ne: null},
            }
        };
        return await this.userRepository.getCount(param);
    }

    async getCountCancel(originId: string, productCode: number): Promise<{productCode: number, total: number}> {
        if (!originId || !productCode)
            return {productCode: productCode, total: 0};

        let dateBegin = new Date(moment().startOf('month').format());
        let dateNow = new Date(moment().format());

        let clientRole = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        if (!clientRole)
            return {productCode: productCode, total: 0};

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, [productCode], [RoleCode.Client]);
        if (!products || !products.length)
            return {productCode: productCode, total: 0};

        let params = {
            query: {
                'createdAt': {$gte: dateBegin, $lte: dateNow},
                'deletedAt': {$ne: null},
                'permission.role': DataHelper.toObjectId(clientRole._id),
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))}
            }
        };

        let result = await this.userRepository.getCount(params);
        return {productCode: productCode, total: result};
    }

    async getCountClientInfo(originId: string): Promise<{product: any, count: number, latestUser: any}[]> {
        let {products, roles} = await Authenticator.filterPermission([module.MANAGER.claim.GET_CLIENT.code], originId, [], [RoleCode.Client]);
        if (!products || !products.length || !roles || !roles.length)
            return [];

        let params = [{
            $match: {
                'permission.product': {$in: products.filter(product => product.type !== ProductType.Management).map(product => DataHelper.toObjectId(product._id))},
                'permission.role': DataHelper.toObjectId(roles[0]._id),
                'deletedAt': null
            }
        }, {
            $sort: {
                'permission.product': 1,
                'createdAt': 1
            }
        }, {
            $group: {
                _id: '$permission.product',
                count: {$sum: 1},
                userId: {$last: '$_id'}
            }
        }, {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'product'
            }
        }, {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'latestUser'
            }
        }, {
            $lookup: {
                from: 'files',
                localField: 'latestUser.avatar',
                foreignField: '_id',
                as: 'avatar'
            }
        }, {
            $project: {
                'product._id': 1,
                'product.name': 1,
                'product.code': 1,
                'count': 1,
                'latestUser._id': 1,
                'latestUser.firstName': 1,
                'latestUser.lastName': 1,
                'latestUser.email': 1,
                'avatar': 1
            }
        }];
        let results = await this.userRepository.aggregate(params);
        results.forEach(item => {
            if (item.product && item.product.length)
                item.product = item.product[0];
            if (item.latestUser && item.latestUser.length)
                item.latestUser = item.latestUser[0];
            if (item.avatar && item.avatar.length)
                item.latestUser.avatar = item.avatar[0].url;
            delete item.avatar;
        });
        return results;
    }

    async getClientsByDate(originId: string, productCodes?: number[], roleCodes?: number[], keyword?: string, isDeleted?: boolean, page?: number, limit?: number): Promise<ClientAccount[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let clientRole = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        if (!clientRole)
            return [];

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodes);
        if (!products || !products.length)
            return [];

        let dateBegin = new Date(moment().startOf('month').format());
        let dateNow = new Date(moment().format());

        let param = {
            query: <any>{
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'permission.role': DataHelper.toObjectId(clientRole._id),
                'permission.managers': DataHelper.toObjectId(originId),
                'deletedAt': isDeleted ? {$ne: null} : null,
                'createdAt': {$gte: dateBegin, $lte: dateNow}
            },
            select: 'fullName email avatar businessInfo permission createdAt lastAccess',
            populate: [{
                path: 'permission.product',
                select: 'code name'
            }, {
                path: 'avatar',
                select: 'url'
            }, {
                path: 'permission.role',
                select: 'code name'
            }]
        };

        if (keyword) {
            let regex = new RegExp(keyword, 'i');
            param.query.$or = [{
                fullName: regex
            }, {
                email: regex
            }, {
                'businessInfo.abnCode': regex
            }, {
                'businessInfo.entityName': regex
            }];
        }

        let clients = await this.userRepository.find(param, {createdAt: -1}, page, limit);
        return ClientAccount.parseArray(clients);
    }

    async getManagersByIds(managers: string[], productId: string): Promise<any> {
        let listManagerIds = <any>[];
        let roleProductAdmin = await BusinessLoader.roleBusiness.getByCode(RoleCode.ProductAdmin);
        let roleProductManager = await BusinessLoader.roleBusiness.getByCode(RoleCode.ProductManager);

        if (!roleProductAdmin || !roleProductManager)
            return listManagerIds;

        let params = {
            query: {
                '_id': {$in: managers.map(manager => manager)},
                'permission.product': DataHelper.toObjectId(productId),
                'permission.role': {$in: [roleProductAdmin._id, roleProductManager._id]},
            }
        };
        let result = await this.userRepository.findAll(params);
        if (result && result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                if (result[i]._id)
                    listManagerIds.push(result[i]._id);
            };
        }
        return listManagerIds;
    }

    async getUserLastAccess(originId: string, isChoice: number, productCode: number): Promise<{_id: string; count: number}[]> {
        let dateBegin; let dateNow;
        let totalCurentInMonth = moment().subtract(7, 'days').daysInMonth();

        if (isChoice === 1) {
            dateBegin = new Date(moment().subtract(7, 'days').format());
            dateNow = new Date(moment().format());
        }
        else {
            dateBegin = new Date(moment().subtract(totalCurentInMonth, 'days').format());
            dateNow = new Date(moment().format());
        }

        let manager = await AuthorizationHelper.userService.get(originId);
        if (!manager)
            throw new ErrorCommon(101, 'Manager');

        let {roles} = await Authenticator.filterPermission([module.ROLE.claim.GET.code], originId, productCode ? [productCode] : [], []);
        if (!roles || !roles.length)
            throw new ErrorCommon(101, 'Roles');

        let params = [{
            $match: {
                'lastAccess': {$gte: dateBegin, $lte: dateNow},
                'permission.managers': DataHelper.toObjectId(manager._id),
                'permission.role': {
                    $in: roles.map(role => DataHelper.toObjectId(role._id))
                }
            }
        }, {
            $project: {lastAccess: {$dateToString: {format: '%Y-%m-%d', date: '$lastAccess'}}, role: '$permission.role'}
        }, {
            $group: {
                _id: {lastAccess: '$lastAccess', role: '$role'},
                count: {$sum: 1}
            }
        }, {
            $lookup: {
                from: 'roles',
                localField: '_id.role',
                foreignField: '_id',
                as: 'roles'
            }
        }, {
            $unwind: '$roles'
        }, {
            $sort: {'roles._id': 1}
        }];
        let results = await this.userRepository.aggregate(params);

        return results;
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

Object.seal(ManagerBusiness);
export default ManagerBusiness;
