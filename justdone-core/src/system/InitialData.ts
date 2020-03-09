import BusinessLoader from '../system/BusinessLoader';
import getRoles from '../resources/initialData/Roles';
import getProducts from '../resources/initialData/Products';
import getCustomPermissions from '../resources/initialData/CustomPermissions'; //eslint-disable-line
import getUsers from '../resources/initialData/Users';
import getAccountings from '../resources/initialData/Accountings';
import getUserRoles from '../resources/initialData/UserRoles';
import getStatements from '../resources/initialData/Statements';
import getCrunch from '../resources/initialData/Crunch';
// import getTransactions from '../resources/initialData/Transactions';
import getChartAccounts from '../resources/initialData/ChartAccounts';
import getGroupExpense from '../resources/initialData/GroupExpenses'; //eslint-disable-line
import getProviders from '../resources/initialData/Providers';
import {exec} from 'child_process';
// import Statement from 'justdone-system-package/dest/app/model/statement/Statement';
import StatementCreate from 'justdone-system-package/dest/app/model/statement/StatementCreate';
// import Crunch from 'justdone-system-package/dest/app/model/crunch/Crunch';
import {CrunchCreate} from 'justdone-system-package/dest/app/model/crunch';

class InitialData {
    isRequired?: boolean;

    async init(isRequired?: boolean): Promise<void> {
        this.isRequired = isRequired;

        await this.initProducts();
        await this.initRoles();
        await this.initUsers();
        await this.initUserRoles();

        // if (isRequired) {
        // await this.initProviders();
        // await this.initTransactions();
        // await this.initStatements();
        // await this.initCrunch();
        // await this.initAccounting();
        // await this.initGroupExpense();
        // }

        console.log('\x1b[32m', 'Initial Data ===> Done.', '\x1b[0m');
    }

    async initProducts(): Promise<void> {
        let list = getProducts();
        // await DataCachingHelper.delete('/api/product/all');

        for (let i = 0; i < list.length; i++) {
            let item: any = list[i];

            if (item.isRequired || this.isRequired) {
                try {
                    let product = await BusinessLoader.productBusiness.getByCode(item.data.code);
                    if (!product) {
                        await BusinessLoader.productBusiness.create(item.data);
                        console.log(`Product '${item.data.name}' has created.`);
                    }
                }
                catch (error) {
                    console.log(`Product '${item.data.name}' cannot create with error`, error);
                }
            }
        }

        console.log('\x1b[32m', `Initialize Products have done.`, '\x1b[0m');
    }

    async initRoles(): Promise<void> {
        let list = getRoles();
        // await DataCachingHelper.delete('/api/role/all');
        let products = await BusinessLoader.productBusiness.getAll();

        for (let i = 0; i < list.length; i++) {
            let item = list[i];

            if (item.isRequired || this.isRequired) {
                try {
                    let role = await BusinessLoader.roleBusiness.getByCode(item.data.code);
                    if (!role) {
                        // item.data.products = item.data.products.map(productType => {
                        //     let product = products.find(p => p.type === productType);
                        //     if (product)
                        //         return product._id;
                        //     else
                        //         return null;
                        // });
                        let productIds: any[] = [];
                        for (let i = 0; i < item.data.products.length; i++) {
                            let product = products.find(p => p.type === item.data.products[i]);
                            if (product)
                                productIds.push(product._id);
                        }
                        if (productIds.length) {
                            item.data.products = productIds;
                            await BusinessLoader.roleBusiness.create(item.data);
                            console.log(`Role '${item.data.name}' has created.`);
                        }
                    }
                }
                catch (error) {
                    console.log(`Role '${item.data.name}' cannot create with error`, error);
                }
            }
        }
        console.log('\x1b[32m', `Initialize roles have done.`, '\x1b[0m');
    }

    async initUsers(): Promise<void> {
        let list = getUsers();
        // await DataCachingHelper.delete('/api/user/all');

        for (let i = 0; i < list.length; i++) {
            let item = list[i];

            if (item.isRequired || this.isRequired) {
                try {
                    let user = await BusinessLoader.userBusiness.getByEmail(item.data.email.toLowerCase());
                    if (!user) {
                        await BusinessLoader.userBusiness.create(item.data);
                        console.log(`User '${item.data.email}' has created.`);
                    }
                }
                catch (error) {
                    console.log(`User '${item.data.email}' cannot create with error`, error);
                }
            }
        }

        console.log('\x1b[32m', `Initialize users have done.`, '\x1b[0m');
    }

    async initUserRoles(): Promise<void> {
        let list = getUserRoles();
        let products = await BusinessLoader.productBusiness.getAll();
        let roles = await BusinessLoader.roleBusiness.getAll();
        let managers = <any>[];

        for (let i = 0; i < list.length; i++) {
            let item = list[i];

            if (item.isRequired || this.isRequired) {
                try {
                    let user = await BusinessLoader.userBusiness.getByEmail(item.data.email);
                    let isUpdated = false;
                    if (user) {
                        if (!user.permission)
                            user.permission = <any>{};
                        if (!user.permission!.product)
                            user.permission!.product = null;
                        if (!user.permission!.role)
                            user.permission!.role = null;
                        if (!user.permission!.managers)
                            user.permission!.managers = [];

                        let product = products.find(product => product.code === item.data.permission.product);
                        if (product && !(user!.permission!.product === product!._id)) {
                            user!.permission!.product = product._id;
                            isUpdated = true;
                        }
                        let role = roles.find(role => role.code === item.data.permission.role);
                        if (role && !(user!.permission!.role === role!._id)) {
                            user!.permission!.role = role._id;
                            isUpdated = true;
                        }
                        for (let j = 0; j < item.data.permission.managers.length; j++) {
                            let email = item.data.permission.managers[j];
                            let manager = managers.find(manager => manager.email === email);

                            if (!manager) {
                                manager = await BusinessLoader.userBusiness.getByEmail(email);
                                if (manager)
                                    managers.push(manager);
                            }
                            if (manager && !user!.permission!.managers.find(managerId => managerId.toString() === manager!._id.toString())) {
                                user!.permission!.managers.push(manager._id);
                                isUpdated = true;
                            }
                        }
                        if (isUpdated) {
                            await BusinessLoader.userBusiness.update(user._id, user);
                            console.log(`User roles of '${user.email}' has created.`);
                        }
                    }
                }
                catch (error) {
                    console.log(`User roles of '${item.data.email}' failed to creare with error: `, error);
                }
            }
        }

        console.log('\x1b[32m', `Initialize user roles have done.`, '\x1b[0m');
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
        console.log('\x1b[32m', `Initialize Coa have done.`, '\x1b[0m');
    }

