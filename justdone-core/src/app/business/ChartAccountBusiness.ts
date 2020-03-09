import BusinessLoader from '../../system/BusinessLoader';
import IChartAccountBusiness from './interfaces/IChartAccountBusiness'; // eslint-disable-line
import ChartAccountRepository from 'justdone-system-package/dest/app/repository/ChartAccountRepository';
import ChartAccount from 'justdone-system-package/dest/app/model/chartAccount/ChartAccount'; // eslint-disable-line
import ChartAccountStatistic from 'justdone-system-package/dest/app/model/chartAccount/ChartAccountStatistic'; // eslint-disable-line
import ChartAccountCreate from 'justdone-system-package/dest/app/model/chartAccount/ChartAccountCreate'; // eslint-disable-line
import ChartAccountUpdate from 'justdone-system-package/dest/app/model/chartAccount/ChartAccountUpdate'; // eslint-disable-line
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import module from 'justdone-system-package/dest/resources/permission/module';
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';
class ChartAccountBusiness implements IChartAccountBusiness {
    private chartAccountRepository: ChartAccountRepository;

    constructor() {
        this.chartAccountRepository = new ChartAccountRepository();
    }

    async getAll(): Promise<ChartAccount[]> {
        let chartAccount = await this.chartAccountRepository.findAll();
        return ChartAccount.parseArray(chartAccount);
    }

    async getByCodeAndName(code: string, name: string): Promise<ChartAccount | null> {
        let chartAccount = await this.chartAccountRepository.findOne({query: {code: code, name: name}});
        return chartAccount && new ChartAccount(chartAccount);
    }

    async getById(originId: string, _ids: string[]): Promise<ChartAccount[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];

        let originUser = await AuthorizationHelper.userService.get(originId);
        let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        if (!originUser || !originUser.permission ||
            !products.find(product => product.code === productCode))
            return [];

        if (!_ids || !_ids.length)
            return [];

