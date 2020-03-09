import * as moment from 'moment';
import BusinessLoader from '../../system/BusinessLoader';
import ProductRepository from 'justdone-system-package/dest/app/repository/ProductRepository';
import UserRepository from 'justdone-system-package/dest/app/repository/UserRepository';
import IAnalyticBussiness from './interfaces/IAnalyticBusiness'; // eslint-disable-line
import InvitationRepository from 'justdone-system-package/dest/app/repository/InvitationRepository';
import CrunchRepository from 'justdone-system-package/dest/app/repository/CrunchRepository';
import FileRepository from 'justdone-system-package/dest/app/repository/FileRepository'; // eslint-disable-line
import module from 'justdone-system-package/dest/resources/permission/module';
import {RoleCode, ProductType} from 'justdone-system-package/dest/app/model/common/CommonType'; // eslint-disable-line
import Product from 'justdone-system-package/dest/app/model/product/Product'; // eslint-disable-line
import User from 'justdone-system-package/dest/app/model/user/User'; // eslint-disable-line
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import ClientAccount from 'justdone-system-package/dest/app/model/user/ClientAccount';
import Invitation from 'justdone-system-package/dest/app/model/invitation/Invitation';
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import DateHelper from 'justdone-system-package/dest/helpers/DateHelper';
import Pagination from 'justdone-system-package/dest/app/model/common/Pagination';

class AnalyticBusiness implements IAnalyticBussiness {
    private productRepository: ProductRepository;
    private userRepository: UserRepository;
    private invitationRepository: InvitationRepository;
    private crunchRepository: CrunchRepository;
    private FileRepository: FileRepository;

    constructor() {
        this.productRepository = new ProductRepository();
        this.userRepository = new UserRepository();
        this.invitationRepository = new InvitationRepository();
        this.crunchRepository = new CrunchRepository();
        this.FileRepository = new FileRepository();
    }

    async getAnalyticAccess(): Promise<{_id: string, productName: string, count: number}[]> {
        let result: {_id: string, productName: string, count: number}[] = [];
        let list: any = await this.userRepository.aggregate([{
            $match: {
                $or: [{deletedAt: {$exists: false}}, {deletedAt: null}],
                lastAccess: {
                    $gt: DateHelper.addMinutes(new Date(), -10)
                }
            }
        }, {
            $group: {
                _id: '$permission.product',
                count: {$sum: 1}
            }
        }]);

        let products = await BusinessLoader.productBusiness.getAll();
        products.forEach(product => {
            let item = list.find(item => item._id && item._id.toString() === product._id);
            result.push({_id: item && item._id && item._id.toString(), productName: product.name, count: (item && item.count) || 0});
        });
        return result;
    }

    async getClientNotAssigned(originId: string, productCodes?: number[], page?: number, limit?: number): Promise<ClientAccount[]> {
        if (!originId)
            return [];

        let clientRole = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        let productManagerRole = await BusinessLoader.roleBusiness.getByCode(RoleCode.ProductManager);

        if (!clientRole || !productManagerRole)
            return [];

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodes);
        if (!products || !products.length)
            return [];

        let params: any[] = [{
            $match: {
                '$or': [{deletedAt: {$exists: false}}, {deletedAt: null}],
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'permission.role': DataHelper.toObjectId(clientRole._id),
                'permission.managers': DataHelper.toObjectId(originId)
            }
        }];

        params.push({
            $lookup: {
                from: 'users',
                localField: 'permission.managers',
                foreignField: '_id',
                as: 'managers'
            }
        }, {
            $match: {'managers.permission.role': {$nin: [DataHelper.toObjectId(productManagerRole._id)]}}
        });
        let pagination = new Pagination(page, limit);
        params.push({$skip: pagination.skip}, {$limit: pagination.limit});

        let clients = await this.userRepository.aggregate(params);
        let avatarId: any[] = [];

        clients.map( i => i.avatar ? avatarId.push(DataHelper.toObjectId(i.avatar)) : '' );