    async initProviders(): Promise<void> {
        let providers = getProviders();
        let exist = await BusinessLoader.yodleeBusiness.isProvidersExist(providers.data[0].name, providers.data[0].bankId);
        console.log(exist);
        if (!exist) {
            if (providers.isRequired) {
                BusinessLoader.yodleeBusiness.createProviders(providers.data);
            }
            console.log('\x1b[32m', `Initialize Providers have done.`, '\x1b[0m');
        }
    }

    async initFinancialStatements(userId: string): Promise<void> {
        if (!userId) {
            console.log('\x1b[32m', `Can't initialize Financial Statement.`, '\x1b[0m');
            return;
        }

        await this.initTransactions(userId);
        await this.initStatements(userId);
        await this.initCrunchs(userId);

        console.log('\x1b[32m', `Initialize Financial Statement have done`, '\x1b[0m');
    }

    async initTransactions(userId: string): Promise<void> {
        if (!userId) {
            console.log('\x1b[32m', `Initialize transactions have faild.`, '\x1b[0m');
            return;
        }

        await exec(`mongorestore --drop -d justdone_${process.env.NODE_ENV && process.env.NODE_ENV!.toLowerCase()} -c transactions ./src/resources/initialData/transactions.bson`, async (err, stdout, stderr) => {
            if (!err && stderr) {
                let transactions = await BusinessLoader.transactionBusiness.getAllTransactionByUserId('5b0eeed1f0b0ae5f9f9e0a11');
                let data = {
                    userId: userId,
                    bankId: 3531,
                    typeCrunch: null,
                    coaId: null
                };
                if (transactions.length) {
                    transactions.forEach(element => {
                        BusinessLoader.transactionBusiness.update(element._id, data);
                    });
                }
                console.log('\x1b[32m', `Initialize transactions have done.`, '\x1b[0m');
            }
        });
    }

    async initStatements(userId: string): Promise<void> {
        let year = new Date().getFullYear();
        let statements = getStatements();
        let result = statements.map(statement => {
            let statementCreate = new StatementCreate(statement as any);
            statementCreate.year = year;
            statementCreate.userId = userId;
            return statementCreate;
        });
        let data = await BusinessLoader.statementBusiness.getByUserId(userId);
        if (!data.length) {
            let i: number = 0;
            do {
                await BusinessLoader.statementBusiness.create(result[i]);
                i++;
            } while (i < result.length);
        }
        console.log('\x1b[32m', `Initialize statement have done.`, '\x1b[0m');
    }

    async initCrunchs(userId): Promise<void> {
        let year = new Date().getFullYear();
        let crunchs = getCrunch();
        let result = crunchs.map(crunch => {
            let crunchCreate = new CrunchCreate(crunch as any);
            crunchCreate.year = year;
            crunchCreate.userId = userId;
            return crunchCreate;
        });

        let data = await BusinessLoader.crunchBusiness.getByUserId(userId);
        if (!data.length) {
            let i: number = 0;
            do {
                await BusinessLoader.crunchBusiness.create(result[i]);
                i ++;
            } while (i < result.length);
        }
        console.log('\x1b[32m', `Initialize crunchs have done.`, '\x1b[0m');
    }

    async initAccounting(): Promise<void> {
        let list = getAccountings();

        for (let i = 0; i < list.length; i++) {
            let item = list[i];

            let user = await BusinessLoader.userBusiness.getByEmail('valadmin@justdone.com.au');
            if (user) {
                let data = {
                    userId: user._id,
                    beginYear: item.data.beginYear,
                    endYear: item.data.endYear,
                    monthlyAccounts: item.data.monthlyAccounts,
                    profitLoss: item.data.profitLoss,
                    balanceSheet: item.data.balanceSheet,
                    basQuarter: item.data.basQuarter,
                    basQuarter1: item.data.basQuarter1,
                    basQuarter2: item.data.basQuarter2,
                    basQuarter3: item.data.basQuarter3,
                    basQuarter4: item.data.basQuarter4,
                    taxReturn: item.data.taxReturn,
                    annualReport: item.data.annualReport
                };
                let isExist = await BusinessLoader.accountingBusiness.getAccountingByUser(user._id, item.data.beginYear, item.data.endYear);
                if ((item.isRequired || this.isRequired) && !isExist) {
                    await BusinessLoader.accountingBusiness.create(data);
                    console.log(`Accounting valadmin@justdone.com.au has created.`);
                }
            }
        }

        console.log('\x1b[32m', `Initialize accounting have done.`, '\x1b[0m');
    }
}

Object.seal(InitialData);
export default InitialData;