        let params = {
            query: {
                _id: {$in: _ids}
            }
        };
        let chartAccounts = await this.chartAccountRepository.findAll(params);
        return ChartAccount.parseArray(chartAccounts);
    }

    async getList(page: number, limit: number): Promise<ChartAccountStatistic[]> {
        let order = {createAt: 1};
        let chartAccounts = await this.chartAccountRepository.find(null, order, page, limit);
        let lastChartAccounts: any[] = [];
        let i = 0;

        if (!chartAccounts || chartAccounts.length <= 0)
            return [];

        do {
            let result = await BusinessLoader.chartAccountAssignmentBusiness.getGroupProductByCOA(chartAccounts[i]._id);
            if (result && result.length > 0) {
                let countClient: number = 0;
                for (let i = 0; i < result.length; i++) {
                    countClient = countClient + result[i].count;
                }
                let data = {
                    coa: chartAccounts[i],
                    product: result.length,
                    client: countClient
                };
                lastChartAccounts.push(data);
            }
            else {
                let data = {
                    coa: chartAccounts[i],
                    product: 0,
                    client: 0
                };
                lastChartAccounts.push(data);
            }
            i++;
        } while (i < chartAccounts.length);

        return ChartAccountStatistic.parseArray(lastChartAccounts);
    }

    async getCount(keyword: string): Promise<number> {
        let params = {
            query: <any>{}
        };

        if (keyword)
            params.query.searchTerm = {$regex: new RegExp(`.*${keyword}.*`, 'i')};
        return await this.chartAccountRepository.getCount(params);
    }

    async get(_id: string): Promise<ChartAccount | null> {
        if (!_id)
            return null;

        let chartAccount = await this.chartAccountRepository.get(_id);
        return chartAccount && new ChartAccount(chartAccount);
    }

    async search(originId: string, page: number, limit: number, keyword: string): Promise<ChartAccountStatistic[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];

        let originUser = await AuthorizationHelper.userService.get(originId);
        let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        if (!originUser || !originUser.permission ||
            !products.find(product => product.code === productCode))
            return [];
        let params = {
            query: <any>{}
        };
        let order = {createAt: 1};

        if (keyword)
            params.query.searchTerm = {$regex: new RegExp(`.*${keyword}.*`, 'i')};

        let chartAccounts = await this.chartAccountRepository.find(params, order, page, limit);
        let lastChartAccounts: any[] = [];
        let i = 0;

        if (!chartAccounts || chartAccounts.length <= 0)
            return [];

        do {
            let result = await BusinessLoader.chartAccountAssignmentBusiness.getGroupProductByCOA(chartAccounts[i]._id);
            if (result && result.length > 0) {
                let countClient: number = 0;

                for (let i = 0; i < result.length; i++) {
                    countClient = countClient + result[i].count;
                }

                let data = {
                    coa: chartAccounts[i],
                    product: result.length,
                    client: countClient
                };
                lastChartAccounts.push(data);
            }
            else {
                let data = {
                    coa: chartAccounts[i],
                    product: 0,
                    client: 0
                };
                lastChartAccounts.push(data);
            }
            i++;
        } while (i < chartAccounts.length);

        return ChartAccountStatistic.parseArray(lastChartAccounts);
    }

    async searchWithProduct(userId: string, productCode: number, page: number, limit: number, keyword: string): Promise<any[]> {
        return await BusinessLoader.chartAccountAssignmentBusiness.searchWithProduct(userId, productCode, page, limit, keyword);
    }

    async getCountWithProduct(userId: string, productCode: number, keyword: string): Promise<number> {
        return await BusinessLoader.chartAccountAssignmentBusiness.getCountWithProduct(userId, productCode, keyword);
    }

    // async getByGroupId(groupId: string): Promise<ChartAccount[]> {
    //     let params = {
    //         query: <any>{
    //             groupId: DataHelper.toObjectId(groupId)
    //         }
    //     };
    //     return await this.chartAccountRepository.findAll(params);
    // }

    async getStatusChartAccount(originId: string, ids: string[]): Promise<any[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        if (!ids.length)
            return [];
        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];

        let originUser = await AuthorizationHelper.userService.get(originId);
        let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        if (!originUser || !originUser.permission ||
            !products.find(product => product.code === productCode))
            return [];

        let i = 0;
        let result: any[] = [];
        do {
            let record = await BusinessLoader.transactionBusiness.getTransactionByCoa(originId, ids[i]);

            if (record)
                result.push({_id: ids[i], statusCrunch: 2});
            else
                result.push({_id: ids[i], statusCrunch: 1});
            i++;
        } while (i < ids.length);
        return result;
    }

    async checkDataExists(code: string, name: string, _id?: string): Promise<boolean> {
        let params = {
            query: <any>{
                $or: [
                    {code: code},
                    {name: name}
                ]
            }
        };
        if (_id)
            params.query._id = {$nin: DataHelper.toObjectId(_id)};

        let chartAccount = await this.chartAccountRepository.findOne(params);
        return chartAccount ? true : false;
    }

    async create(data: ChartAccountCreate): Promise<ChartAccount> {
        let chartAccount;
        data.searchTerm = data.code + ' ' + data.name;

        if (validateName(data.name) && validateCode(data.code)) {
            let isExist = await this.checkDataExists(data.code, data.name);
            if (!isExist)
                chartAccount = await this.chartAccountRepository.create(data);
            else
                throw new ErrorCommon(104, 'Coa Name or Code');
        }
        return chartAccount && new ChartAccount(chartAccount);
    }

    async createChartAccount(originId: string, data: ChartAccountCreate): Promise<ChartAccount | boolean> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        if (!products || !products.length)
            return false;

        let originUser = await AuthorizationHelper.userService.get(originId);
        let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        if (!originUser || !originUser.permission ||
            !products.find(product => product.code === productCode))
            return false;

        let chartAccount;
        data.searchTerm = data.code + ' ' + data.name;
        if (validateName(data.name) && validateCode(data.code)) {
            let isExist = await this.checkDataExists(data.code, data.name);
            if (!isExist)
                chartAccount = await this.chartAccountRepository.create(data);
            else
                throw new ErrorCommon(104, 'Coa Name or Code');
        }
        return chartAccount && new ChartAccount(chartAccount);
    }

    async assignClients(originId: string, _id: string, productCode: number, clientIds: string[], actionSelectedAll: boolean): Promise<boolean> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        if (!_id || !await this.chartAccountRepository.get(_id))
            return false;
        if (actionSelectedAll)
            return await this.assignClientAll(originId, _id, productCode, clientIds);
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     return false;
        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.ASSIGN_CLIENT.code], originId, [productCode]);
        if (!products || !products.length)
            return false;
        else {
            if (!clientIds || await BusinessLoader.userBusiness.getCountUser(clientIds) !== clientIds.length)
                return false;

            let i = 0;
            do {
                let isExist = await BusinessLoader.chartAccountAssignmentBusiness.getWithAllField(originId, productCode, _id, clientIds[i]);
                if (!isExist) {
                    let data = {
                        product: products[0]._id,
                        coa: _id,
                        client: clientIds[i]
                    };
                    BusinessLoader.chartAccountAssignmentBusiness.create(data);
                }
                i++;
            } while (i < clientIds.length);

            return true;
        }
    }

    async assignClientAll(originId: string, _id: string, productCode: number, clientsNotIn: string[]): Promise<boolean> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.ASSIGN_CLIENT.code], originId, [productCode]);
        if (!products || !products.length)
            return false;
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     return false;
        let clients = await BusinessLoader.managerBusiness.getClientsByProductCoa(originId, productCode, _id);
        let i = 0;

        do {
            let isExist = clientsNotIn.indexOf(clients[i]._id);
            if (isExist < 0) {
                let data = {
                    product: products[0]._id,
                    coa: _id,
                    client: clients[i]._id
                };
                BusinessLoader.chartAccountAssignmentBusiness.create(data);
            }
            i++;
        } while (i < clients.length);

        return true;
    }

    async removeClientAssigned(originId: string, coaId: string, productCode: number, clientIds: string[]): Promise<boolean> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.DELETE_CLIENT.code], originId, [productCode]);
        if (!products || !products.length)
            return false;
        let proCode = products[0].code;
        if (proCode) {
            for (let i = 0; i < clientIds.length; i++)
                BusinessLoader.chartAccountAssignmentBusiness.deleteWithAllField(originId, proCode, coaId, clientIds[i]);
        }
        return true;
    }

    async update(_id: string, data: ChartAccountUpdate): Promise<ChartAccount | null> {
        if (validateName(data.name) && validateCode(data.code)) {
            let isExist = await this.checkDataExists(data.code, data.name, _id);
            if (!isExist) {
                data.searchTerm = data.code + ' ' + data.name;
                await this.chartAccountRepository.update(_id, data);
            }
            else
                throw new ErrorCommon(104, 'Coa Name or Code');
        }
        return await this.get(_id);
    }

    async updateChartAccount(originId: string, chartAccounId: string, data: ChartAccountUpdate): Promise<ChartAccount | null> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.DELETE.code], originId, []);
        if (!products || !products.length)
            return null;

        let originUser = await AuthorizationHelper.userService.get(originId);
        let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        if (!originUser || !originUser.permission ||
            !products.find(product => product.code === productCode))
            return null;

        if (validateName(data.name) && validateCode(data.code)) {
            let isExist = await this.checkDataExists(data.code, data.name, chartAccounId);
            if (!isExist) {
                data.searchTerm = data.code + ' ' + data.name;
                await this.chartAccountRepository.update(chartAccounId, data);
            }
            else
                throw new ErrorCommon(104, 'Coa Name or Code');
        }
        return await this.get(chartAccounId);
    }

    async removeProduct(originId: string, _id: string, productCode: number): Promise<boolean> {
        let coa = await this.chartAccountRepository.get(_id, {
            path: 'clients',
            select: '_id permission'
        });

        let newListClients: any = [];
        let newListProduct: any = [];

        if (!coa)
            throw new ErrorCommon(101, 'Data');

        let listProducts = await this.chartAccountRepository.findOneAndUpdate({_id: DataHelper.toObjectId(_id)}, {$push: {products: newListProduct}});
        let listClients = await this.chartAccountRepository.findOneAndUpdate({_id: DataHelper.toObjectId(_id)}, {$push: {clients: newListClients}});
        return listClients && listProducts ? true : false;
    }

    async delete(_id: string): Promise<boolean> {
        let exitsCoa = await BusinessLoader.transactionBusiness.getAllTransactionsByCoaId('', _id);
        if (exitsCoa && exitsCoa.length)
            throw new ErrorCommon(104, 'Coa');

        BusinessLoader.chartAccountAssignmentBusiness.deleteByCoa( _id);
        return await this.chartAccountRepository.delete(_id, true);
    }

    async deleteChartAccount(originId: string, chartAccounId: string): Promise<boolean> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.DELETE.code], originId, []);
        if (!products || !products.length)
            return false;

        let originUser = await AuthorizationHelper.userService.get(originId);
        let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        if (!originUser || !originUser.permission ||
            !products.find(product => product.code === productCode))
            return false;

        let exitsCoa = await BusinessLoader.transactionBusiness.getAllTransactionsByCoaId(originId, chartAccounId);
        if (exitsCoa && exitsCoa.length)
            throw new ErrorCommon(104, 'Coa');

        BusinessLoader.chartAccountAssignmentBusiness.deleteByCoa(chartAccounId);
        return await this.chartAccountRepository.delete(chartAccounId, true);
    }
}

function validateName(name: string): boolean {
    if (!name)
        throw new ErrorCommon(105, 'Name');
    // else if (name.trim().length < 4)
    //     throw new ErrorCommon(201, 'name', '4');

    return true;
}
function validateCode(code: string): boolean {
    if (!code)
        throw new ErrorCommon(105, 'Code');
    let array: any[] = code.split('-');
    if (!array.length || array.length > 2)
        throw new ErrorCommon(101, 'Code');

    for (let i = 0; i < array.length; i++ ) {
        if (!array[i].length || array[i].indexOf('.') > 0 || isNaN(array[i]))
            throw new ErrorCommon(101, 'Code');
    }
    return true;
}

Object.seal(ChartAccountBusiness);
export default ChartAccountBusiness;
