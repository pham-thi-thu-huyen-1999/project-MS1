import BusinessLoader from '../../system/BusinessLoader';
import IStatementBusiness from './interfaces/IStatementBusiness'; // eslint-disable-line
import Statement from 'justdone-system-package/dest/app/model/statement/Statement';
import {BankType, RoleCode} from 'justdone-system-package/dest/app/model/common/CommonType';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import StatementRepository from 'justdone-system-package/dest/app/repository/StatementRepository';
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import module from 'justdone-system-package/dest/resources/permission/module';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';
import BankServiceHelper from 'justdone-system-package/dest/helpers/BankServiceHelper';
import StatementUpdate from 'justdone-system-package/dest/app/model/statement/StatementUpdate'; // eslint-disable-line

class StatementBusiness implements IStatementBusiness {
    private statementRepository: StatementRepository;
    constructor() {
        this.statementRepository = new StatementRepository();
    }

    async get(_id: string): Promise<Statement | null> {
        if (!_id)
            return null;

        let statement = await this.statementRepository.get(_id);
        return statement && new Statement(statement);
    }

    async getByEmail(email: string): Promise<any> {
        let user = await BusinessLoader.userBusiness.getByEmail(email.trim().toLowerCase());
        if (user) {
            let params = {
                query: <any>{
                    userId: DataHelper.toObjectId(user._id)
                }
            };
            return await this.statementRepository.findAll(params);
        }
        return [];
    }

