import IChartAccountAssignmentBusiness from './interfaces/IChartAccountAssignmentBusiness'; // eslint-disable-line
import BusinessLoader from '../../system/BusinessLoader';
import ChartAccountAssignmentRepository from 'justdone-system-package/dest/app/repository/ChartAccountAssignmentRepository';
import ChartAccountAssignment from 'justdone-system-package/dest/app/model/chartAccountAssignment/ChartAccountAssignment';
import ChartAccountAssignmentCreate from 'justdone-system-package/dest/app/model/chartAccountAssignment/ChartAccountAssignmentCreate'; // eslint-disable-line
import ChartAccountAssignmentUpdate from 'justdone-system-package/dest/app/model/chartAccountAssignment/ChartAccountAssignmentUpdate'; // eslint-disable-line
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import module from 'justdone-system-package/dest/resources/permission/module';
import {RoleCode} from 'justdone-system-package/dest/app/model/common/CommonType'; // eslint-disable-line
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';

class ChartAccountAssignmentBusiness implements IChartAccountAssignmentBusiness {
    private chartAccountAssignmentRepository: ChartAccountAssignmentRepository;

    constructor() {
        this.chartAccountAssignmentRepository = new ChartAccountAssignmentRepository();
    }

    async get(_id: string): Promise<ChartAccountAssignment | null> {
        if (!_id)
            return null;

        let chartAccount = await this.chartAccountAssignmentRepository.get(_id);
        return chartAccount && new ChartAccountAssignment(chartAccount);
    }

    async getAll(): Promise<ChartAccountAssignment[]> {
        let chartAccountAssignment = await this.chartAccountAssignmentRepository.findAll();
        return ChartAccountAssignment.parseArray(chartAccountAssignment);
    }

    async getGroupProductByCOA(coaId: string): Promise<any[]> {
        return this.chartAccountAssignmentRepository.aggregate([
            {$match: {coa: DataHelper.toObjectId(coaId)}},
            {
                $group: {
                    _id: '$product',
                    count: {$sum: 1}
                }
            }
        ]);
    }

    async getWithAllField(originId: string, productCode: number, coaId: string, clientId: string): Promise<ChartAccountAssignment | null> {
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     throw new ErrorCommon(104, 'Product code');
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, [productCode]);
        if (!products || !products.length)
            return null;