        let avatar = {
            query: <any> {
                _id: {
                    $in: avatarId
                },
                productCode: {
                    $in: productCodes
                },
            },
            select: 'url'
        };

        let avatarUrl = await this.FileRepository.findAll(avatar);

        avatarUrl.map(e => {
            clients.map(i => {
                if (i.avatar && i.avatar.toString() === e._id.toString())
                    i.avatar = e.url;
            });
        });
        return ClientAccount.parseArray(clients);
    }

    async getCountClientNotAssigned(originId: string, productCodes?: number[]): Promise<number> {
        if (!originId)
            return 0;

        let clientRole = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        let productManagerRole = await BusinessLoader.roleBusiness.getByCode(RoleCode.ProductManager);

        if (!clientRole || !productManagerRole)
            return 0;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodes);
        if (!products || !products.length)
            return 0;

        let params: any[] = [{
            $match: {
                '$or': [{deletedAt: {$exists: false}}, {deletedAt: null}],
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'permission.role': DataHelper.toObjectId(clientRole._id),
                'permission.managers': DataHelper.toObjectId(originId)
            }
        }];

        params.push({
            $lookup: {
                from: 'users',
                localField: 'permission.managers',
                foreignField: '_id',
                as: 'managers'
            }
        }, {
            $match: {'managers.permission.role': {$nin: [DataHelper.toObjectId(productManagerRole._id)]}}
        });
        params.push({$count: 'count'});

        let result = await this.userRepository.aggregate(params);
        if (result && result.length)
            return result[0].count;

        return 0;
    }

    async getUserInvited(originId: string, productCodes: number[], page?: number, limit?: number): Promise<Invitation[]> {
        if (!originId)
            return [];

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodes);
        if (!products || !products.length)
            return [];

        let params: any[] = [{
            $match: {
                '$or': [{deletedAt: {$exists: false}}, {deletedAt: null}],
                'productId': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'userId': DataHelper.toObjectId(originId)
            }
        }, {
            $lookup: {
                from: 'products',
                localField: 'productId',
                foreignField: '_id',
                as: 'productId'
            }
        }, {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userId'
            }
        }, {
            $lookup: {
                from: 'files',
                localField: 'userId.avatar',
                foreignField: '_id',
                as: 'userId.avatar'
            }
        }, {
            $unwind: '$userId'
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
        }];

        let pagination = new Pagination(page, limit);
        params.push({$skip: pagination.skip}, {$limit: pagination.limit});

        let result = await this.invitationRepository.aggregate(params);
        return Invitation.parseArray(result);
    }

    async getCountUserInvited(originId: string, productCodes: number[]): Promise<number> {
        if (!originId)
            return 0;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodes);
        if (!products || !products.length)
            return 0;

        let params: any[] = [{
            $match: {
                '$or': [{deletedAt: {$exists: false}}, {deletedAt: null}],
                'productId': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'userId': DataHelper.toObjectId(originId)
            }
        }, {
            $count: 'count'
        }];

        let result = await this.invitationRepository.aggregate(params);
        if (result && result.length)
            return result[0].count;
        return 0;
    }

    async getClients(originId: string, productCodes?: number[], roleCodes?: number[], keyword?: string, isDeleted?: boolean, page?: number, limit?: number): Promise<ClientAccount[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        // let clientRole = await DataCachingHelper.roleService.getByCode(RoleCode.ProductAdmin);
        let clientRole = await BusinessLoader.roleBusiness.getByCode(RoleCode.ProductAdmin);
        if (!clientRole)
            return [];

        let {products, roles} = await Authenticator.filterPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodes);

        if (!products || !products.length || !roles || !roles.length)
            return [];

        let param = {
            query: <any>{
                'permission.role': DataHelper.toObjectId(clientRole._id),
                'permission.managers': DataHelper.toObjectId(originId),
                'deletedAt': isDeleted ? {$ne: null} : null
            },
            select: 'fullName email avatar businessInfo permission createdAt',
            populate: [{
                path: 'permission.product',
                select: 'code name'
            }, {
                path: 'avatar',
                select: 'url'
            }]
        };

        if (productCodes && productCodes.length) {
            // let productsPermission = await DataCachingHelper.productService.getByCodes(productCodes);
            let productsPermission = await BusinessLoader.productBusiness.getByCodes(productCodes);
            param.query['permission.product'] = {$in: productsPermission.map(product => DataHelper.toObjectId(product._id))};
        }

        if (keyword) {
            let regex = new RegExp(keyword, 'i');
            param.query.$or = [{
                fullName: regex
            }, {
                email: regex
            }];
        }

        let clients = await this.userRepository.find(param, {createdAt: -1}, page, limit);
        return ClientAccount.parseArray(clients);
    }

    async getCountClients(originId: string, productCodes?: number[], roleCodes?: number[], keyword?: string, isDeleted?: boolean): Promise<number> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        // let clientRole = await DataCachingHelper.roleService.getByCode(RoleCode.Client);
        let clientRole = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        if (!clientRole)
            return 0;

        let {products, roles} = await Authenticator.filterPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodes);

        if (!products || !products.length || !roles || !roles.length)
            return 0;

        let param = {
            query: <any>{
                'permission.role': DataHelper.toObjectId(clientRole._id),
                'permission.managers': DataHelper.toObjectId(originId),
                'deletedAt': isDeleted ? {$ne: null} : null
            },
        };

        if (productCodes && productCodes.length) {
            // let productsPermission = await DataCachingHelper.productService.getByCodes(productCodes);
            let productsPermission = await BusinessLoader.productBusiness.getByCodes(productCodes);
            param.query['permission.product'] = {$in: productsPermission.map(product => DataHelper.toObjectId(product._id))};
        }

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

    async getCrunchClients(originId: string, productCodes?: number[], roleCodes?: number[], keyword?: string, isDeleted?: boolean, page?: number, limit?: number): Promise<ClientAccount[] | null> {
        return null;
    }

    async getSummaryClients(originId: string, productCodes: number[]): Promise<{productCode: number, summary: {totalClients: number, totalInvited: number, totalNotConnect: number}}[]> {
        let clientRole = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);

        let result = [{
            productCode: 0,
            summary: {
                totalClients: 0,
                totalInvited: 0,
                totalNotConnect: 0,
            }
        }];
        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodes);
        if (!products || !products.length)
            return [];

        let paramClient = {
            query: <any>{
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'permission.managers': DataHelper.toObjectId(originId),
                'permission.role': DataHelper.toObjectId(clientRole ? clientRole._id : '')
            },
        };
        //  /*{$in: managerList}*/
        // let paramConnectBank = {
        //     query: <any>{
        //         'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
        //         'permission.managers': DataHelper.toObjectId(originId),
        //         'permission.role': DataHelper.toObjectId(clientRole ? clientRole._id : ''),
        //         'connectedBanks': {
        //             '$not': {
        //                 $elemMatch: {
        //                     type: {
        //                         $exists: true,
        //                         $ne: ''
        //                     },
        //                     providerId: {
        //                         $exists: true,
        //                         $ne: ''
        //                     },
        //                     connectedId: {
        //                         $exists: true,
        //                         $ne: ''
        //                     },
        //                     connectedName: {
        //                         $exists: true,
        //                         $ne: ''
        //                     }
        //                 }
        //             }
        //         }
        //     },
        // };

        // let totalNotConnect = await this.userRepository.getCount(paramConnectBank);
        // let totalClient = await this.userRepository.getCount(clients);
        let totalClient = await this.userRepository.getCount(paramClient);
        let totalInvite = await this.getCountUserInvited(originId, productCodes);

        result.forEach(el => {
            el.productCode = productCodes[0] ? productCodes[0] : 0;
            el.summary.totalClients = totalClient;
            el.summary.totalInvited = totalInvite;
            // el.summary.totalNotConnect = totalNotConnect;
        });
        return result;
    }

    async getSummaryManagers(originId: string, productCodes: number[]): Promise<{productCode: number, summary: {totalManagers: number, totalProductManager: number, totalSupervisor: number}}[]> {
        let result = [{
            productCode: 0,
            summary: {
                totalManagers: 0,
                totalProductManager: 0,
                totalSupervisor: 0,
            }
        }];
        let paramProductManager = {};
        let paramSupervisor = {};

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET.code], originId, productCodes);
        if (!products || !products.length)
            return [];

        let roleProductManager = await BusinessLoader.roleBusiness.getByCode(RoleCode.ProductManager);
        if (roleProductManager && roleProductManager._id) {
            paramProductManager = {
                query: <any>{
                    'permission.role': DataHelper.toObjectId(roleProductManager._id),
                    'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                    'permission.managers': DataHelper.toObjectId(originId),
                },
            };
        }

        let roleSupervisor = await BusinessLoader.roleBusiness.getByCode(RoleCode.Supervisor);
        if (roleSupervisor && roleSupervisor._id) {
            paramSupervisor = {
                query: <any>{
                    'permission.role': DataHelper.toObjectId(roleSupervisor._id),
                    'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                    'permission.managers': DataHelper.toObjectId(originId),
                },
            };
        }

        let totalProductManager = await this.userRepository.getCount(paramProductManager);
        let totalSupervisor = await this.userRepository.getCount(paramSupervisor);

        result.forEach(el => {
            el.productCode = productCodes[0] ? productCodes[0] : 0;
            el.summary.totalManagers = totalProductManager + totalSupervisor;
            el.summary.totalProductManager = totalProductManager;
            el.summary.totalSupervisor = totalSupervisor;
        });
        return result;
    }

    async getUsersCompletedCrunch(originId: string, productCodes: number[], page: number, limit: number): Promise<User[]> {
        if (!originId)
            return [];

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodes);
        if (!products || !products.length)
            return [];

        let pagination = new Pagination(page, limit);
        let nowDay = moment().subtract(1, 'month');
        let nowMonth = parseInt(nowDay.format('M'));
        let nowYear = parseInt(nowDay.format('YYYY'));
        let query: any = {};

        if (nowMonth > 6)
            query = {
                $and: [{completedAt: {$exists: true}}, {completedAt: {$ne: null}}],
                month: {
                    $lte: nowMonth
                },
                year: nowYear
            };
        else {
            let beginMonth = 6 + nowMonth;
            query = {
                $and: [{
                    $or: [{completedAt: {$exists: true}}, {completedAt: {$ne: null}}]
                }, {
                    $or: [{
                        month: {
                            $gte: beginMonth
                        },
                        year: {
                            $eq: nowYear - 1
                        }
                    }, {
                        month: {
                            $lte: nowMonth
                        },
                        year: {
                            $eq: nowYear
                        }
                    }]
                }]
            };
        }

        let params = [{
            $match: query
        }, {
            $group: {
                '_id': '$userId',
                'completedAt': {
                    $push: '$completedAt'
                }
            }
        }, {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        }, {
            $match: {
                'user.permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'user.permission.managers': DataHelper.toObjectId(originId),
                '$or': [{'user.deletedAt': {$exists: false}}, {'user.deletedAt': null}]
            }
        }, {
            $skip: pagination.skip
        }, {
            $limit: pagination.limit
        }, {
            $unwind: '$user'
        }, {
            $lookup: {
                from: 'products',
                localField: 'user.permission.product',
                foreignField: '_id',
                as: 'user.permission.product'
            }
        }, {
            $unwind: '$user.permission.product'
        }];

        let userCrunch = await this.crunchRepository.aggregate(params);

        // check userCrunch not include userNotCrunch

        let userNotCrunch = await this.getUsersNotCrunch(originId, [], 1, 50);

        let userNotCrunchIds : string[] = [];

        userNotCrunch.forEach(item => {
            userNotCrunchIds.push(item._id);
        });

        userCrunch = userCrunch.filter(item => !userNotCrunchIds.includes(item._id.toString()));

        // end check

        return userCrunch.map(user => {
            return new User(user.user);
        });
    }

    async getCountUsersCompletedCrunch(originId: string, productCodes: number[]): Promise<number> {
        if (!originId)
            return 0;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodes);
        if (!products || !products.length)
            return 0;

        let nowDay = moment().subtract(1, 'month');
        let nowMonth = parseInt(nowDay.format('M'));
        let nowYear = parseInt(nowDay.format('YYYY'));
        let query: any = {};

        if (nowMonth > 6)
            query = {
                $and: [{completedAt: {$exists: true}}, {completedAt: {$ne: null}}],
                month: {
                    $lte: nowMonth
                },
                year: nowYear
            };
        else {
            let beginMonth = 6 + nowMonth;
            query = {
                $and: [{
                    $or: [{completedAt: {$exists: true}}, {completedAt: {$ne: null}}]
                }, {
                    $or: [{
                        month: {
                            $gte: beginMonth
                        },
                        year: {
                            $eq: nowYear - 1
                        }
                    }, {
                        month: {
                            $lte: nowMonth
                        },
                        year: {
                            $eq: nowYear
                        }
                    }]
                }]
            };
        }

        let params = [{
            $match: query
        }, {
            $group: {
                '_id': '$userId',
                'completedAt': {
                    $push: '$completedAt'
                }
            }
        }, {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        }, {
            $match: {
                'user.permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'user.permission.managers': DataHelper.toObjectId(originId),
                '$or': [{'user.deletedAt': {$exists: false}}, {'user.deletedAt': null}]
            }
        }, {
            $unwind: '$user'
        }, {
            $count: 'count'
        }];

        let userCrunch:any = await this.crunchRepository.aggregate(params);
        return (Array.isArray(userCrunch) && userCrunch.length !== 0) ? userCrunch[0].count : 0;
    }

    async getUsersNotCrunch(originId: string, productCodes: number[], page: number, limit: number): Promise<User[]> {
        if (!originId)
            return [];

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodes);
        if (!products || !products.length)
            return [];

        let pagination = new Pagination(page, limit);
        let nowDay = moment().subtract(1, 'month');
        let nowMonth = parseInt(nowDay.format('M'));
        let nowYear = parseInt(nowDay.format('YYYY'));
        let query: any = {};

        if (nowMonth > 6)
            query = {
                $or: [{completedAt: {$exists: false}}, {completedAt: null}],
                month: {
                    $lte: nowMonth
                },
                year: nowYear
            };
        else {
            let beginMonth = 6 + nowMonth;
            query = {
                $and: [{
                    $or: [{completedAt: {$exists: false}}, {completedAt: null}]
                }, {
                    $or: [{
                        month: {
                            $gte: beginMonth
                        },
                        year: {
                            $eq: nowYear - 1
                        }
                    }, {
                        month: {
                            $lte: nowMonth
                        },
                        year: {
                            $eq: nowYear
                        }
                    }]
                }]
            };
        }

        let params = [{
            $match: query
        }, {
            $group: {
                _id: '$userId'
            }
        }, {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        }, {
            $match: {
                'user.permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'user.permission.managers': DataHelper.toObjectId(originId),
                '$or': [{'user.deletedAt': {$exists: false}}, {'user.deletedAt': null}]
            }
        }, {
            $unwind: '$user'
        }, {
            $skip: pagination.skip
        }, {
            $limit: pagination.limit
        }, {
            $lookup: {
                from: 'files',
                localField: 'user.avatar',
                foreignField: '_id',
                as: 'user.avatar'
            }
        }, {
            $lookup: {
                from: 'products',
                localField: 'user.permission.product',
                foreignField: '_id',
                as: 'user.permission.product'
            }
        }, {
            $unwind: '$user.permission.product'
        }, {
            $lookup: {
                from: 'roles',
                localField: 'user.permission.role',
                foreignField: '_id',
                as: 'user.permission.role'
            }
        }, {
            $unwind: '$user.permission.role'
        }];

        let userCrunchs = await this.crunchRepository.aggregate(params);
        let managerIds: string[] = [];

        userCrunchs.forEach(userCrunch => {
            userCrunch.user.avatar = userCrunch.user.avatar && userCrunch.user.avatar.length ? userCrunch.user.avatar[0] : null;

            if (userCrunch.user && userCrunch.user.permission && userCrunch.user.permission.managers) {
                userCrunch.user.permission.managers.forEach(manager => {
                    if (!managerIds.includes(manager.toString()))
                        managerIds.push(manager.toString());
                });
            }
        });

        let managers = await this.userRepository.find({
            query: {_id: {$in: managerIds}},
            select: 'fullName email avatar permission createdAt',
            populate: [{
                path: 'permission.role',
                select: 'code name'
            }, {
                path: 'avatar',
                select: 'url'
            }]
        });

        let users = userCrunchs.map(userCrunch => {
            if (userCrunch.user && userCrunch.user.permission && userCrunch.user.permission.managers) {
                let ms = userCrunch.user.permission.managers;
                userCrunch.user.permission.managers = [];

                ms.forEach(m => {
                    let manager = managers.find(manager => manager._id.toString() === m.toString() && (manager.permission!.role.code === RoleCode.Supervisor || manager.permission!.role.code === RoleCode.ProductManager));
                    if (manager)
                        userCrunch.user.permission.managers.push(manager);
                });
            }
            return userCrunch.user;
        });

        return User.parseArray(users);

        // return await Promise.all(userCrunchs.map(async (userCrunch): Promise<any> => {
        //     userCrunch.user.SupervisorManager = await BusinessLoader.userBusiness.getUsersByRole(userCrunch.user.permission.managers, roleId);
        //     return userCrunch.user;
        // }));
    }

    async getCountUsersNotCrunch(originId: string, productCodes: number[]): Promise<number> {
        if (!originId)
            return 0;

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, productCodes);
        if (!products || !products.length)
            return 0;

        let nowDay = moment().subtract(1, 'month');
        let nowMonth = parseInt(nowDay.format('M'));
        let nowYear = parseInt(nowDay.format('YYYY'));
        let query: any = {};

        if (nowMonth > 6)
            query = {
                $or: [{completedAt: {$exists: false}}, {completedAt: null}],
                month: {
                    $lte: nowMonth
                },
                year: nowYear
            };
        else {
            let beginMonth = 6 + nowMonth;
            query = {
                $and: [{
                    $or: [{completedAt: {$exists: false}}, {completedAt: null}]
                }, {
                    $or: [{
                        month: {
                            $gte: beginMonth
                        },
                        year: {
                            $eq: nowYear - 1
                        }
                    }, {
                        month: {
                            $lte: nowMonth
                        },
                        year: {
                            $eq: nowYear
                        }
                    }]
                }]
            };
        }

        let params = [{
            $match: query
        }, {
            $group: {
                _id: '$userId'
            }
        }, {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        }, {
            $match: {
                'user.permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'user.permission.managers': DataHelper.toObjectId(originId),
                '$or': [{'user.deletedAt': {$exists: false}}, {'user.deletedAt': null}]
            }
        }, {
            $count: 'count'
        }];

        let userCrunchs: any = await this.crunchRepository.aggregate(params);
        return (Array.isArray(userCrunchs) && userCrunchs.length !== 0) ? userCrunchs[0].count : 0;
    }

    async getProductStatistics(originId: string): Promise<{product: Product, productAdmins: any[], countManagers: number, countClients: number, countCancelClients: number}[]> {
        let results: {product: Product, productAdmins: string[], countManagers: number, countClients: number, countCancelClients: number}[] = [];

        // let productPermissions = await Authenticator.filterProductsPermission([module.PRODUCT.claim.GET.code], originId);
        // if (!productPermissions || !productPermissions.length)
        //     return results;

        let products = await BusinessLoader.productBusiness.getAll();
        if (products && products.length)
            products = products.filter(product => product.type !== ProductType.Management);
            // products = products.filter(product => productPermissions.find(p => p._id === product._id) && product.type !== ProductType.Management);

        let roleClient = await BusinessLoader.roleBusiness.getByCode(RoleCode.Client);
        let roleCaseManager = await BusinessLoader.roleBusiness.getByCode(RoleCode.CaseManager);
        let roleProductAdmin = await BusinessLoader.roleBusiness.getByCode(RoleCode.ProductAdmin);
        if (!roleClient || !roleCaseManager || !roleProductAdmin)
            return results;

        let productAdmins = await this.userRepository.findAll({
            query: {
                'deletedAt': null,
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'permission.role': DataHelper.toObjectId(roleProductAdmin._id)
            }
        });

        let params1 = [{
            $match: {
                _id: {$in: products.map(product => DataHelper.toObjectId(product._id))}
            }
        }, {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: 'permission.product',
                as: 'user'
            }
        }, {
            $unwind: '$user'
        }, {
            $match: {
                'user.permission.role': DataHelper.toObjectId(roleClient._id)
            }
        }, {
            $group: {
                _id: {product: '$user.permission.product', isDeleted: {$ne: ['$user.deletedAt', null]}},
                countClients: {$sum: 1}
            }
        }];
        let clientStas = this.productRepository.aggregate(params1);

        let params2 = [{
            $match: {
                'deletedAt': null,
                'permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'permission.role': DataHelper.toObjectId(roleClient._id)
            }
        }, {
            $project: {
                'permission.product': 1,
                'permission.managers': 1
            }
        }, {
            $unwind: '$permission.managers'
        }, {
            $group: {
                _id: {
                    product: '$permission.product',
                    manager: '$permission.managers'
                }
            }
        }, {
            $lookup: {
                from: 'users',
                localField: '_id.manager',
                foreignField: '_id',
                as: 'manager'
            }
        }, {
            $unwind: '$manager'
        }, {
            $match: {
                'manager.deletedAt': null,
                'manager.permission.role': DataHelper.toObjectId(roleCaseManager._id)
            }
        }, {
            $group: {
                _id: '$_id.product',
                countManagers: {$sum: 1}
            }
        }];
        let managerStas = this.userRepository.aggregate(params2);
        let [clientStatistics, managerStatistics] = await Promise.all([clientStas, managerStas]);

        for (let i = 0; i < products.length; i++) {
            let admins = productAdmins.filter(productAdmin => productAdmin.permission!.product.toString() === products[i]._id);
            let managerStatistic = managerStatistics.find(statistic => statistic._id && statistic._id.toString() === products[i]._id);
            let clientStatistic = clientStatistics.find(statistic => statistic._id && statistic._id.product.toString() === products[i]._id && !statistic._id.isDeleted);
            let cancelClientStatistic = clientStatistics.find(statistic => statistic._id && statistic._id.product.toString() === products[i]._id && statistic._id.isDeleted);

            results.push({
                product: products[i],
                productAdmins: <any[]>admins.map(productAdmin => ({_id: productAdmin._id, email: productAdmin.email})),
                countManagers: managerStatistic ? managerStatistic.countManagers : 0,
                countClients: clientStatistic ? clientStatistic.countClients : 0,
                countCancelClients: cancelClientStatistic ? cancelClientStatistic.countClients : 0
            });
        }
        return results;
    }

    // not use at the moment
    async get(_id: string): Promise<any> {
        return null;
    }

    async create(data: any): Promise<any> {
        return null;
    }

    async update(_id: string, data: any): Promise<any> {
        return null;
    }

    async delete(_id: string): Promise<boolean> {
        return true;
    }
}

Object.seal(AnalyticBusiness);
export default AnalyticBusiness;