    async getByUserId(userId: string): Promise<any> {
        if (!userId)
            return [];
        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(userId)
            }
        };
        return await this.statementRepository.findAll(params);
    }

    async create(data: Statement): Promise<any> {
        return await this.statementRepository.create(data);
    }

    async getStatementByFinaceYear(originId: string, userId: string, accountId: string, type: number, beginYear: number, endYear: number): Promise<Statement[]> {
        if (!originId || !accountId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.STATEMENT.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];
        let targetUser: any = await AuthorizationHelper.userService.get(userId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return [];
        if (!BankType[type])
            throw new ErrorCommon(101, 'Request');
        let user = await BusinessLoader.userBusiness.get(userId);
        if (!user || !user.permission)
            throw new ErrorCommon(101, 'Request');
        let product = await BusinessLoader.productBusiness.get(user.permission.product);
        if (!product)
            throw new ErrorCommon(101, 'Request');
        if (endYear <= beginYear || endYear > beginYear + 1)
            throw new ErrorCommon(203, 'statement_end_year', 'begin_year');

        let query;

        if (accountId) {
            query = {
                userId: DataHelper.toObjectId(userId),
                type: type,
                accountId: accountId,
                $or: [{
                    month: {
                        $gte: product.config.financialYear.beginMonth
                    },
                    year: {
                        $eq: beginYear
                    }
                }, {
                    month: {
                        $lte: product.config.financialYear.endMonth
                    },
                    year: {
                        $eq: endYear
                    }
                }]
            };
        }
        else {
            query = {
                userId: DataHelper.toObjectId(userId),
                type: type,
                $or: [{
                    month: {
                        $gte: product.config.financialYear.beginMonth
                    },
                    year: {
                        $eq: beginYear
                    }
                }, {
                    month: {
                        $lte: product.config.financialYear.endMonth
                    },
                    year: {
                        $eq: endYear
                    }
                }]
            };
        }

        let order = {
            year: -1,
            month: -1
        };

        let statements:any = await this.statementRepository.find({query: query}, order, 0, 12);
        let crunchs = await BusinessLoader.crunchBusiness.getFinalYearCrunchs(userId, accountId, type, beginYear);

        statements = Statement.parseArray(statements);
        statements = statements.map((statement : Statement) => {
            let crunch = crunchs.find(item => item.month === statement.month && item.year === statement.year && item.type === statement.type);
            let completedAt:any = null;
            if (crunch && crunch.completedAt)
                completedAt = crunch.completedAt;
            return {
                ...statement,
                completedAt
            };
        });
        for (let i = 0; i < statements.length; i++) {
            let totalTransactions = await BusinessLoader.transactionBusiness.getCountTransactions(originId, userId, statements[i].accountId, statements[i].type, statements[i].year, statements[i].month);
            statements[i].totalTransactions = totalTransactions;
        }

        return statements;
    }

    async getStatementOfClient(userId: string, originId: string, accountId: string, type: number, year: number, month: number): Promise<Statement | null> {
        if (!originId || !accountId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.STATEMENT.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return null;

        let targetUser: any = await AuthorizationHelper.userService.get(userId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return null;

        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                year: year,
                month: month,
                accountId: accountId,
            },
            populate: {
                path: 'userId',
                match: {
                    'permission.managers': {
                        $in: [DataHelper.toObjectId(originId)]
                    },
                },
                select: 'permission.managers',
            }
        };

        if (type)
            params.query.type = type;

        let statement = await this.statementRepository.findOne(params);
        return statement && new Statement(statement);
    }

    // Func Update OpenBalance and ManualStatement
    async updateOpenBalanceAndManual(originId: string, userId: string, accountId: string, type: number, year: number, month: number, openBalance: number): Promise<any> {
        let statement = await this.getStatementOfClient(userId, originId, accountId, type, year, month);

        let statementId;

        if (statement)
            statementId = statement ? statement._id : null;

        let dataUpdateOpen = {
            userId: userId,
            accountId: accountId,
            type: type,
            year: year,
            month: month,
            statementId: statementId,
            openBalance: openBalance ? openBalance : null,
            manualStatement: true,
            statementInit: true,
            changeInit: true
        };

        // call on func in this business and have change statementInit status
        let resultUpdateOpen = await this.updateStatementAndManual(dataUpdateOpen);

        if (resultUpdateOpen) {
            setTimeout(async () => {
                let result = await this.childFuncUpdateManualStatement(userId, originId, accountId, type, year, month);
                if (!result)
                    return false;
    
                let dataUpdateStatementMulti = {
                    userId: userId,
                    accountId: accountId,
                    month: month,
                    year: year,
                    type: type,
                    openBalance: openBalance
                };
                BankServiceHelper.updateOpenBalanceStatement(dataUpdateStatementMulti); 
            }, 2000);
        }

        return true;
    }

    async childFuncUpdateManualStatement(userId: string, originId: string, accountId: string, type: number, year: number, month: number): Promise<any> {
        for (let i = 0; i < 19; i++) {
            if (month === 13) {
                month = 1;
                year = year + 1;
                this.childFuncUpdateManualStatement(originId, userId, accountId, type, year, month);
                break;
            }

            let statementCheck = await this.getStatementOfClient(userId, originId, accountId, type, year, month);
            let statementId;

            if (statementCheck) {
                statementId = statementCheck._id;
                if (statementCheck.manualStatement === undefined) {
                    throw new ErrorCommon(108, "Manual Statement Status")
                }
            } else {
                console.log("End of Statement", userId, originId, accountId, type, year, month);
                return true;
            }

            let dataUpdateManualStatement = {
                userId: userId,
                accountId: accountId,
                type: type,
                year: year,
                month: month,
                statementId: statementId,
                manualStatement: false
            };

            let resultUpdateManual = await BankServiceHelper.updateStatement(dataUpdateManualStatement);

            if (!resultUpdateManual)
                return false;

            
            month += 1;
        }
        return true;
    }

    async updateStatementAndManual(data: any): Promise<any> {
        let statement = await this.get(data.statementId);
        let openOld;

        await this.statementRepository.findAndUpdateAll({userId: data.userId, accountId: data.accountId}, {statementInit: false});

        if (!statement)
            return false;

        if (statement)
            openOld = statement.openBalance;

        let dataUpdate = {
            openBalance: data.openBalance ? data.openBalance : openOld,
            manualStatement: data.manualStatement,
            statementInit: false
        };

        if (data.changeInit)
            dataUpdate.statementInit = true;

        console.log('dataUpdate =>>>>>>>>>>>>>>>>>.', dataUpdate);

        let resultUpdate = await this.update(statement._id, dataUpdate);

        if (!resultUpdate)
            return false;

        return true;
    }

    async update(_id: string, data: StatementUpdate): Promise<boolean> {
        return await this.statementRepository.update(_id, data);
    }

    // Check Connect Bank To Add Financial Year And Create Empty Statement

    async checkConnectBank(userId: string): Promise<any> {
        let resultConnect = await BusinessLoader.connectBankBusiness.find(userId, 0, 10);
        return resultConnect;
    }

    async createEmptyStatementOneByOneAccountId(originId: string, data: any): Promise<any> {
        if (!originId || !data)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return null;

        for (let i = 0; i < data.length; i++) {
            let user = await BusinessLoader.userBusiness.get(data[i].userId);

            if (user) {
                await BusinessLoader.transactionBusiness.findStartStatement(originId, user._id, data[i].accountId, data[i].type, user.financialStart, 7);
            }
        }
        return true;
    }

    async updateNameFiled(): Promise<boolean> {
        let statement = await this.statementRepository.updateNameField();
        if (!statement)
            return false;
        return true;
    }

    async deleteAllByUser(originId: string, clientId: string): Promise<boolean> {
        if (!originId)
            return false;

        let manager = await AuthorizationHelper.userService.get(originId);
        let roleSuperAdmin = await BusinessLoader.roleBusiness.getByCode(RoleCode.SuperAdmin);
        if (!manager || !manager.permission || !manager.permission.role || !roleSuperAdmin || manager.permission.role.toString() !== roleSuperAdmin._id)
            return false;

        let results = await this.statementRepository.findAll({query: {userId: DataHelper.toObjectId(clientId)}});
        for (let i = 0; i < results.length; i++) {
            await this.statementRepository.delete(results[i]._id, true);
        }
        return false;
    }
}

Object.seal(StatementBusiness);
export default StatementBusiness;
