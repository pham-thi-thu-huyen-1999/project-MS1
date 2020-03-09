import BaseController from './base/BaseController';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';
import BankServiceHelper from 'justdone-system-package/dest/helpers/BankServiceHelper';
import ReportHelper from 'justdone-system-package/dest/helpers/ReportHelper';
import LogHelper from 'justdone-system-package/dest/helpers/LogHelper';
import InitialData from '../system/InitialData';
import {getPermissions} from '../resources/initialData/Permissions';
import SystemHelper from 'justdone-system-package/dest/helpers/SystemHelper';
import BusinessLoader from '../system/BusinessLoader';
import getRoles from '../resources/initialData/Roles';
import getChartAccounts from '../resources/initialData/ChartAccounts';
import getProviders from '../resources/initialData/Providers';

class SystemController extends BaseController {
    constructor() {
        super();

        this.get('/', Authenticator.isAuthenticated, this.getInfo.bind(this));

        if (process.env.NODE_ENV !== 'Production') {
            this.post('/init-data', this.initData.bind(this));
            this.post('/init-transactions', this.initTransactions.bind(this));
        }
        this.post('/init-coa', this.initCoas.bind(this));
        this.post('/init-banks', this.initProviders.bind(this));
        this.post('/init-permission', this.initPermission.bind(this));
        this.post('/init-assign-coas', this.initAssignCoas.bind(this));
        this.post('/custom-assign-manager', this.customAssignManager.bind(this));
        this.post('/revert-transactions-by-client', this.revertTransactionByClient.bind(this));
    }

    async initData(req): Promise<any> {
        let isRequired = req.query.require ? Boolean(req.query.require) : false;
        await (new InitialData()).init(isRequired);
        return true;
    }

    async checkServerStatus(serverInfor: any[]) : Promise<any> {
        if (!serverInfor || (serverInfor && !serverInfor.length))
            return [];
        serverInfor.sort((val1, val2) => {
            return val1.status - val2.status;
        });
        return serverInfor;
    }
    async getInfo(req): Promise<any> {
        let systemInfo = <any[]>[];
        // Core
        let coreInfo;
        try {
            coreInfo = await SystemHelper.getSytemInfo();
        }
        catch (error) {
            coreInfo = {
                name: 'System Core',
                status: false
            };
        }
        systemInfo.push(coreInfo);
        // Authorization
        await AuthorizationHelper.systemService.getSytemInfo()
            .then((response) => {
                if (!response.name || response.name === 'RequestError')
                    response.name = 'Authorization';
                if (response.status === undefined)
                    response.status = false;
                systemInfo.push(response);
            })
            .catch((error) => {
                let response = {
                    name: 'Authorization',
                    status: false
                };
                systemInfo.push(response);
            });
        // Bank
        await BankServiceHelper.getSytemInfo()
            .then((response) => {
                if (!response.name || response.name === 'RequestError')
                    response.name = 'Bank Service';
                if (response.status === undefined)
                    response.status = false;
                systemInfo.push(response);
            })
            .catch((error) => {
                let response = {
                    name: 'Bank Service',
                    status: false
                };
                systemInfo.push(response);
            });
        // Reoort
        await ReportHelper.getSytemInfo()
            .then((response) => {
                if (!response.name || response.name === 'RequestError')
                    response.name = 'Report';
                if (response.status === undefined)
                    response.status = false;
                systemInfo.push(response);
            })
            .catch((error) => {
                let response = {
                    name: 'Report',
                    status: false
                };
                systemInfo.push(response);
            });
        // Log
        await LogHelper.logService.getSytemInfo()
            .then((response) => {
                if (!response.name || response.name === 'RequestError')
                    response.name = 'System Log';
                if (response.status === undefined)
                    response.status = false;
                systemInfo.push(response);
            })
            .catch((error) => {
                let response = {
                    name: 'System Log',
                    status: false
                };
                systemInfo.push(response);
            });
        let data = this.checkServerStatus(systemInfo);
        if (data)
            return data;
        return systemInfo;
    }

    async initRoles(): Promise<void> {
        let list = getRoles();
        // await DataCachingHelper.delete('/api/role/all');
        let products = await BusinessLoader.productBusiness.getAll();

        for (let i = 0; i < list.length; i++) {
            let item = list[i];

            if (item.isRequired) {
                try {
                    let role = await BusinessLoader.roleBusiness.getByCode(item.data.code);
                    if (!role) {
                        item.data.products = item.data.products.map(productType => products.find(p => p.type === productType)!._id);
                        await BusinessLoader.roleBusiness.create(item.data);
                    }
                }
                catch (error) {
                }
            }
        }
    }