        let params = {
            query: {
                'product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'coa': DataHelper.toObjectId(coaId),
                'client': DataHelper.toObjectId(clientId)
            }
        };
        let result = await this.chartAccountAssignmentRepository.findOne(params);
        return result && new ChartAccountAssignment(result);
    }

    async getUserByProductCoa(originId: string, productCode: number, coaId: string): Promise<any[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, [productCode]);
        if (!products || !products.length)
            return [];

        let params = {
            query: <any>{
                $and: [
                    {coa: DataHelper.toObjectId(coaId)},
                    {product: {$in: products.map(product => DataHelper.toObjectId(product._id))}}
                ]
            },
            select: '-_id -coa -product'
        };

        let result = await this.chartAccountAssignmentRepository.findAll(params);
        return result;
    }

    async getAllCoaByClient(originId: string, userId: string): Promise<ChartAccountAssignment[]> {
        if (!originId || !userId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId);
        if (!products || !products.length)
            return [];

        let param = {
            query: {
                client: DataHelper.toObjectId(userId)
            }
        };
        return await this.chartAccountAssignmentRepository.findAll(param);
    }

    async getCoaByClient(originId: string, productCode: number, userId: string, keyword: string, page: number, limit: number): Promise<any> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, [productCode]);
        if (!products || !products.length)
            return [];
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     throw new ErrorCommon(104, 'Product code');

        let params: any[] = [
            {$match: {product: {$in: products.map(product => DataHelper.toObjectId(product._id))}}},
            {$match: {client: DataHelper.toObjectId(userId)}},
            {
                $lookup: {
                    from: 'chartaccounts',
                    localField: 'coa',
                    foreignField: '_id',
                    as: 'coaRef'
                }
            },
            {$unwind: '$coaRef'}
        ];

        if (keyword)
            params.push({$match: {'coaRef.searchTerm': {$regex: new RegExp(keyword, 'i')}}});

        params.push( {$sort: {'coaRef.code': 1}});
        params.push({$skip: (page - 1) * limit}, {$limit: limit});
        return await this.chartAccountAssignmentRepository.aggregate(params);
    }

    async getCountCoaByClient(originId: string, productCode: number, userId: string, keyword: string): Promise<number> {
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     throw new ErrorCommon(104, 'Product code');
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, [productCode]);
        if (!products || !products.length)
            return 0;
        let params: any[] = [
            {$match: {product: {$in: products.map(product => DataHelper.toObjectId(product._id))}}},
            {$match: {client: DataHelper.toObjectId(userId)}},
            {
                $lookup: {
                    from: 'chartaccounts',
                    localField: 'coa',
                    foreignField: '_id',
                    as: 'coa'
                }
            },
        ];

        if (keyword)
            params.push({$match: {'coa.searchTerm': {$regex: new RegExp(keyword, 'i')}}});

        params.push({$count: 'count'});

        let result = await this.chartAccountAssignmentRepository.aggregate(params);

        if (result.length && result[0].count)
            return result[0].count;
        else
            return 0;
    }

    async checkCoaExistByClient(originId: string, productCode: number, clientId: string, coaId: string): Promise<boolean> {
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     return false;
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, [productCode]);
        if (!products || !products.length)
            return false;
        let params = {
            query: {
                'product': {$in: products.map(product => DataHelper.toObjectId(product._id))},
                'client': DataHelper.toObjectId(clientId),
                'coa': DataHelper.toObjectId(coaId)
            }
        };

        let result = await this.chartAccountAssignmentRepository.findOne(params);
        return result ? true : false;
    }

    async getCountUserByProductCoa(originId: string, productCode: number, coaId: string): Promise<number> {
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     throw new ErrorCommon(104, 'Product code');
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, [productCode]);
        if (!products || !products.length)
            return 0;
        let params = {
            query: <any>{
                $and: [
                    {coa: DataHelper.toObjectId(coaId)},
                    {product: {$in: products.map(product => DataHelper.toObjectId(product._id))}}
                ]
            },
            select: 'client'
        };
        return await this.chartAccountAssignmentRepository.getCount(params);
    }

    async getClientAssignedByProduct(originId: string, productCode: number, coaId: string): Promise<string[]> {
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     return [];
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, [productCode], [RoleCode.Client]);
        if (!products || !products.length)
            return [];
        let result = await this.chartAccountAssignmentRepository.aggregate([
            {$match: {product: {$in: products.map(product => DataHelper.toObjectId(product._id))}}},
            {$match: {coa: DataHelper.toObjectId(coaId)}},
            {
                $group: {
                    _id: '$client'
                }
            },
        ]);

        let list: string[] = [];
        for (let i = 0; i < result.length; i++) {
            list.push(result[i]._id);
        }
        return list;
    }

    async searchWithProduct(originId: string, productCode: number, page: number, limit: number, keyword: string): Promise<any[]> {
        let listCodeUsed = await BusinessLoader.groupExpenseBusiness.getCoaListOfUser(originId);
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     return [];
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, [productCode]);
        if (!products || !products.length)
            return [];
        let params: any[] = [
            // {$match: {product: DataHelper.toObjectId(product._id)}},
            {$match: {'product': {$in: products.map(product => DataHelper.toObjectId(product._id))}}},
            {
                $group: {
                    _id: '$coa'
                }
            },
            {$match: {_id: {$nin: listCodeUsed}}},
            {
                $lookup: {
                    from: 'chartaccounts',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'coa'
                }
            }
        ];
        if (keyword)
            params.push({$match: {'coa.searchTerm': {$regex: new RegExp(keyword, 'i')}}});

        params.push({$skip: (page - 1) * limit}, {$limit: limit});
        return await this.chartAccountAssignmentRepository.aggregate(params);
    }

    async getCountWithProduct(originId: string, productCode: number, keyword: string): Promise<number> {
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, [productCode]);
        if (!products || !products.length)
            return 0;

        let listCodeUsed = await BusinessLoader.groupExpenseBusiness.getCoaListOfUser(originId);
        let params: any[] = [
            // {$match: {product: DataHelper.toObjectId(product._id)}},
            {$match: {'product': {$in: products.map(product => DataHelper.toObjectId(product._id))}}},
            {
                $group: {
                    _id: '$coa'
                }
            },
            {$match: {_id: {$nin: listCodeUsed}}},

        ];

        if (keyword)
            params.push({$match: {'coa.searchTerm': {$regex: new RegExp(keyword, 'i')}}});

        params.push({$count: 'count'});
        let result = await this.chartAccountAssignmentRepository.aggregate(params);
        if (result.length && result[0].count)
            return result[0].count;
        else
            return 0;
    }

    // Only use for init (private)
    async assignAllCoas(productId: string, clientId: string): Promise<boolean> {
        if (!productId || !clientId)
            return false;

        let coas = await BusinessLoader.chartAccountBusiness.getAll();
        let coaAssignments = await this.chartAccountAssignmentRepository.findAll({
            query: {
                product: DataHelper.toObjectId(productId),
                client: DataHelper.toObjectId(clientId)
            }
        });

        coaAssignments.forEach(coaAssignment => {
            let index = coas.findIndex(coa => (coaAssignment.coa && coaAssignment.coa.toString()) === coa._id);
            if (index !== -1)
                coas.splice(index, 1);
        });

        let data = <ChartAccountAssignmentCreate[]>[];
        coas.forEach(coa => {
            data.push(new ChartAccountAssignmentCreate(<any>{
                product: productId,
                client: clientId,
                coa: coa._id
            }));
        });

        if (data && data.length)
            await this.chartAccountAssignmentRepository.createMultiple(data);
        return true;
    }

    async create(data: ChartAccountAssignmentCreate): Promise<ChartAccountAssignment> {
        let chartAccount;
        chartAccount = await this.chartAccountAssignmentRepository.create(data);
        return chartAccount && new ChartAccountAssignment(chartAccount);
    }

    async moveClientInProduction(client:string, product: string): Promise<boolean> {
        await this.chartAccountAssignmentRepository.findAndUpdateAll({client}, {product});
        return true;
    }

    async update(_id: string, data: ChartAccountAssignmentUpdate): Promise<ChartAccountAssignment | null> {
        await this.chartAccountAssignmentRepository.update(_id, data);
        return await this.get(_id);
    }

    async delete(_id: string): Promise<boolean> {
        return await this.chartAccountAssignmentRepository.delete(_id, true);
    }

    async deleteByCoa(coaId: string): Promise<boolean> {
        let params = {
            query: {
                coa: DataHelper.toObjectId(coaId)
            }
        };
        let result = await this.chartAccountAssignmentRepository.findAll(params);
        for (let i = 0; i < result.length; i++) {
            this.chartAccountAssignmentRepository.delete(result[i]._id, true);
        }
        return true;
    }

    async deleteWithAllField(originId: string, productCode: number, coaId: string, clientId: string): Promise<boolean> {
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     return false;
        let proCode = 0;
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, [productCode]);
        if (!products || !products.length)
            return false;
        proCode = products[0].code;
        let result = await this.getWithAllField(originId, proCode, coaId, clientId);
        if (result)
            return await this.chartAccountAssignmentRepository.delete(result._id, true);
        return false;
    }

    async deleteAllByUser(originId: string, clientId: string): Promise<boolean> {
        if (!originId)
            return false;

        let manager = await AuthorizationHelper.userService.get(originId);
        let roleSuperAdmin = await BusinessLoader.roleBusiness.getByCode(RoleCode.SuperAdmin);
        if (!manager || !manager.permission || !manager.permission.role || !roleSuperAdmin || manager.permission.role.toString() !== roleSuperAdmin._id)
            return false;

        let results = await this.chartAccountAssignmentRepository.findAll({query: {client: DataHelper.toObjectId(clientId)}});
        for (let i = 0; i < results.length; i++) {
            await this.chartAccountAssignmentRepository.delete(results[i]._id, true);
        }
        return false;
    }
}

Object.seal(ChartAccountAssignmentBusiness);
export default ChartAccountAssignmentBusiness;