    async initCoas(): Promise<void> {
        let coas = await getChartAccounts();
        coas.forEach(async (coa) => {
            if (coa.data.code !== '' && coa.data.name !== '' && coa.isRequired) {
                let exist = await BusinessLoader.chartAccountBusiness.checkDataExists(coa.data.code, coa.data.name);
                if (!exist) {
                    BusinessLoader.chartAccountBusiness.create(<any>coa.data);
                }
            }
        });
    }

    // async initBanks(req): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         exec(`mongoimport --db justdone_${process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()} --collection providers --drop --file ./src/resources/initialData/providers.json --jsonArray`, (err, stdout, stderr) => {
    //             if (err)
    //                 reject(err);
    //             console.log('\x1b[32m', `Initialize banks have done.`, '\x1b[0m');
    //             resolve(true);
    //         });
    //     });
    // }

    async initProviders(): Promise<void> {
        let providers = getProviders();
        let exist = await BusinessLoader.yodleeBusiness.isProvidersExist(providers.data[0].name, providers.data[0].bankId);
        if (!exist) {
            if (providers.isRequired) {
                BusinessLoader.yodleeBusiness.createProviders(providers.data);
            }
        }
    }

    async initTransactions(req): Promise<any> {
        if (!req.query.email)
            return;

        let user = await BusinessLoader.userBusiness.getByEmail(req.query.email);
        if (!user)
            return;

        await (new InitialData()).initFinancialStatements(user._id);
        return true;
    }

    async initPermission(req): Promise<any> {
        let products = await BusinessLoader.productBusiness.getAll();
        for (let i = 0; i < products.length; i++) {
            if (products[i].type) {
                let permissions = <{product: number, claim: number, fromRole: number, toRole: number | null}[]>[];
                let list: {product: number, claim: number, fromRole: number, toRole: number | null}[] = await getPermissions(products[i].type);

                if (list.length) {
                    for (let j = 0; j < list.length; j++) {
                        list[j].product = products[i].code;
                        permissions.push(list[j]);
                    }

                    // get list permission by product.
                    let data = await AuthorizationHelper.get(`/api/permission/list?productCode=${products[i].code}&module=`);

                    let countPermission: number = 0;
                    for (let x = 0; x < list.length; x++) {
                        let item = list[x];
                        if (!data.length || !data.filter(premission =>
                            (premission.fromRole === item.fromRole) &&
                            (premission.toRole === item.toRole) &&
                            (premission.claim === item.claim)).length) {
                            try {
                                await AuthorizationHelper.permissionService.create(<any>item);
                                countPermission++;
                            }
                            catch (error) {
                            }
                        }
                    }
                }
            }
        }
        return true;
    }

    async initAssignCoas(req): Promise<any> {
        let clientId = req.body.clientId;
        let productId = req.body.productId;
        let clients :any = [];
        let products :any = [];

        if (productId) {
            let product = await BusinessLoader.productBusiness.get(productId);
            if (!product)
                throw new Error('can not find product!');
            products.push(product);
        }
        else {
            products = await BusinessLoader.productBusiness.getAll();
        }

        if (clientId) {
            let client = await BusinessLoader.userBusiness.get(clientId);
            if (!client)
                throw new Error('can not find client!');
            else
                clients.push(client);
        }
        else
            clients = await BusinessLoader.userBusiness.getAllClients();

        for (let index = 0; index < clients.length; index++) {
            const client = clients[index];

            for (let index = 0; index < products.length; index++) {
                const product = products[index];
                if (product.code !== 1) {
                    await BusinessLoader.chartAccountAssignmentBusiness.assignAllCoas(product._id.toString(), client._id.toString());
                }
            }
        }
        return true;
    }

    async customAssignManager(req): Promise<any> {
        let managerId = req.body.managerId;
        if (!managerId)
            return false;
        let manager = await BusinessLoader.userBusiness.get(managerId);
        if (!manager)
            return false;
        // should check role manager assign
        let userSuperAdmin = await BusinessLoader.userBusiness.getByEmail('super.admin@justdone.com.au');

        if (!userSuperAdmin)
            return false;
        let adminId = userSuperAdmin._id;
        let clients = await BusinessLoader.userBusiness.getAllClients();

        for (let index = 0; index < clients.length; index++) {
            const client = clients[index];
            await BusinessLoader.managerBusiness.assignManagers(adminId, client._id, [managerId]);
        }
        return;
    }

    async revertTransactionByClient(req): Promise<any> {
        return await BusinessLoader.transactionBusiness.revertCruncherTransactions(req.query.userId, req.query.accountId, Number(req.query.type), Number(req.query.year), Number(req.query.month));
    }
}

Object.seal(SystemController);
export default SystemController;
