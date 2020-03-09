import * as fs from 'fs'; // eslint-disable-line
import * as moment from 'moment';
import * as request from 'request';
import Project from '../../config/Project';
import Transaction from 'justdone-system-package/dest/app/model/transaction/Transaction'; // eslint-disable-line
import TransactionRepository from 'justdone-system-package/dest/app/repository/TransactionRepository';
import IReportBusiness from './interfaces/IReportBusiness'; // eslint-disable-line
import Crunch from 'justdone-system-package/dest/app/model/crunch/Crunch';// eslint-disable-line
import CrunchRepository from 'justdone-system-package/dest/app/repository/CrunchRepository';// eslint-disable-line
import { BankType, CrunchType, ReportSettingCode, GstType } from 'justdone-system-package/dest/app/model/common/CommonType'; // eslint-disable-line
import PdfHelper from 'justdone-system-package/dest/helpers/PdfHelper';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';// eslint-disable-line
import CsvHelper from 'justdone-system-package/dest/helpers/CsvHelper';
import BusinessLoader from '../../system/BusinessLoader';
import { ErrorCommon } from 'justdone-system-package/dest/app/model/common/Error'; // ErrorYodlee
import GoogleStorageHelper from 'justdone-system-package/dest/helpers/GoogleStorageHelper';
import TemplateCrunch from '../../resources/templates/documents/TemplateCrunch';
import TemplateYearCrunch from '../../resources/templates/documents/TemplateYearCrunch';
import TemplateDataReport from '../../resources/templates/documents/TemplateDataReport';
import TemplateDataReportCsv from '../../resources/templates/documents/TemplateDataReportCsv';
import TemplateProfitLossCsv from '../../resources/templates/documents/TemplateProfitLossCsv';
import TemplateTrialBalanceCsv from '../../resources/templates/documents/TemplateTrialBalanceCsv';// eslint-disable-line
import TemplateGstDetailCsv from '../../resources/templates/documents/TemplateGstDetailCsv';
//template balance sheet pdf
import TemplateBalanceSheet from '../../resources/templates/documents/TemplateBalanceSheet';
import TemplateBalanceSheetFromCsv from '../../resources/templates/documents/TemplateBalanceSheetFromCsv'; // eslint-disable-line
//get template balance sheet csv
import TemplateBalanceSheetCsv from '../../resources/templates/documents/TemplateBalanceSheetCsv';
import TemplateTrialBalance from '../../resources/templates/documents/TemplateTrialBalance'; // eslint-disable-line
import TemplateProfitLoss from '../../resources/templates/documents/TemplateProfitLoss';
import TemplateGst from '../../resources/templates/documents/TemplateGst';// eslint-disable-line
import TemplateGstDetail from '../../resources/templates/documents/TemplateGstDetail';// eslint-disable-line
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import module from 'justdone-system-package/dest/resources/permission/module';
import ProfitLossTemplate from 'justdone-system-package/dest/resources/template/profitLossTemplate'; // eslint-disable-line
import TemplateGstCsv from '../../resources/templates/documents/TemplateGstCsv';
import * as groupArray from 'group-array';
import DateHelper from 'justdone-system-package/dest/helpers/DateHelper';

class ReportBusiness implements IReportBusiness {
    private transactionRepository: TransactionRepository;
    private crunchRepository: CrunchRepository;

    constructor() {
        this.transactionRepository = new TransactionRepository();
        this.crunchRepository = new CrunchRepository();
    }

    async getCrunchStatus(userId: string, accountId: string, type: number, month: number, year: number): Promise<Crunch[]> {
        let params: any = {};
        params.query = {
            userId: userId,
            type: type,
            month: month,
            year: year,
            accountId: accountId
        };

        let crunchs = await this.crunchRepository.find(params);

        return crunchs;
    }

    async getCrunchFinalYearStatus(userId: string, accountId: string, type: number, beginMonth: number, endMonth: number, beginYear): Promise<Crunch[]> {
        let params: any = {};
        params.query = {
            userId: userId,
            type: type,
            accountId: accountId,
            $or: [{
                month: { $gte: beginMonth },
                year: beginYear
            }, {
                month: { $lte: endMonth },
                year: beginYear + 1
            }]
        };

        let crunchs = await this.crunchRepository.find(params, null, undefined, 12);
        return Crunch.parseArray(crunchs);
    }

    async getTransactionForReportFinal(userId: string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<Transaction[]> {
        const transactionReport = await BusinessLoader.transactionBusiness.getTransactionForReport(userId, accountId, beginMonth, beginYear, endMonth, endYear);
        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, beginMonth, beginYear, endMonth, endYear);
        // console.log('number GJ ==== >', newGJTransactions);
        const transactions = this.filterTransactions(transactionReport).concat(newGJTransactions);
        return transactions;
    }

    async getFinancialProfitAndLostPdfForMultibank(userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string> {
        let year = this.timeFilter(beginMonth, beginYear, endMonth, endYear);
        if (!userId)
            throw new ErrorCommon(102, 'userId');
        if (!beginMonth)
            throw new ErrorCommon(102, 'beginMonth');
        if (!beginYear)
            throw new ErrorCommon(102, 'beginYear');
        if (!endMonth)
            throw new ErrorCommon(102, 'endMonth');
        if (!endYear)
            throw new ErrorCommon(102, 'endYear');
        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');
        let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(userId);
        if (!connectBank.length)
            throw new ErrorCommon(102, 'connectBank');

        let connectBankIds = connectBank.map(item => String(item.accountId));
        connectBankIds = connectBankIds.filter(item => item);

        let transactions = await BusinessLoader.transactionBusiness.getTransactionManyBankForReport(userId, connectBankIds, beginMonth, beginYear, endMonth, endYear);
        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, beginMonth, beginYear, endMonth, endYear);

        // This line co bien -> remove coa code 6-5100, 6-5200
        // const transactionData = this.filterTransactions(transactions).concat(newGJTransactions);

        const transactionData = transactions.concat(newGJTransactions);

        let template = await this.caculatorReportProfitAndLost(transactionData, userId, year);  // eslint-disable-line
        template.user = user;
        user.abnCode = user.businessInfo && user.businessInfo.abnCode ? user.businessInfo.abnCode : '';
        template.filter = { beginMonth: beginMonth, beginYear: beginYear, endMonth: endMonth, endYear: endYear };
        let fullNameClient = template.user.fullName;
        let dateExport = `01 ${this.convertMonth(beginMonth)} ${beginYear} through ${DateHelper.getDateEndMonth(Number(endMonth), Number(endYear))} ${this.convertMonth(endMonth)} ${endYear}`;
        let title = template.name;
        let name = fullNameClient + ' - ' + title + ' ' + dateExport;

        let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.pdf'; // Address and name for new pdf invoice fle

        let options = this.getOptionRender(title);
        let html = ``;
        html = this.createReportProfitAndLoss(template, false);

        await PdfHelper.createPdf(html, options, localFile);
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, year.toString(), 'bank');

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, name, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;
    }

    async getPreviewFinancialProfitAndLostPdfForMultibank(userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string> {
        let year = this.timeFilter(beginMonth, beginYear, endMonth, endYear);
        if (!userId)
            throw new ErrorCommon(102, 'userId');
        if (!beginMonth)
            throw new ErrorCommon(102, 'beginMonth');
        if (!beginYear)
            throw new ErrorCommon(102, 'beginYear');
        if (!endMonth)
            throw new ErrorCommon(102, 'endMonth');
        if (!endYear)
            throw new ErrorCommon(102, 'endYear');
        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');
        let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(userId);
        if (!connectBank.length)
            throw new ErrorCommon(102, 'connectBank');

        let connectBankIds = connectBank.map(item => String(item.accountId));
        connectBankIds = connectBankIds.filter(item => item);

        let transactions = await BusinessLoader.transactionBusiness.getTransactionManyBankForReport(userId, connectBankIds, beginMonth, beginYear, endMonth, endYear);
        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, beginMonth, beginYear, endMonth, endYear);

         // This line co bien -> remove coa code 6-5100, 6-5200
        // const transactionData = this.filterTransactions(transactions).concat(newGJTransactions);

        const transactionData = transactions.concat(newGJTransactions);

        let template = await this.caculatorReportProfitAndLost(transactionData, userId, year);  // eslint-disable-line
        template.user = user;
        user.abnCode = user.businessInfo && user.businessInfo.abnCode ? user.businessInfo.abnCode : '';
        template.filter = { beginMonth: beginMonth, beginYear: beginYear, endMonth: endMonth, endYear: endYear };
        let html = ``;
        html = this.createReportProfitAndLoss(template, true);

        return html;
    }

    /**
     * Final Profit And Loss
     * @param userId
     * @param beginMonth
     * @param beginYear
     * @param endMonth
     * @param endYear
     */
    async getFinancialProfitAndLostPDF(userId: string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string> {
        const template = await this.getTemplateProfitAndLost(userId, accountId, beginMonth, beginYear, endMonth, endYear);
        let title = template.name;
        let name = title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and');

        let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.pdf'; // Address and name for new pdf invoice fle

        let options = this.getOptionRender(title);
        let html = ``;
        console.log('template ===============>', JSON.stringify(template));
        html = this.createReportProfitAndLoss(template, false);

        await PdfHelper.createPdf(html, options, localFile);
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, beginYear.toString(), 'bank');

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, name, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;
    }

    async getFinancialProfitAndLostCsvForMultibank(userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string> {
        let year = this.timeFilter(beginMonth, beginYear, endMonth, endYear);
        if (!userId)
            throw new ErrorCommon(102, 'userId');
        if (!beginMonth)
            throw new ErrorCommon(102, 'beginMonth');
        if (!beginYear)
            throw new ErrorCommon(102, 'beginYear');
        if (!endMonth)
            throw new ErrorCommon(102, 'endMonth');
        if (!endYear)
            throw new ErrorCommon(102, 'endYear');

        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');

        let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(userId);
        if (!connectBank.length)
            throw new ErrorCommon(102, 'connectBank');

        let connectBankIds = connectBank.map(item => String(item.accountId));
        connectBankIds = connectBankIds.filter(item => item);

        let transactions = await BusinessLoader.transactionBusiness.getTransactionManyBankForReport(userId, connectBankIds, beginMonth, beginYear, endMonth, endYear);
        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, beginMonth, beginYear, endMonth, endYear);
        const transactionData = this.filterTransactions(transactions).concat(newGJTransactions);

        let template = await this.caculatorReportProfitAndLost(transactionData, userId, year);
        template.user = user;
        user.abnCode = user.businessInfo && user.businessInfo.abnCode ? user.businessInfo.abnCode : '';
        template.filter = { beginMonth: beginMonth, beginYear: beginYear, endMonth: endMonth, endYear: endYear };

        let fullNameClient = template.user.fullName;
        let dateExport = `01 ${this.convertMonth(beginMonth)} ${beginYear} through ${DateHelper.getDateEndMonth(Number(endMonth), Number(endYear))} ${this.convertMonth(endMonth)} ${endYear}`;

        let title = template.name;
        let name = fullNameClient + ' - ' + title + ' ' + dateExport;

        const csvContent = new TemplateProfitLossCsv(template);
        let fileName = `${name}.csv`;

        let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.csv'; // Address and name for new csv invoice fle
        fs.writeFileSync(localFile, csvContent.renderCsvContent());
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, year.toString(), 'bank');

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, fileName, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;
    }

    async getFinancialProfitAndLostCsv(userId: string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string> {
        const template = await this.getTemplateProfitAndLost(userId, accountId, beginMonth, beginYear, endMonth, endYear);
        let title = template.name;
        let name = title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and');

        const csvContent = new TemplateProfitLossCsv(template);
        let fileName = `${beginMonth}_${beginYear}-${endMonth}_${endYear}_${name}.csv`;

        let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.csv'; // Address and name for new csv invoice fle
        fs.writeFileSync(localFile, csvContent.renderCsvContent());
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, beginYear.toString(), 'bank');

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, fileName, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;;
    }

    async getTemplateProfitAndLost(userId: string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<any> {
        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');
        const transactions = await this.getTransactionForReportFinal(userId, accountId, beginMonth, beginYear, endMonth, endYear);
        let template = await this.caculatorReportProfitAndLost(transactions, userId, beginYear);

        template.user = user;
        user.abnCode = user.businessInfo && user.businessInfo.abnCode ? user.businessInfo.abnCode : '';
        template.filter = { beginMonth: beginMonth, beginYear: beginYear, endMonth: endMonth, endYear: endYear };
        return template;
    }

    filterTransactions(transactions: Transaction[]): Transaction[] {
        const listRemove = [
            '6-5100',
            '6-5200'
        ];

        return transactions.filter(transaction => {
            const code = transaction.coaId && transaction.coaId.code ? transaction.coaId.code : '';
            if (code)
                return !listRemove.includes(code);
            else
                return true;
        });
    }

    async getFinancialTrialBalanceCSVForMultibank(managerId: string, userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string> {
        let queryBeginMonth = beginMonth;
        let queryBeginYear = beginYear;
        let queryEndMonth = endMonth;
        let queryEndYear = endYear;

        queryBeginMonth = 7;
        if (endMonth < 7) {
            queryBeginYear = endYear - 1;
            queryEndYear = endYear;
        }

        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');
        
        let statements = await BusinessLoader.statementBusiness.getStatementOfClientforBalanceSheetReport(userId, managerId, beginYear, beginMonth);
        if (!statements.length)
            throw new ErrorCommon(102, 'Statement');

        let totalHistoricalBankAccounts = 0;
        let totalHistoricalCCAcounts = 0;

        // calc statement on one month
        for (let i = 0; i < statements.length; i++) {
            let item = statements[i];
            // make sure this statement in connectBank
            let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(userId, item.accountId);
            if (!connectBank)
                continue;

            else {
                if (connectBank.type === BankType.Bank) {
                    totalHistoricalBankAccounts += item.openBalance;
                }
                else if (connectBank.type === BankType.CreditCard) {
                    totalHistoricalCCAcounts += item.openBalance;
                }
            }
        }

        // console.log('totalHistoricalBankAccounts totalHistoricalBankAccounts =>',totalHistoricalBankAccounts);
        // console.log('totalHistoricalCCAcounts totalHistoricalCCAcounts =>', totalHistoricalCCAcounts);
        let totalHistoricalBalancingAccounts = totalHistoricalBankAccounts - totalHistoricalCCAcounts;
        // console.log('totalHistoricalBalancingAccounts =>>>>>>>>>>>>>>', totalHistoricalBalancingAccounts);

        // console.log(queryBeginMonth, queryBeginYear, queryEndMonth, queryEndYear);
        // let statementYTD = await BusinessLoader.statementBusiness.getStatementForYTD(userId, queryBeginMonth, queryBeginYear, queryEndMonth, queryEndYear);
        let coaOpeningBalance = await BusinessLoader.userBusiness.getUserChartAccountOpeningBalance(user._id);
        let hisBalanceAccountsPoint = await BusinessLoader.statementBusiness.getStatementOfClientforBalanceSheetReport(userId, managerId, coaOpeningBalance.year, coaOpeningBalance.month);

        // console.log('statementYTD =>>>>>>>>>>>>>>>>>>>>>>>>>>>', statementYTD);

        let totalHistoricalCCYTD = 0;
        let totalHistoricalBankYTD = 0;
        // calc all statements in year
        // for (let i = 0; i < statementYTD.length; i++) {
        //     let item = statementYTD[i];
        //     // make sure this statement in connectBank
        //     let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(userId, item.accountId);
        //     if (!connectBank)
        //         continue;

        //     else {
        //         if (connectBank.type === BankType.Bank) {
        //             totalHistoricalBankYTD += item.openBalance;
        //         }
        //         else if (connectBank.type === BankType.CreditCard) {
        //             totalHistoricalCCYTD += item.openBalance;
        //         }
        //     }
        // }
        for (let i = 0; i < hisBalanceAccountsPoint.length; i++) {
            let item = hisBalanceAccountsPoint[i];
            // make sure this statement in connectBank
            let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(userId, item.accountId);
            if (!connectBank)
                continue;

            else {
                if (connectBank.type === BankType.Bank) {
                    totalHistoricalBankYTD += item.openBalance;
                }
                else if (connectBank.type === BankType.CreditCard) {
                    totalHistoricalCCYTD += item.openBalance;
                }
            }
        }
        // console.log('totalHistoricalBankYTD totalHistoricalBankYTD =>',totalHistoricalBankYTD);
        // console.log('totalHistoricalCCYTD totalHistoricalCCYTD =>', totalHistoricalCCYTD);
        let totalHistoricalBalanceYTD = totalHistoricalBankYTD - totalHistoricalCCYTD;
        // console.log('totalHistoricalBalanceYTD =>>>>>>>>>>>>>>>>', totalHistoricalBalanceYTD);

        let totalHistoricalTemp: any = {};
        let totalYTDTemp: any = {};

        if (totalHistoricalBalancingAccounts > 0) {
            let temps =  {
                isCredit: true,
                amount: totalHistoricalBalancingAccounts
            }
            let YTDtemp = {
                isCredit: true,
                amount: totalHistoricalBalanceYTD
            }
            totalHistoricalTemp = temps;
            totalYTDTemp = YTDtemp;
        }
        else {
            let temps =  {
                isCredit: false,
                amount: totalHistoricalBalancingAccounts
            }
            let YTDtemp = {
                isCredit: false,
                amount: totalHistoricalBalanceYTD
            }
            totalHistoricalTemp = temps;
            totalYTDTemp = YTDtemp;
        }

        let hisBalanceAccounts = {
            coa: {
                name: 'Historical Balancing Accounts',
                _id: null
            },
            total: totalHistoricalTemp,
            totalYTD: totalYTDTemp
        }

        let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(userId);
        if (!connectBank.length)
            throw new ErrorCommon(102, 'connectBank');

        let connectBankIds = connectBank.map(item => String(item.accountId));
        connectBankIds = connectBankIds.filter(item => item);

        let transactions = await BusinessLoader.transactionBusiness.getTransactionManyBankForReport(userId, connectBankIds, queryBeginMonth, queryBeginYear, queryEndMonth, queryEndYear);
        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, queryBeginMonth, queryBeginYear, queryEndMonth, queryEndYear);
        const transactionData = this.filterTransactions(transactions).concat(newGJTransactions);
        // let transactions = await this.getTransactionForReportFinal(userId, accountId, queryBeginMonth, queryBeginYear, queryEndMonth, queryEndYear);
        let template: any = {};

        template.user = user;
        user.abnCode = user.businessInfo && user.businessInfo.abnCode ? user.businessInfo.abnCode : '';
        template.filter = { beginMonth: beginMonth, beginYear: beginYear, endMonth: endMonth, endYear: endYear };
        template.listCoa = await this.createReportTrialBalance(userId, managerId, transactionData, beginMonth, beginYear, endMonth, endYear);
        template.listCoa.push(hisBalanceAccounts);
        template.name = 'Trial Balance';
        let title = template.name;
        let name = title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and');

        const csvContent = new TemplateTrialBalanceCsv(template);
        let fileName = `${beginMonth}_${beginYear}-${endMonth}_${endYear}_${name}.csv`;

        let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.csv'; // Address and name for new csv invoice fle
        fs.writeFileSync(localFile, csvContent.renderCsvContent());
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, beginYear.toString(), 'bank');

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, fileName, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;;
    }

    /**
     * Final Trial Balance
     * @param userId
     * @param beginMonth
     * @param beginYear
     * @param endMonth
     * @param endYear
     */
    async getFinancialTrialBalanceCSV(userId: string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<Transaction> {
        const template = await this.getTemplateFinancialTrialBalance(userId, accountId, beginMonth, beginYear, endMonth, endYear);
        let title = template.name;
        let name = title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and');

        const csvContent = new TemplateTrialBalanceCsv(template);
        let fileName = `${beginMonth}_${beginYear}-${endMonth}_${endYear}_${name}.csv`;

        let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.csv'; // Address and name for new csv invoice fle
        fs.writeFileSync(localFile, csvContent.renderCsvContent());
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, beginYear.toString(), 'bank');

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, fileName, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;;
    }

    // get preview trial-balance

    async getPreviewFinancialTrialBalancePdfForMultibank(managerId: string, userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string> {
        let queryBeginMonth = beginMonth;
        let queryBeginYear = beginYear;
        let queryEndMonth = endMonth;
        let queryEndYear = endYear;
        queryBeginMonth = 7;
        if (endMonth < 7) {
            queryBeginYear = endYear - 1;
            queryEndYear = endYear;
        }

        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');
        
        let hisBalanceAccounts = await this.calcHistoricalBalance(managerId, userId, beginMonth, beginYear, endMonth, endYear);

        let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(userId);
        if (!connectBank.length)
            throw new ErrorCommon(102, 'connectBank');

        let connectBankIds = connectBank.map(item => String(item.accountId));
        connectBankIds = connectBankIds.filter(item => item);

        let transactions = await BusinessLoader.transactionBusiness.getTransactionManyBankForReport(userId, connectBankIds, queryBeginMonth, queryBeginYear, queryEndMonth, queryEndYear);
        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, queryBeginMonth, queryBeginYear, queryEndMonth, queryEndYear);
        const transactionData = this.filterTransactions(transactions).concat(newGJTransactions);
        console.log('transactionData =>>>>>>>>>>>>>>>>>>', transactionData);

        let template: any = {};
        template.user = user;
        user.abnCode = user.businessInfo && user.businessInfo.abnCode ? user.businessInfo.abnCode : '';
        template.filter = { beginMonth: beginMonth, beginYear: beginYear, endMonth: endMonth, endYear: endYear };
        template.listCoa = await this.createReportTrialBalance(userId, managerId, transactionData, beginMonth, beginYear, endMonth, endYear);
        template.listCoa.push(hisBalanceAccounts);
        template.name = 'Trial Balance';
        let html = this.createTrialBalancePDF(template, true);
        return html;
    }

    async getFinancialTrialBalancePDFForMultibank(managerId: string, userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string> {
        let queryBeginMonth = beginMonth;
        let queryBeginYear = beginYear;
        let queryEndMonth = endMonth;
        let queryEndYear = endYear;
        queryBeginMonth = 7;
        if (endMonth < 7) {
            queryBeginYear = endYear - 1;
            queryEndYear = endYear;
        }

        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');
        
        // calc historicalBanlancingAccounts and return {} coa
        let hisBalanceAccounts = await this.calcHistoricalBalance(managerId, userId, beginMonth, beginYear, endMonth, endYear);

        let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(userId);
        if (!connectBank.length)
            throw new ErrorCommon(102, 'connectBank');

        let connectBankIds = connectBank.map(item => String(item.accountId));
        connectBankIds = connectBankIds.filter(item => item);

        let transactions = await BusinessLoader.transactionBusiness.getTransactionManyBankForReport(userId, connectBankIds, queryBeginMonth, queryBeginYear, queryEndMonth, queryEndYear);
        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, queryBeginMonth, queryBeginYear, queryEndMonth, queryEndYear);
        const transactionData = this.filterTransactions(transactions).concat(newGJTransactions);
        console.log('transactionData =>>>>>>>>>>>>>>>>>>', transactionData);

        let template: any = {};
        template.user = user;
        user.abnCode = user.businessInfo && user.businessInfo.abnCode ? user.businessInfo.abnCode : '';
        template.filter = { beginMonth: beginMonth, beginYear: beginYear, endMonth: endMonth, endYear: endYear };
        template.listCoa = await this.createReportTrialBalance(userId, managerId, transactionData, beginMonth, beginYear, endMonth, endYear);
        template.listCoa.push(hisBalanceAccounts);
        template.name = 'Trial Balance';
        let title = template.name;
        let name = title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and');
        console.log('template ====>', template.listCoa);
        let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.pdf'; // Address and name for new pdf invoice fle
        let options = this.getOptionRender(title);
        let html = this.createTrialBalancePDF(template, false);
        await PdfHelper.createPdf(html, options, localFile);
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, beginYear.toString(), 'bank');

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, name, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;
    }

    async calcHistoricalBalance(managerId: string, userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<any> {
        let queryBeginMonth = beginMonth;
        let queryBeginYear = beginYear;
        let queryEndMonth = endMonth;
        let queryEndYear = endYear;
        queryBeginMonth = 7;
        if (endMonth < 7) {
            queryBeginYear = endYear - 1;
            queryEndYear = endYear;
        }

        // let statements = await BusinessLoader.statementBusiness.getStatementOfClientforBalanceSheetReport(userId, managerId, beginYear, beginMonth);
        // if (!statements.length)
        //     throw new ErrorCommon(102, 'Statement');

        // let totalHistoricalBankAccounts = 0;
        // let totalHistoricalCCAcounts = 0;

        // // calc statement on one month
        // for (let i = 0; i < statements.length; i++) {
        //     let item = statements[i];
        //     // make sure this statement in connectBank
        //     let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(userId, item.accountId);
        //     if (!connectBank)
        //         continue;

        //     else {
        //         if (connectBank.type === BankType.Bank) {
        //             totalHistoricalBankAccounts += item.openBalance;
        //         }
        //         else if (connectBank.type === BankType.CreditCard) {
        //             totalHistoricalCCAcounts += item.openBalance;
        //         }
        //     }
        // }

        // // console.log('totalHistoricalBankAccounts totalHistoricalBankAccounts =>',totalHistoricalBankAccounts);
        // // console.log('totalHistoricalCCAcounts totalHistoricalCCAcounts =>', totalHistoricalCCAcounts);
        // let totalHistoricalBalancingAccounts = totalHistoricalBankAccounts - totalHistoricalCCAcounts;
        // console.log('totalHistoricalBalancingAccounts =>>>>>>>>>>>>>>', totalHistoricalBalancingAccounts);

        // console.log(queryBeginMonth, queryBeginYear, queryEndMonth, queryEndYear);
        // let statementYTD = await BusinessLoader.statementBusiness.getStatementForYTD(userId, queryBeginMonth, queryBeginYear, queryEndMonth, queryEndYear);
        let coaOpeningBalance = await BusinessLoader.userBusiness.getUserChartAccountOpeningBalance(userId);
        let hisBalanceAccountsPoint = await BusinessLoader.statementBusiness.getStatementOfClientforBalanceSheetReport(userId, managerId, coaOpeningBalance.year, coaOpeningBalance.month);

        // console.log('statementYTD =>>>>>>>>>>>>>>>>>>>>>>>>>>>', statementYTD);
        let totalHistoricalBankAccounts = 0;
        let totalHistoricalCCAcounts = 0;
        let totalHistoricalCCYTD = 0;
        let totalHistoricalBankYTD = 0;
        // calc all statements in year
        for (let i = 0; i < hisBalanceAccountsPoint.length; i++) {
            let item = hisBalanceAccountsPoint[i];
            // make sure this statement in connectBank
            let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(userId, item.accountId);
            if (!connectBank)
                continue;

            else {
                if (connectBank.type === BankType.Bank) {
                    totalHistoricalBankYTD += item.openBalance;
                    totalHistoricalBankAccounts += item.openBalance;
                }
                else if (connectBank.type === BankType.CreditCard) {
                    totalHistoricalCCYTD += item.openBalance;
                    totalHistoricalCCAcounts += item.openBalance;
                }
            }
        }
        // console.log('totalHistoricalBankYTD totalHistoricalBankYTD =>',totalHistoricalBankYTD);
        // console.log('totalHistoricalCCYTD totalHistoricalCCYTD =>', totalHistoricalCCYTD);
        let totalHistoricalBalanceYTD = totalHistoricalBankYTD - totalHistoricalCCYTD;
        let totalHistoricalBalancingAccounts = totalHistoricalBankAccounts - totalHistoricalCCAcounts;
        // console.log('totalHistoricalBalanceYTD =>>>>>>>>>>>>>>>>', totalHistoricalBalanceYTD);

        let totalHistoricalTemp: any = {};
        let totalYTDTemp: any = {};

        if (totalHistoricalBalancingAccounts > 0) {
            let temps =  {
                isCredit: true,
                amount: 0
            }
            let YTDtemp = {
                isCredit: true,
                amount: totalHistoricalBalanceYTD
            }
            totalHistoricalTemp = temps;
            totalYTDTemp = YTDtemp;
        }
        else {
            let temps =  {
                isCredit: false,
                amount: 0
            }
            let YTDtemp = {
                isCredit: false,
                amount: totalHistoricalBalanceYTD
            }
            totalHistoricalTemp = temps;
            totalYTDTemp = YTDtemp;
        }

        let hisBalanceAccounts = {
            coa: {
                name: 'Historical Balancing Accounts',
                _id: null,
                coaCode: '3-9999'
            },
            total: totalHistoricalTemp,
            totalYTD: totalYTDTemp
        }

        console.log('=>>>>>>>>>>>>>>>. hisBalanceAccounts : ', hisBalanceAccounts);

        return hisBalanceAccounts;
    }

    async getFinancialTrialBalancePDF(userId: string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<Transaction> {
        const template = await this.getTemplateFinancialTrialBalance(userId, accountId, beginMonth, beginYear, endMonth, endYear);
        let title = template.name;
        let name = title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and');
        console.log('template ====>', JSON.stringify(template));
        let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.pdf'; // Address and name for new pdf invoice fle
        let options = this.getOptionRender(title);
        let html = this.createTrialBalancePDF(template, false);
        await PdfHelper.createPdf(html, options, localFile);
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, beginYear.toString(), 'bank');

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, name, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;
    }

    async getTemplateFinancialTrialBalance(userId: string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<any> {
        let queryBeginMonth = beginMonth;
        let queryBeginYear = beginYear;
        let queryEndMonth = endMonth;
        let queryEndYear = endYear;

        queryBeginMonth = 7;
        if (endMonth < 7) {
            queryBeginYear = endYear - 1;
            queryEndYear = endYear;
        }

        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');

        let transactions = await this.getTransactionForReportFinal(userId, accountId, queryBeginMonth, queryBeginYear, queryEndMonth, queryEndYear);
        let template: any = {};

        template.user = user;
        user.abnCode = user.businessInfo && user.businessInfo.abnCode ? user.businessInfo.abnCode : '';
        template.filter = { beginMonth: beginMonth, beginYear: beginYear, endMonth: endMonth, endYear: endYear };
        template.listCoa = await this.createReportTrialBalance(userId, userId, transactions, beginMonth, beginYear, endMonth, endYear);
        template.name = 'Trial Balance';
        return template;
    }

    /**
     * Final GST Report
     * @param userId
     * @param beginMonth
     * @param beginYear
     * @param endMonth
     * @param endYear
     */
    async getFinancialGstPdfForMultibank(userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string> {
        console.log('beginMonth', beginMonth);
        console.log('beginYear', beginYear);
        console.log('endMonth', endMonth);
        console.log('endYear', endYear);
        let year = this.timeFilter(beginMonth, beginYear, endMonth, endYear);
        if (!userId)
            throw new ErrorCommon(102, 'userId');
        if (!beginMonth)
            throw new ErrorCommon(102, 'beginMonth');
        if (!beginYear)
            throw new ErrorCommon(102, 'beginYear');
        if (!endMonth)
            throw new ErrorCommon(102, 'endMonth');
        if (!endYear)
            throw new ErrorCommon(102, 'endYear');

        // Get all connectBank of this user
        let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(userId);
        if (!connectBank.length)
            throw new ErrorCommon(102, 'connectBank');

        let connectBankIds = connectBank.map(item => String(item.accountId));
        connectBankIds = connectBankIds.filter(item => item);

        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');

        let transactions = await BusinessLoader.transactionBusiness.getTransactionManyBankForReport(userId, connectBankIds, beginMonth, beginYear, endMonth, endYear);
        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, beginMonth, beginYear, endMonth, endYear);
        const transactionData = this.filterTransactions(transactions).concat(newGJTransactions);

        // let user: any = await BusinessLoader.userBusiness.get(userId);
        // if (!user)
        //     throw new ErrorCommon(102, 'Client');

        // let transactions: any[] = [];
        // for (let i = 0; i < connectBank.length; i++) {
        //     let accountId = connectBank[i].accountId;
        //     if (!accountId)
        //         throw new ErrorCommon(102, 'accountId');

        //     const transactionReport = await BusinessLoader.transactionBusiness.getTransactionForReport(userId, String(accountId), beginMonth, beginYear, endMonth, endYear);
        //     // let dataTransactions = await this.getTransactionForReportFinal(userId, String(accountId), beginMonth, beginYear, endMonth, endYear);
        //     transactions = transactions.concat(transactionReport);
        // }

        // const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, beginMonth, beginYear, endMonth, endYear);
        // const transactionData = this.filterTransactions(transactions).concat(newGJTransactions);

        let template: any = {};
        template.user = user;
        user.abnCode = user.businessInfo && user.businessInfo.abnCode ? user.businessInfo.abnCode : '';
        template.filter = { beginMonth: beginMonth, beginYear: beginYear, endMonth: endMonth, endYear: endYear };
        template.data = await this.createReportGST(transactionData, userId, year);
        template.name = 'GST';

        let title = template.name;
        let name = title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and');

        let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.pdf'; // Address and name for new pdf invoice fle

        let options = this.getOptionRender(title);
        let html = ``;
        // console.log('template ================>', JSON.stringify(template.data));
        html = this.createReportGstPDF(template, false);

        await PdfHelper.createPdf(html, options, localFile);
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, year.toString(), 'bank');

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, name, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;
    }
    async getPreviewFinancialGstPdfMultibank(userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string> {
        console.log('beginMonth', beginMonth);
        console.log('beginYear', beginYear);
        console.log('endMonth', endMonth);
        console.log('endYear', endYear);
        let year = this.timeFilter(beginMonth, beginYear, endMonth, endYear);
        if (!userId)
            throw new ErrorCommon(102, 'userId');
        if (!beginMonth)
            throw new ErrorCommon(102, 'beginMonth');
        if (!beginYear)
            throw new ErrorCommon(102, 'beginYear');
        if (!endMonth)
            throw new ErrorCommon(102, 'endMonth');
        if (!endYear)
            throw new ErrorCommon(102, 'endYear');

        // Get all connectBank of this user
        let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(userId);
        if (!connectBank.length)
            throw new ErrorCommon(102, 'connectBank');

        let connectBankIds = connectBank.map(item => String(item.accountId));
        connectBankIds = connectBankIds.filter(item => item);

        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');

        let transactions = await BusinessLoader.transactionBusiness.getTransactionManyBankForReport(userId, connectBankIds, beginMonth, beginYear, endMonth, endYear);
        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, beginMonth, beginYear, endMonth, endYear);
        const transactionData = this.filterTransactions(transactions).concat(newGJTransactions);

        let template: any = {};
        template.user = user;
        user.abnCode = user.businessInfo && user.businessInfo.abnCode ? user.businessInfo.abnCode : '';
        template.filter = { beginMonth: beginMonth, beginYear: beginYear, endMonth: endMonth, endYear: endYear };
        template.data = await this.createReportGST(transactionData, userId, year);
        template.name = 'GST';

        let title = template.name;
        
        let html = ``;
        html = this.createReportGstPDF(template, true);
        
        return html;
        
    }


    async getFinancialGstCsvForMultibank(userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string> {
        let year = this.timeFilter(beginMonth, beginYear, endMonth, endYear);
        if (!userId)
            throw new ErrorCommon(102, 'userId');
        if (!beginMonth)
            throw new ErrorCommon(102, 'beginMonth');
        if (!beginYear)
            throw new ErrorCommon(102, 'beginYear');
        if (!endMonth)
            throw new ErrorCommon(102, 'endMonth');
        if (!endYear)
            throw new ErrorCommon(102, 'endYear');

        // Get all connectBank of this user
        let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(userId);
        if (!connectBank.length)
            throw new ErrorCommon(102, 'connectBank');

        let connectBankIds = connectBank.map(item => String(item.accountId));
        connectBankIds = connectBankIds.filter(item => item);

        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');

        let transactions = await BusinessLoader.transactionBusiness.getTransactionManyBankForReport(userId, connectBankIds, beginMonth, beginYear, endMonth, endYear);
        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, beginMonth, beginYear, endMonth, endYear);
        const transactionData = this.filterTransactions(transactions).concat(newGJTransactions);

        let template: any = {};
        template.user = user;
        user.abnCode = user.businessInfo && user.businessInfo.abnCode ? user.businessInfo.abnCode : '';
        template.filter = { beginMonth: beginMonth, beginYear: beginYear, endMonth: endMonth, endYear: endYear };
        template.data = await this.createReportGST(transactionData, userId, year);
        template.name = 'GST';

        let title = template.name;
        let name = title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and');
        const csvContent = new TemplateGstCsv(template);
        let fileName = `${beginMonth}_${beginYear}-${endMonth}_${endYear}_${name}.csv`;

        let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.csv'; // Address and name for new csv invoice fle
        fs.writeFileSync(localFile, csvContent.renderCsvContent());
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, year.toString(), 'bank');

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, fileName, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;
    }

    async getFinancialGstPdf(userId: string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<Transaction> {
        const template = await this.getTemplateFinalGst(userId, accountId, beginMonth, beginYear, endMonth, endYear);
        let title = template.name;
        let name = title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and');

        let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.pdf'; // Address and name for new pdf invoice fle

        let options = this.getOptionRender(title);
        let html = ``;
        // console.log('template ================>', JSON.stringify(template.data));
        html = this.createReportGstPDF(template, false);

        await PdfHelper.createPdf(html, options, localFile);
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, beginYear.toString(), 'bank');

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, name, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;
    }

    async getFinancialGstCsv(userId: string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<any> {
        const template = await this.getTemplateFinalGst(userId, accountId, beginMonth, beginYear, endMonth, endYear);
        let title = template.name;
        let name = title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and');
        const csvContent = new TemplateGstCsv(template);
        let fileName = `${beginMonth}_${beginYear}-${endMonth}_${endYear}_${name}.csv`;

        let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.csv'; // Address and name for new csv invoice fle
        fs.writeFileSync(localFile, csvContent.renderCsvContent());
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, beginYear.toString(), 'bank');

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, fileName, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;
    }

    async getTemplateFinalGst(userId: string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<any> {
        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');

        let transactions = await this.getTransactionForReportFinal(userId, accountId, beginMonth, beginYear, endMonth, endYear);
        let template: any = {};
        template.user = user;
        user.abnCode = user.businessInfo && user.businessInfo.abnCode ? user.businessInfo.abnCode : '';
        template.filter = { beginMonth: beginMonth, beginYear: beginYear, endMonth: endMonth, endYear: endYear };
        template.data = await this.createReportGST(transactions, userId, beginYear);
        template.name = 'GST';
        return template;
    }

    /**
     * Final GST Detail PDF
     * @param userId
     * @param beginMonth
     * @param beginYear
     * @param endMonth
     * @param endYear
     */

    async getFinancialGstDetailPdfForMultiBank(userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string> {
        let year = this.timeFilter(beginMonth, beginYear, endMonth, endYear);
        if (!userId)
            throw new ErrorCommon(102, 'userId');
        if (!beginMonth)
            throw new ErrorCommon(102, 'beginMonth');
        if (!beginYear)
            throw new ErrorCommon(102, 'beginYear');
        if (!endMonth)
            throw new ErrorCommon(102, 'endMonth');
        if (!endYear)
            throw new ErrorCommon(102, 'endYear');

        // Get all connectBank of this user
        let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(userId);
        if (!connectBank.length)
            throw new ErrorCommon(102, 'connectBank');

        let connectBankIds = connectBank.map(item => String(item.accountId));
        connectBankIds = connectBankIds.filter(item => item);

        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');

        let transactions = await BusinessLoader.transactionBusiness.getTransactionManyBankForReport(userId, connectBankIds, beginMonth, beginYear, endMonth, endYear);
        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, beginMonth, beginYear, endMonth, endYear);
        const transactionData = this.filterTransactions(transactions).concat(newGJTransactions);

        // let user: any = await BusinessLoader.userBusiness.get(userId);
        // if (!user)
        //     throw new ErrorCommon(102, 'Client');

        // let transactions: any[] = [];
        // for (let i = 0; i < connectBank.length; i++) {
        //     let accountId = connectBank[i].accountId;
        //     if (!accountId)
        //         throw new ErrorCommon(102, 'accountId');

        //     const transactionReport = await BusinessLoader.transactionBusiness.getTransactionForReport(userId, String(accountId), beginMonth, beginYear, endMonth, endYear);
        //     // let dataTransactions = await this.getTransactionForReportFinal(userId, String(accountId), beginMonth, beginYear, endMonth, endYear);
        //     transactions = transactions.concat(transactionReport);
        // }

        // const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, beginMonth, beginYear, endMonth, endYear);
        // const transactionData = this.filterTransactions(transactions).concat(newGJTransactions);

        let template: any = {};
        template.user = user;
        user.abnCode = user.businessInfo && user.businessInfo.abnCode ? user.businessInfo.abnCode : '';
        template.filter = { beginMonth: beginMonth, beginYear: beginYear, endMonth: endMonth, endYear: endYear };
        template.data = await this.createReportGSTDetail(transactionData, userId, year);
        template.name = 'GST Detail';

        let title = template.name;
        let name = title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and');

        let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.pdf'; // Address and name for new pdf invoice fle

        let options = this.getOptionRender(title);
        let html = ``;
        // console.log('template =====>', JSON.stringify(template.data));
        html = this.createReportGstDetailPDF(template, false);

        await PdfHelper.createPdf(html, options, localFile);
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, year.toString(), 'bank');

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, name, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;
    }

    /**
     * get preview GST detail
     * @param userId 
     * @param beginMonth 
     * @param beginYear 
     * @param endMonth 
     * @param endYear 
     */
    async getPreviewFinancialGstDetailPdfForMultiBank(userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string> {
        let year = this.timeFilter(beginMonth, beginYear, endMonth, endYear);
        if (!userId)
            throw new ErrorCommon(102, 'userId');
        if (!beginMonth)
            throw new ErrorCommon(102, 'beginMonth');
        if (!beginYear)
            throw new ErrorCommon(102, 'beginYear');
        if (!endMonth)
            throw new ErrorCommon(102, 'endMonth');
        if (!endYear)
            throw new ErrorCommon(102, 'endYear');

        // Get all connectBank of this user
        let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(userId);
        if (!connectBank.length)
            throw new ErrorCommon(102, 'connectBank');

        let connectBankIds = connectBank.map(item => String(item.accountId));
        connectBankIds = connectBankIds.filter(item => item);

        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');

        let transactions = await BusinessLoader.transactionBusiness.getTransactionManyBankForReport(userId, connectBankIds, beginMonth, beginYear, endMonth, endYear);
        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, beginMonth, beginYear, endMonth, endYear);
        const transactionData = this.filterTransactions(transactions).concat(newGJTransactions);
        let template: any = {};
        template.user = user;
        user.abnCode = user.businessInfo && user.businessInfo.abnCode ? user.businessInfo.abnCode : '';
        template.filter = { beginMonth: beginMonth, beginYear: beginYear, endMonth: endMonth, endYear: endYear };
        template.data = await this.createReportGSTDetail(transactionData, userId, year);
        template.name = 'GST Detail';

        let title = template.name;
        // let name = title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and');

        // let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.pdf'; // Address and name for new pdf invoice fle

        // let options = this.getOptionRender(title);
        // await PdfHelper.createPdf(html, options, localFile);
        // let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, year.toString(), 'bank');  
        let html = ``;
        html = this.createReportGstDetailPDF(template, true);
        return html;
    }

    async getFinancialGstDetailCsvForMultiBank(userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string> {
        let year = this.timeFilter(beginMonth, beginYear, endMonth, endYear);
        if (!userId)
            throw new ErrorCommon(102, 'userId');
        if (!beginMonth)
            throw new ErrorCommon(102, 'beginMonth');
        if (!beginYear)
            throw new ErrorCommon(102, 'beginYear');
        if (!endMonth)
            throw new ErrorCommon(102, 'endMonth');
        if (!endYear)
            throw new ErrorCommon(102, 'endYear');

        // Get all connectBank of this user
        let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(userId);
        if (!connectBank.length)
            throw new ErrorCommon(102, 'connectBank');
        let connectBankIds = connectBank.map(item => String(item.accountId));
        connectBankIds = connectBankIds.filter(item => item);

        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');

        let transactions = await BusinessLoader.transactionBusiness.getTransactionManyBankForReport(userId, connectBankIds, beginMonth, beginYear, endMonth, endYear);
        // for (let i = 0; i < connectBank.length; i++) {
        //     let accountId = connectBank[i].accountId;
        //     if (!accountId)
        //         throw new ErrorCommon(102, 'accountId');

        //     const transactionReport = await BusinessLoader.transactionBusiness.getTransactionForReport(userId, String(accountId), beginMonth, beginYear, endMonth, endYear);
        //     // let dataTransactions = await this.getTransactionForReportFinal(userId, String(accountId), beginMonth, beginYear, endMonth, endYear);
        //     transactions = transactions.concat(transactionReport);
        // }

        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, beginMonth, beginYear, endMonth, endYear);
        const transactionData = this.filterTransactions(transactions).concat(newGJTransactions);

        let template: any = {};
        template.user = user;
        user.abnCode = user.businessInfo && user.businessInfo.abnCode ? user.businessInfo.abnCode : '';
        template.filter = { beginMonth: beginMonth, beginYear: beginYear, endMonth: endMonth, endYear: endYear };
        template.data = await this.createReportGSTDetail(transactionData, userId, year);
        template.name = 'GST Detail';

        template.totalGroup = template.data.totalGroup;
        let title = template.name;
        delete (template.data);
        let name = title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and');
        const csvContent = new TemplateGstDetailCsv(template);
        let fileName = `${beginMonth}_${beginYear}-${endMonth}_${endYear}_${name}.csv`;

        let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.csv'; // Address and name for new csv invoice fle
        fs.writeFileSync(localFile, csvContent.renderCsvContent());
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, year.toString(), 'bank');

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, fileName, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;
    }

    async getFinancialGstDetailPdf(userId: string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<any> {
        const template = await this.getTemplateGstDetail(userId, accountId, beginMonth, beginYear, endMonth, endYear);
        let title = template.name;
        let name = title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and');

        let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.pdf'; // Address and name for new pdf invoice fle

        let options = this.getOptionRender(title);
        let html = ``;
        // console.log('template =====>', JSON.stringify(template.data));
        html = this.createReportGstDetailPDF(template, false);

        await PdfHelper.createPdf(html, options, localFile);
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, beginYear.toString(), 'bank');

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, name, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;
    }

    async getFinancialGstDetailCsv(userId: string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<any> {
        const template: any = await this.getTemplateGstDetail(userId, accountId, beginMonth, beginYear, endMonth, endYear);
        template.totalGroup = template.data.totalGroup;
        let title = template.name;
        delete (template.data);
        let name = title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and');
        const csvContent = new TemplateGstDetailCsv(template);
        let fileName = `${beginMonth}_${beginYear}-${endMonth}_${endYear}_${name}.csv`;

        let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.csv'; // Address and name for new csv invoice fle
        fs.writeFileSync(localFile, csvContent.renderCsvContent());
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, beginYear.toString(), 'bank');

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, fileName, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;
    }

    async getTemplateGstDetail(userId: string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<any> {
        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');

        let transactions = await this.getTransactionForReportFinal(userId, accountId, beginMonth, beginYear, endMonth, endYear);
        let template: any = {};
        template.user = user;
        user.abnCode = user.businessInfo && user.businessInfo.abnCode ? user.businessInfo.abnCode : '';
        template.filter = { beginMonth: beginMonth, beginYear: beginYear, endMonth: endMonth, endYear: endYear };
        template.data = await this.createReportGSTDetail(transactions, userId, beginYear);
        template.name = 'GST Detail';
        return template;
    }

    private async caculatorReportProfitAndLost(transactions: Transaction[], userId: string, beginYear: number) {
        transactions = transactions.filter(transaction => transaction.typeCrunch);

        const templateInstance = new ProfitLossTemplate();
        const template: any = templateInstance.getTemplate();
        let codes = this.filterCode(template);
        let groupSettings = await BusinessLoader.settingReportBusiness.getSettingByCodes(codes);
        const usageBudgets = await BusinessLoader.usageBudgetBusiness.getByBeginYear(userId, beginYear);

        let dataOtherIncome: any = await BusinessLoader.groupReportBusiness.getGroupReportByIncomeAndOtherIncome();
        console.log('dataOtherIncome =>>>>>>>>>>>>>.', dataOtherIncome);
        let otherIncomeCoas: any = [];
        dataOtherIncome.forEach(item => {
            let dataCoaId = item.coas.map(element => element._id);
            otherIncomeCoas = otherIncomeCoas.concat(dataCoaId);
        });
        let groupReports = await BusinessLoader.groupReportBusiness.getByGroupIds(groupSettings.map(item => item.groupId));
        let totalCoas: any[] = [];
        let groupMaping: any[] = groupSettings.map(setting => {
            const groupReport = groupReports.find(item => item._id.toString() === setting.groupId.toString());
            if (groupReport && groupReport.coas)
                totalCoas = totalCoas.concat(groupReport.coas);
            return {
                code: setting.code,
                coas: groupReport && groupReport.coas ? groupReport.coas : []
            };
        });

        let gstCoas = await BusinessLoader.groupReportBusiness.getGroupBySettingCode(ReportSettingCode.GST);
        const gcsCoas = await BusinessLoader.groupReportBusiness.getGroupBySettingCode(ReportSettingCode.GCA);
        gstCoas = gstCoas.concat(gcsCoas);

        totalCoas = totalCoas.map(item => ({ coa: item._id, total: 0 }));
        // let privateUsageTotal = 0;
        let totalSalesIncome = 0;
        transactions.forEach(transaction => {
            let amount = transaction.amount.amount;

            if (transaction.coaId && transaction.coaId._id) {
                const coaInGst = gstCoas.find(coa => coa._id.toString() === transaction.coaId._id.toString());
                const usageBudget = usageBudgets.find(item => (item.coaId._id.toString() === transaction.coaId._id.toString()));
                const index = totalCoas.findIndex(item => item.coa.toString() === transaction.coaId._id.toString());
                if (index >= 0) {
                    const otherIncomeIndex = otherIncomeCoas.findIndex(item => item.toString() === transaction.coaId._id.toString());
                    if (otherIncomeIndex >= 0)
                        amount = transaction.baseType === 'CREDIT' ? amount : - amount;
                    else
                        amount = transaction.baseType === 'CREDIT' ? - amount : amount;

                    if (usageBudget) {
                        amount = Number(parseFloat((amount * usageBudget.percentUsage / 100).toFixed(5)));
                    }

                    if (coaInGst)
                        amount = Number(parseFloat((amount / 1.1).toFixed(4)));

                    totalCoas[index].total = (totalCoas[index].total + amount);
                }
            }

            if (transaction.typeCrunch === CrunchType.Income) {
                amount = transaction.baseType === 'CREDIT' ? amount : - amount;
                amount = Number(amount / 1.1);
                totalSalesIncome += amount;
            }
        });

        groupMaping = groupMaping.map(item => {
            let total = 0;
            let coas = item.coas.map(coa => {
                let coaItem = totalCoas.find(c => c.coa.toString() === coa._id.toString());
                const usageBudget = usageBudgets.find(item => (item.coaId._id.toString() === coa._id.toString()));
                const subName = usageBudget ? ` (BU ${usageBudget.percentUsage}%)` : '';
                if (coaItem)
                    total += Number((coaItem.total));
                return {
                    _id: coa._id,
                    code: coa.code,
                    name: subName ? coa.name + subName : coa.name,
                    total: coaItem ? coaItem.total : 0
                };
            });
            return {
                ...item,
                coas,
                total
            };
        });

        for (let index = 0; index < groupMaping.length; index++) {
            const element = groupMaping[index];
            // console.log(element.code);
            if (element.code === 1000 && element.coas && Array.isArray(element.coas)) {
                let isIncome = false;
                for (let i = 0; i < element.coas.length; i++) {
                    const coa = element.coas[i];
                    // console.log('coa =====>', element.code, coa);
                    if (coa.code === '4-1000') {
                        isIncome = true;
                        coa.total = totalSalesIncome;
                        element.total += totalSalesIncome;
                    }
                }
                if (!isIncome) {
                    element.coas.push({ _id: '12313213331211', code: '4-1000', name: 'Sale Income', total: totalSalesIncome });
                    element.total += totalSalesIncome;
                }
            }
        }

        TemplateProfitLoss.templateMappingCoa(template, groupMaping);
        TemplateProfitLoss.caculatorTotalTemplate(template);
        TemplateProfitLoss.removeTotalZero(template);
        return this.caculatorForTemplate(template);
    }

    caculatorForTemplate(template) {
        const templateTemp = JSON.parse(JSON.stringify(template));
        if (templateTemp.type === 2) {
            const income = templateTemp.items[0];
            const costOfSales = templateTemp.items[1];
            const grossProfit = { name: 'Gross Profit', total: income.total - costOfSales.total, isNotHeader: true };
            const expenses = templateTemp.items[2];

            const operatingProfit = { name: 'Operating Profit', total: grossProfit.total - expenses.total, isNotHeader: true };
            const otherIncome = templateTemp.items[3];
            const otherExpenses = templateTemp.items[4];
            const netProfit = { name: 'Net Profit', total: operatingProfit.total + otherIncome.total - otherExpenses.total, isNotHeader: true };
            template.items = [income, costOfSales, grossProfit, expenses, operatingProfit, otherIncome, otherExpenses, netProfit];
        }
        return template;
    }

    createReportBalanceSheet(dataTemplate: any, isPreview: boolean) {
        let temp = new TemplateBalanceSheet(dataTemplate, isPreview);
        return temp.renderHtml();
    }
    createReportBalanceSheetPDF(dataTemplate: any, isPreview: boolean) {
        let temp = new TemplateBalanceSheetFromCsv(dataTemplate, isPreview);
        return temp.renderHtml();
    }

    createReportProfitAndLoss(dataTemplate: any, isPreview: boolean) {
        let temp = new TemplateProfitLoss(dataTemplate, isPreview);
        return temp.renderHtml();
    }

    createTrialBalancePDF(dataTemplate: any, isPreview: boolean) {
        let temp = new TemplateTrialBalance(dataTemplate, isPreview);
        return temp.renderHtml();
    }

    createReportGstPDF(dataTemplate: any, isPreview: boolean) {
        let temp = new TemplateGst(dataTemplate, isPreview);
        return temp.renderHtml();
    }

    createReportGstDetailPDF(dataTemplate: any, isPreview: boolean) {
        let temp = new TemplateGstDetail(dataTemplate, isPreview);
        return temp.renderHtml();
    }

    async createReportGSTDetail(transactions: any[], userId: string, beginYear: number) {
        transactions = transactions.filter(transaction => transaction.typeCrunch);

        let totalGroup: any[] = [{
            code: 4400,
            name: 'GST Free',
            type: 'FRE',
            transactions: [],
            saleValue: 0,
            purchaseValue: 0,
            taxCollected: 0,
            taxPaid: 0
        }, {
            code: 4500,
            name: 'GST on Capital Acquisiti',
            type: 'GCA',
            transactions: [],
            saleValue: 0,
            purchaseValue: 0,
            taxCollected: 0,
            taxPaid: 0
        }, {
            code: 4600,
            name: 'Goods & Services Tax',
            type: 'GST',
            transactions: [],
            saleValue: 0,
            purchaseValue: 0,
            taxCollected: 0,
            taxPaid: 0
        }, {
            code: 4700,
            name: 'Not Reportable',
            type: 'N-T',
            transactions: [],
            saleValue: 0,
            purchaseValue: 0,
            taxCollected: 0,
            taxPaid: 0
        }];

        const usageBudgets = await BusinessLoader.usageBudgetBusiness.getByBeginYear(userId, beginYear);
        transactions.forEach(transaction => {
            let amount = transaction.amount.amount;
            if (transaction.typeCrunch === CrunchType.Expenses) {
                const usageBudget = usageBudgets.find(item => (item.coaId._id.toString() === transaction.coaId._id.toString()));
                if (usageBudget) {
                    amount = parseFloat((amount * usageBudget.percentUsage / 100).toFixed(2));
                    transaction.description.original = transaction.description.original + ' (BU ' + usageBudget.percentUsage + '%)';
                }
                if (transaction.coaId && transaction.coaId.gstType) {
                    if (transaction.coaId.gstType === GstType.GSTFree) {
                        transaction.amount.amount = amount;
                        totalGroup[0].transactions.push(transaction);
                        totalGroup[0].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[0].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                    }
                    else if (transaction.coaId.gstType === GstType.CAP) {
                        transaction.amount.amount = amount;
                        totalGroup[1].transactions.push(transaction);
                        totalGroup[1].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[1].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                        totalGroup[1].taxCollected += transaction.baseType === 'CREDIT' ? transaction.amount.amount / 11 : 0;
                        totalGroup[1].taxPaid += transaction.baseType === 'DEBIT' ? transaction.amount.amount / 11 : 0;
                    }
                    else if (transaction.coaId.gstType === GstType.GST) {
                        transaction.amount.amount = amount;
                        totalGroup[2].transactions.push(transaction);
                        totalGroup[2].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[2].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                        totalGroup[2].taxCollected += transaction.baseType === 'CREDIT' ? transaction.amount.amount / 11 : 0;
                        totalGroup[2].taxPaid += transaction.baseType === 'DEBIT' ? transaction.amount.amount / 11 : 0;
                    }
                    else if (transaction.coaId.gstType === GstType.NotReporTable) {
                        transaction.amount.amount = amount;
                        totalGroup[3].transactions.push(transaction);
                        totalGroup[3].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[3].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                    }
                }
            }
            if (transaction.typeCrunch === CrunchType.Income) {
                transaction.amount.amount = amount;
                totalGroup[2].transactions.push(transaction);
                totalGroup[2].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                totalGroup[2].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                totalGroup[2].taxCollected += transaction.baseType === 'CREDIT' ? transaction.amount.amount / 11 : 0;
                totalGroup[2].taxPaid += transaction.baseType === 'DEBIT' ? transaction.amount.amount / 11 : 0;
            }
            else if (transaction.typeCrunch === CrunchType.Drawings || transaction.typeCrunch === CrunchType.Other) {
                transaction.amount.amount = amount;
                totalGroup[3].transactions.push(transaction);
                totalGroup[3].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                totalGroup[3].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
            }
        });
        return {
            totalGroup
        };
    }

    async createReportGST(transactions: any[], userId: string, beginYear: number) {
        transactions = transactions.filter(transaction => transaction.typeCrunch);

        let totalGroup: any[] = [{
            code: 4400,
            name: 'GST Free',
            saleValue: 0,
            purchaseValue: 0,
            taxCollected: 0,
            taxPaid: 0
        }, {
            code: 4500,
            name: 'GST on Capital Acquisiti',
            saleValue: 0,
            purchaseValue: 0,
            taxCollected: 0,
            taxPaid: 0
        }, {
            code: 4600,
            name: 'Goods & Services Tax',
            saleValue: 0,
            purchaseValue: 0,
            taxCollected: 0,
            taxPaid: 0
        }, {
            code: 4700,
            name: 'Not Reportable',
            saleValue: 0,
            purchaseValue: 0,
            taxCollected: 0,
            taxPaid: 0
        }];

        const usageBudgets = await BusinessLoader.usageBudgetBusiness.getByBeginYear(userId, beginYear);
        transactions.forEach(transaction => {
            let amount = transaction.amount.amount;
            if (transaction.typeCrunch === CrunchType.Expenses) {
                const usageBudget = usageBudgets.find(item => (item.coaId._id.toString() === transaction.coaId._id.toString()));
                if (usageBudget)
                    amount = Number(parseFloat((amount * usageBudget.percentUsage / 100).toFixed(2)));
                if (transaction.coaId && transaction.coaId.gstType) {
                    if (transaction.coaId.gstType === GstType.GSTFree) {
                        transaction.amount.amount = amount;
                        totalGroup[0].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[0].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                    }
                    else if (transaction.coaId.gstType === GstType.CAP) {
                        transaction.amount.amount = amount;
                        totalGroup[1].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[1].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                        totalGroup[1].taxCollected += transaction.baseType === 'CREDIT' ? transaction.amount.amount / 11 : 0;
                        totalGroup[1].taxPaid += transaction.baseType === 'DEBIT' ? transaction.amount.amount / 11 : 0;
                    }
                    else if (transaction.coaId.gstType === GstType.GST) {
                        transaction.amount.amount = amount;
                        totalGroup[2].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[2].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                        totalGroup[2].taxCollected += transaction.baseType === 'CREDIT' ? transaction.amount.amount / 11 : 0;
                        totalGroup[2].taxPaid += transaction.baseType === 'DEBIT' ? transaction.amount.amount / 11 : 0;
                    }
                    else if (transaction.coaId.gstType === GstType.NotReporTable) {
                        transaction.amount.amount = amount;
                        totalGroup[3].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[3].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                    }
                }
            }
            if (transaction.typeCrunch === CrunchType.Income) {
                totalGroup[2].saleValue += transaction.baseType === 'CREDIT' ? amount : 0;
                totalGroup[2].purchaseValue += transaction.baseType === 'DEBIT' ? amount : 0;
                totalGroup[2].taxCollected += transaction.baseType === 'CREDIT' ? amount / 11 : 0;
                totalGroup[2].taxPaid += transaction.baseType === 'DEBIT' ? amount / 11 : 0;
            }
            else if (transaction.typeCrunch === CrunchType.Drawings || transaction.typeCrunch === CrunchType.Other) {
                totalGroup[3].saleValue += transaction.baseType === 'CREDIT' ? amount : 0;
                totalGroup[3].purchaseValue += transaction.baseType === 'DEBIT' ? amount : 0;
            }
        });
        let taxCollected = 0; let taxPaid = 0;

        totalGroup.forEach(item => {
            taxCollected += item.taxCollected;
            taxPaid += item.taxPaid;
        });

        return {
            totalGroup,
            taxCollected,
            taxPaid
        };
    }

    async createReportGSTForBalanceSheet(dataTransactions: any[], userId: string, beginYear: number) {
        let chartAccountOpeningBalance = await BusinessLoader.userBusiness.getUserChartAccountOpeningBalance(userId);
        let transactions =  dataTransactions.filter(transaction => transaction.typeCrunch);
        // Get transactions from GJ
        let totalGroup: any[] = [{
            code: 4400,
            name: 'GST Free',
            saleValue: 0,
            purchaseValue: 0,
            taxCollected: 0,
            taxPaid: 0
        }, {
            code: 4500,
            name: 'GST on Capital Acquisiti',
            saleValue: 0,
            purchaseValue: 0,
            taxCollected: 0,
            taxPaid: 0
        }, {
            code: 4600,
            name: 'Goods & Services Tax',
            saleValue: 0,
            purchaseValue: 0,
            taxCollected: 0,
            taxPaid: 0
        }, {
            code: 4700,
            name: 'Not Reportable',
            saleValue: 0,
            purchaseValue: 0,
            taxCollected: 0,
            taxPaid: 0
        }];
        const usageBudgets = await BusinessLoader.usageBudgetBusiness.getByBeginYear(userId, beginYear);
        let privateUsage = 0;
        transactions.forEach((transaction, index, object) => {
            let amount = transaction.amount.amount;
            if (transaction.typeCrunch === CrunchType.Expenses) {
                let usageBudget;
                if (transaction.coaId) {
                    usageBudget = usageBudgets.find(item => (item.coaId._id.toString() === transaction.coaId._id.toString()));
                }
                if (usageBudget)
                    amount = Number(parseFloat((amount * usageBudget.percentUsage / 100).toFixed(2)));
                // Check transaction get from Cruncher
                // Egan will fix later
                
                if ((transaction.coa && transaction.coa[0] === undefined)){
                    throw new ErrorCommon(102, 'Crunch not complete');
                }
                    
                if (transaction.coa && transaction.coa[0].gstType) {
                    if (transaction.coa[0].gstType === GstType.GSTFree) {
                        privateUsage += transaction.amount.amount - amount;
                        transaction.amount.amount = amount;
                        totalGroup[0].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[0].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                    }
                    else if (transaction.coa[0].gstType === GstType.CAP) {
                        privateUsage += transaction.amount.amount - amount;
                        transaction.amount.amount = amount;
                        totalGroup[1].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[1].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                        totalGroup[1].taxCollected += transaction.baseType === 'CREDIT' ? transaction.amount.amount / 11 : 0;
                        totalGroup[1].taxPaid += transaction.baseType === 'DEBIT' ? transaction.amount.amount / 11 : 0;
                    }
                    else if (transaction.coa[0].gstType === GstType.GST) {
                        privateUsage += transaction.amount.amount - amount;
                        transaction.amount.amount = amount;
                        totalGroup[2].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[2].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                        totalGroup[2].taxCollected += transaction.baseType === 'CREDIT' ? transaction.amount.amount / 11 : 0;
                        totalGroup[2].taxPaid += transaction.baseType === 'DEBIT' ? transaction.amount.amount / 11 : 0;
                    }
                    else if (transaction.coa[0].gstType === GstType.NotReporTable) {
                        privateUsage += transaction.amount.amount - amount;
                        transaction.amount.amount = amount;
                        totalGroup[3].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[3].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;                      
                    }
                }
                // Check transaction get from GJ
                else if (transaction.coaId && transaction.coaId.gstType) {
                    if (transaction.coaId.gstType === GstType.GSTFree) {
                        privateUsage += transaction.amount.amount - amount;
                        transaction.amount.amount = amount;
                        totalGroup[0].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[0].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                    }
                    else if (transaction.coaId.gstType === GstType.CAP) {
                        privateUsage += transaction.amount.amount - amount;
                        transaction.amount.amount = amount;
                        totalGroup[1].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[1].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                        totalGroup[1].taxCollected += transaction.baseType === 'CREDIT' ? transaction.amount.amount / 11 : 0;
                        totalGroup[1].taxPaid += transaction.baseType === 'DEBIT' ? transaction.amount.amount / 11 : 0;
                    }
                    else if (transaction.coaId.gstType === GstType.GST) {
                        privateUsage += transaction.amount.amount - amount;
                        transaction.amount.amount = amount;
                        totalGroup[2].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[2].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                        totalGroup[2].taxCollected += transaction.baseType === 'CREDIT' ? transaction.amount.amount / 11 : 0;
                        totalGroup[2].taxPaid += transaction.baseType === 'DEBIT' ? transaction.amount.amount / 11 : 0;
                    }
                    else if (transaction.coaId.gstType === GstType.NotReporTable) {
                        privateUsage += transaction.amount.amount - amount;
                        transaction.amount.amount = amount;
                        totalGroup[3].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[3].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                    }
                }
            }
            if (transaction.typeCrunch === CrunchType.Income) {
                totalGroup[2].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                totalGroup[2].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                totalGroup[2].taxCollected += transaction.baseType === 'CREDIT' ? transaction.amount.amount / 11 : 0;
                totalGroup[2].taxPaid += transaction.baseType === 'DEBIT' ? transaction.amount.amount / 11 : 0;
            }
            else if (transaction.typeCrunch === CrunchType.Drawings || transaction.typeCrunch === CrunchType.Other) {
                totalGroup[3].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                totalGroup[3].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
            }
        });
        let taxCollected = 0;
        let taxPaid = 0;
        totalGroup.forEach(item => {
            taxCollected += Number(item.taxCollected.toFixed(2));
            taxPaid += Number(item.taxPaid.toFixed(2));
        });
        return {
            totalGroup,
            taxCollected,
            taxPaid,
            privateUsage
        };
    }

    async createReportGSTForTrialBalance(dataTransactions: any[], userId: string, beginMonth: number ,beginYear: number) {
        let transactions =  dataTransactions.filter(transaction => transaction.typeCrunch && (transaction.month === beginMonth && transaction.year === beginYear));
        // Get transactions from GJ
        let totalGroup: any[] = [{
            code: 4400,
            name: 'GST Free',
            saleValue: 0,
            purchaseValue: 0,
            taxCollected: 0,
            taxPaid: 0
        }, {
            code: 4500,
            name: 'GST on Capital Acquisiti',
            saleValue: 0,
            purchaseValue: 0,
            taxCollected: 0,
            taxPaid: 0
        }, {
            code: 4600,
            name: 'Goods & Services Tax',
            saleValue: 0,
            purchaseValue: 0,
            taxCollected: 0,
            taxPaid: 0
        }, {
            code: 4700,
            name: 'Not Reportable',
            saleValue: 0,
            purchaseValue: 0,
            taxCollected: 0,
            taxPaid: 0
        }];
        const usageBudgets = await BusinessLoader.usageBudgetBusiness.getByBeginYear(userId, beginYear);
        let privateUsage = 0;
        transactions.forEach((transaction, index, object) => {
            let amount = transaction.amount.amount;
            if (transaction.typeCrunch === CrunchType.Expenses) {
                let usageBudget;
                if (transaction.coaId) {
                    usageBudget = usageBudgets.find(item => (item.coaId._id.toString() === transaction.coaId._id.toString()));
                }
                if (usageBudget)
                    amount = Number(parseFloat((amount * usageBudget.percentUsage / 100).toFixed(2)));
                // Check transaction get from Cruncher
                // Egan will fix later
                
                if ((transaction.coa && transaction.coa[0] === undefined)){
                    throw new ErrorCommon(102, 'Crunch not complete');
                }
                    
                if (transaction.coa && transaction.coa[0].gstType) {
                    if (transaction.coa[0].gstType === GstType.GSTFree) {
                        privateUsage += transaction.amount.amount - amount;
                        transaction.amount.amount = amount;
                        totalGroup[0].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[0].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                    }
                    else if (transaction.coa[0].gstType === GstType.CAP) {
                        privateUsage += transaction.amount.amount - amount;
                        transaction.amount.amount = amount;
                        totalGroup[1].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[1].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                        totalGroup[1].taxCollected += transaction.baseType === 'CREDIT' ? transaction.amount.amount / 11 : 0;
                        totalGroup[1].taxPaid += transaction.baseType === 'DEBIT' ? transaction.amount.amount / 11 : 0;
                    }
                    else if (transaction.coa[0].gstType === GstType.GST) {
                        privateUsage += transaction.amount.amount - amount;
                        transaction.amount.amount = amount;
                        totalGroup[2].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[2].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                        totalGroup[2].taxCollected += transaction.baseType === 'CREDIT' ? transaction.amount.amount / 11 : 0;
                        totalGroup[2].taxPaid += transaction.baseType === 'DEBIT' ? transaction.amount.amount / 11 : 0;
                    }
                    else if (transaction.coa[0].gstType === GstType.NotReporTable) {
                        privateUsage += transaction.amount.amount - amount;
                        transaction.amount.amount = amount;
                        totalGroup[3].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[3].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;                      
                    }
                }
                // Check transaction get from GJ
                else if (transaction.coaId && transaction.coaId.gstType) {
                    if (transaction.coaId.gstType === GstType.GSTFree) {
                        privateUsage += transaction.amount.amount - amount;
                        transaction.amount.amount = amount;
                        totalGroup[0].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[0].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                    }
                    else if (transaction.coaId.gstType === GstType.CAP) {
                        privateUsage += transaction.amount.amount - amount;
                        transaction.amount.amount = amount;
                        totalGroup[1].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[1].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                        totalGroup[1].taxCollected += transaction.baseType === 'CREDIT' ? transaction.amount.amount / 11 : 0;
                        totalGroup[1].taxPaid += transaction.baseType === 'DEBIT' ? transaction.amount.amount / 11 : 0;
                    }
                    else if (transaction.coaId.gstType === GstType.GST) {
                        privateUsage += transaction.amount.amount - amount;
                        transaction.amount.amount = amount;
                        totalGroup[2].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[2].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                        totalGroup[2].taxCollected += transaction.baseType === 'CREDIT' ? transaction.amount.amount / 11 : 0;
                        totalGroup[2].taxPaid += transaction.baseType === 'DEBIT' ? transaction.amount.amount / 11 : 0;
                    }
                    else if (transaction.coaId.gstType === GstType.NotReporTable) {
                        privateUsage += transaction.amount.amount - amount;
                        transaction.amount.amount = amount;
                        totalGroup[3].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                        totalGroup[3].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                    }
                }
            }
            if (transaction.typeCrunch === CrunchType.Income) {
                totalGroup[2].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                totalGroup[2].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
                totalGroup[2].taxCollected += transaction.baseType === 'CREDIT' ? transaction.amount.amount / 11 : 0;
                totalGroup[2].taxPaid += transaction.baseType === 'DEBIT' ? transaction.amount.amount / 11 : 0;
            }
            else if (transaction.typeCrunch === CrunchType.Drawings || transaction.typeCrunch === CrunchType.Other) {
                totalGroup[3].saleValue += transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
                totalGroup[3].purchaseValue += transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
            }
        });
        let taxCollected = 0;
        let taxPaid = 0;
        totalGroup.forEach(item => {
            taxCollected += Number(item.taxCollected.toFixed(2));
            taxPaid += Number(item.taxPaid.toFixed(2));
        });
        return {
            totalGroup,
            taxCollected,
            taxPaid,
            privateUsage
        };
    }

    async getBalanceSheetPdfReport(userId: string, originId: string, month: number, year: number): Promise<any> {
        let queryBeginMonth:number = 7;
        let queryBeginYear:number;
        let queryEndYear:number;
        year = Number(year)
        month = Number(month)
        if (month < 7) {
            queryBeginYear = year - 1;
            queryEndYear = year;
        }
        else {
            queryBeginYear = year;
            queryEndYear = year;
        }

        let data: any = {
            asset: {
                name: 'Asset',
                type: {
                    spacing: 0,
                    bold: 1,
                    underlined: 0,
                    paddingTop: 0,
                    fontSize: 10
                },
                currentAsset: {
                    type: {
                        spacing: 1,
                        bold: 1,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    name: 'Current Asset',
                    dataCoa: [],
                    totalCurrentAsset: {
                        type: {
                            spacing: 1,
                            bold: 1,
                            underlined: 1,
                            paddingTop: 0,
                            fontSize: 9
                        },
                        name: 'Total Current Asset',
                        total: 0
                    }
                },
                nonCurrentAsset: {
                    type: {
                        spacing: 1,
                        bold: 1,
                        underlined: 0,
                        paddingTop: 20,
                        fontSize: 9
                    },
                    name: 'Non Current Asset',
                    data: [],
                    totalNonCurrentAsset: {
                        type: {
                            spacing: 1,
                            bold: 1,
                            underlined: 1,
                            paddingTop: 0,
                            fontSize: 9
                        },
                        name: 'Total Non Current Asset',
                        total: 0
                    }
                },
                totalAsset: {
                    type: {
                        spacing: 0,
                        bold: 1,
                        underlined: 1,
                        paddingTop: 0,
                        fontSize: 10
                    },
                    name: 'Total Asset',
                    total: 0
                }
            },
            liabilities: {
                name: 'Liabilities',
                type: {
                    spacing: 0,
                    bold: 1,
                    underlined: 0,
                    paddingTop: 40,
                    fontSize: 10
                },
                currentLiabilities: {
                    type: {
                        spacing: 1,
                        bold: 1,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    name: 'Current Liabilities',
                    data: [],
                    totalCurrentLiabilities: {
                        type: {
                            spacing: 1,
                            bold: 1,
                            underlined: 1,
                            paddingTop: 0,
                            fontSize: 9
                        },
                        name: 'Total Current Liabilities',
                        total: 0
                    }
                },
                nonCurrentLiabilities: {
                    type: {
                        spacing: 1,
                        bold: 1,
                        underlined: 0,
                        paddingTop: 20,
                        fontSize: 9
                    },
                    name: 'Non Current Liabilities',
                    data: [],
                    totalNonCurrentLiabilities: {
                        type: {
                            spacing: 1,
                            bold: 1,
                            underlined: 1,
                            paddingTop: 0,
                            fontSize: 9
                        },
                        name: 'Non Current Liabilities',
                        total: 0
                    }
                },
                totalLiabilities: {
                    type: {
                        spacing: 0,
                        bold: 1,
                        underlined: 1,
                        paddingTop: 0,
                        fontSize: 10
                    },
                    name: 'Total Liabilities',
                    total: 0
                }
            },
            netAssets: {
                name: 'Net Assets',
                type: {
                    spacing: 0,
                    bold: 1,
                    underlined: 0,
                    paddingTop: 40,
                    fontSize: 10
                },
                totalNetAssets: 0
            },
            equity: {
                name: 'Equity',
                type: {
                    spacing: 0,
                    bold: 1,
                    underlined: 0,
                    paddingTop: 40,
                    fontSize: 10
                },
                dataCoa: [],
                totalEquity: {
                    type: {
                        spacing: 0,
                        bold: 1,
                        underlined: 1,
                        paddingTop: 0,
                        fontSize: 10
                    },
                    name: 'Total Equity',
                    total: 0
                }
            }
        };

        let dataBankCreditCard: any = {
            name: 'Credit Card',
            dataCoa: [],
            type: {
                spacing: 2,
                bold: 0,
                underlined: 0,
                paddingTop: 0,
                fontSize: 9
            },
            total: 0
        };

        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');

        let coaOpeningBalance = await BusinessLoader.userBusiness.getUserChartAccountOpeningBalance(user._id);
        if (coaOpeningBalance === undefined){
            throw new ErrorCommon(103, 'Balance Sheet Opening Balance');
        }
        if(coaOpeningBalance.month > Number(month) && coaOpeningBalance.year >= year){
            throw new ErrorCommon(101, 'Download report');
        }
        let hisBalanceAccountsPoint = await BusinessLoader.statementBusiness.getStatementOfClientforBalanceSheetReport(userId, originId, coaOpeningBalance.year, coaOpeningBalance.month);
        let statement = await BusinessLoader.statementBusiness.getStatementOfClientforBalanceSheetReport(userId, originId, year, month);
        if (!statement.length)
            throw new ErrorCommon(102, 'Statement');
        let totalCurrentAsset = 0;
        let totalBankCreditCard = 0;
        let totalHistoricalBankAccounts = 0;
        let totalHistoricalCCAcounts = 0;
        let totalHistoricalBalancingAccounts = 0;
        let isHistoricalBalancingAccounts = false;
        // console.log('statement==>', statement);
        for (let i = 0; i < statement.length; i++) {
            let item = statement[i];
            let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(userId, item.accountId);
            if (!connectBank)
                continue;

            else {
                if (connectBank.type === BankType.Bank) {
                    let totalcloseBalanceBank = Number(item.closeBalance);
                    data.asset.currentAsset.dataCoa.push({
                        name: connectBank.accountName, total: totalcloseBalanceBank, type: {
                            spacing: 2,
                            bold: 0,
                            underlined: 0,
                            paddingTop: 0,
                            fontSize: 9
                        },
                    });
                    totalCurrentAsset = totalCurrentAsset + item.closeBalance;
                    // totalHistoricalBankAccounts += item.openBalance;
                }
                else if (connectBank.type === BankType.CreditCard) {
                    totalBankCreditCard = totalBankCreditCard + item.closeBalance;
                    // totalHistoricalCCAcounts += item.openBalance;
                    dataBankCreditCard.dataCoa.push({
                        type: {
                            spacing: 3,
                            bold: 0,
                            underlined: 0,
                            paddingTop: 0,
                            fontSize: 9
                        },
                        name: connectBank.accountName,
                        total: item.closeBalance
                    });
                }
            }
        }
        for(let i = 0; i < hisBalanceAccountsPoint.length; i++){
            let item = hisBalanceAccountsPoint[i];
            let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(userId, item.accountId);
            if (!connectBank)
                continue;

            else {
                if (connectBank.type === BankType.Bank) {
                    totalHistoricalBankAccounts += item.openBalance;
                }
                else if (connectBank.type === BankType.CreditCard) {
                    totalHistoricalCCAcounts += item.openBalance;
                }
            }
        }
        // console.log('totalHistoricalBankAccounts =>>>>>>>>>>>>>', totalHistoricalBankAccounts);
        // console.log('totalHistoricalCCAcounts =>>>>>>>>>>>>>>>>>>', totalHistoricalCCAcounts);
        dataBankCreditCard.total = totalBankCreditCard;
        // let totalTransactionCrunchTypeExpenses = await BusinessLoader.transactionBusiness.groupByTransactionCrunchTypeExpensesForBalanceSheetReport(user._id, year, month);
        // let totalTransactionCrunchTypeDrawings = await BusinessLoader.transactionBusiness.groupByTransactionCrunchTypeDrawingsForBalanceSheetReport(user._id, year, month);
        let transactionBalanceSheet = await BusinessLoader.transactionBusiness.getTransactionForBalanceSheetReport(user._id,coaOpeningBalance.year, coaOpeningBalance.month, year, month);
        let newGJTransactionAllTimes = await BusinessLoader.generalJournalBusiness.getNewTransactionBalanceSheetByTime(user._id, month, year);

        // sai cho nay do get transactions k co coaId
        let transactionAllTime = await Promise.all([transactionBalanceSheet, newGJTransactionAllTimes]);
        
        let transactionGST = this.filterTransactions(transactionAllTime[0]).concat(transactionAllTime[1]);
        // let chartAccountOpeningBalance = await BusinessLoader.userBusiness.getUserChartAccountOpeningBalance(user._id);
        // transactionGST = transactionGST.filter(transaction => transaction.month >= chartAccountOpeningBalance.month)
        let totalDrawing = 0;
        let dataGroupTransection: any[] = [];
        let totalHistoricalBankAccountsGJ = 0;
        let isHistoricalBankAccountsGJ = (newGJTransactionAllTimes && newGJTransactionAllTimes.length) ? true : false;

        // Calc GJ have COA is Historical Bank Account
        newGJTransactionAllTimes.forEach(item => {
            if(item.coaId.code === '3-9999'){
                if (item.baseType === 'DEBIT')
                    totalHistoricalBankAccountsGJ += (item.amount.amount * -1);
                if (item.baseType === 'CREDIT')
                    totalHistoricalBankAccountsGJ += item.amount.amount;
            }
            
        });

        // let coaOpeningBalance = await BusinessLoader.userBusiness.getUserChartAccountOpeningBalance(user._id);
        if (coaOpeningBalance && coaOpeningBalance.dataCoaOpeningBalance.length) {
            let indexSaleIncome = coaOpeningBalance.dataCoaOpeningBalance.findIndex(x => x.specialCoaName === 'Sales Income');
            if (indexSaleIncome !== -1)
                coaOpeningBalance.dataCoaOpeningBalance.splice(indexSaleIncome, 1);
            let indexDrawing = coaOpeningBalance.dataCoaOpeningBalance.findIndex(x => x.specialCoaName === 'Drawing');
            if (indexDrawing === -1)
                totalDrawing = 0;
            else {
                totalDrawing = coaOpeningBalance.dataCoaOpeningBalance[indexDrawing].openingBalance || 0;
                coaOpeningBalance.dataCoaOpeningBalance.splice(indexDrawing, 1);
            }
            for (let i = 0; i < coaOpeningBalance.dataCoaOpeningBalance.length; i++) {
                let item = coaOpeningBalance.dataCoaOpeningBalance[i];
                if(item.coaId.code === '3-9999'){
                    isHistoricalBalancingAccounts = true;
                }
                let total = item.openingBalance;
                total = Number(parseFloat(total.toFixed(2)));

                // if (item.coaId.gstType === GstType.GST || item.coaId.gstType === GstType.CAP)
                //     total = Number(parseFloat((total / 1.1).toFixed(2)));
                // else
                //     total = Number(parseFloat(total.toFixed(2)));
                dataGroupTransection.push({
                    coaId: item.coaId._id,
                    coaName: item.coaId.name,
                    coaCode: item.coaId.code,
                    amount: total,
                    gstType: item.coaId.gstType
                });
            }
        }
        let drawingtransactionData = transactionGST.filter(item => item.typeCrunch === CrunchType.Drawings && item.year !== 0);

        drawingtransactionData.forEach(item => {
            if (item.baseType === 'DEBIT')
                totalDrawing = totalDrawing + (item.amount.amount * -1);
            if (item.baseType === 'CREDIT')
                totalDrawing = totalDrawing + item.amount.amount;
        });

        let dataGST = await this.createReportGSTForBalanceSheet(transactionGST, userId, queryBeginYear);
        totalDrawing += dataGST.privateUsage;
        let totalCurrentEarnings = 0;

        let connectBanks = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(user._id);
        let connectBankIds = connectBanks.map(item => String(item.accountId));
        connectBankIds = connectBankIds.filter(item => item);
        let transactions = await BusinessLoader.transactionBusiness.getTransactionManyBankForReport(userId, connectBankIds, Number(coaOpeningBalance.month), Number(coaOpeningBalance.year), Number(month), Number(queryEndYear));
        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, Number(coaOpeningBalance.month), Number(coaOpeningBalance.year), Number(month), Number(queryEndYear));
        let transactionFollowTime = await Promise.all([transactions, newGJTransactions]);
        const transactionData = this.filterTransactions(transactionFollowTime[0]).concat(transactionFollowTime[1]);

        let dataProfitAndLost = await this.caculatorReportProfitAndLost(transactionData, userId, queryBeginYear);
        totalCurrentEarnings = Number(dataProfitAndLost.items[dataProfitAndLost.items.length - 1].total.toFixed(2));
        data.equity.dataCoa.push({
            type: {
                spacing: 1,
                bold: 0,
                underlined: 0,
                paddingTop: 0,
                fontSize: 9
            },
            name: 'Current Year Earning',
            total: totalCurrentEarnings
        });
        // DataHelper.convertToCurrency(totalCurrentEarnings, {format: 'en-US', currency: 'USD'}) : `(` + DataHelper.convertToCurrency(totalCurrentEarnings * -1, {format: 'en-US', currency: 'USD'}) + `)`
        data.liabilities.nonCurrentLiabilities.data.push({
            name: 'Drawing',
            dataCoa: [{
                type: {
                    spacing: 3,
                    bold: 0,
                    underlined: 0,
                    paddingTop: 0,
                    fontSize: 9
                },
                name: 'Owers Drawing',
                total: totalDrawing
            }],
            type: {
                spacing: 2,
                bold: 0,
                underlined: 0,
                paddingTop: 0,
                fontSize: 9
            },
            total: totalDrawing

        });

        data.liabilities.currentLiabilities.data.push(
            {
                name: 'GST Liabilities',
                dataCoa: [{
                    type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    name: 'GST Collected',
                    total: dataGST.taxCollected,
                    coaCode: '2-1210'
                }, {
                    type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    name: 'GST Paid',
                    total: dataGST.taxPaid * -1,
                    coaCode: '2-1230'
                }],
                type: {
                    spacing: 2,
                    bold: 0,
                    underlined: 0,
                    paddingTop: 0,
                    fontSize: 9
                },
                total: (dataGST.taxCollected + (dataGST.taxPaid * -1))
            }
        );

        console.log('data template report BAlance Sheet===>', data)
        let datagroupReport = await BusinessLoader.groupReportBusiness.getGroupReportByAsset();
        let coasCode: any[] = [];

        datagroupReport.forEach(item => {
            let coas: any[] = item.coas.map(item => item.code);
            coasCode = coasCode.concat(coas);
        });
        data.liabilities.currentLiabilities.data.push(dataBankCreditCard);
        let newtransactionData = transactionData.filter(item => item.coaId);
        let datas = groupArray(newtransactionData, 'coaId.code');
        // eslint-disable-next-line guard-for-in
        for (let item in datas) {
            let dataArrayTransactions: any[] = datas[item];
            let total = 0;
            let coaId = '';
            let coaName = '';
            let coaCode = '';

            let found = coasCode.findIndex(element => {
                return element.toString() === item.toString();
            });
            if (found === -1) {
                for (let i = 0; i < dataArrayTransactions.length; i++) {
                    let item = dataArrayTransactions[i];
                    let amount = item.amount.amount;
                    amount = item.baseType === 'DEBIT' ? - amount : amount;
                    total = total + Number(parseFloat(amount.toFixed(2)));
                    /* Tinh thue cho COA */
                    // if (item.coaId.gstType === GstType.GST || item.coaId.gstType === GstType.CAP)
                    //     total = total + Number(parseFloat((amount / 1.1).toFixed(2)));
                    // else
                    //     total = total + Number(parseFloat(amount.toFixed(2)));
                    coaId = item.coaId._id;
                    coaName = item.coaId.name;
                    coaCode = item.coaId.code;
                }
            }
            else {
                for (let i = 0; i < dataArrayTransactions.length; i++) {
                    let item = dataArrayTransactions[i];
                    let amount = item.amount.amount;
                    amount = item.baseType === 'DEBIT' ? amount : - amount;
                    total = total + Number(parseFloat(amount.toFixed(2)));
                    /* Tinh thue cho COA */
                    // if (item.coaId.gstType === GstType.GST || item.coaId.gstType === GstType.CAP)
                    //     total = total + Number(parseFloat((amount / 1.1).toFixed(2)));
                    // else
                    //     total = total + Number(parseFloat(amount.toFixed(2)));
                    coaId = item.coaId._id;
                    coaName = item.coaId.name;
                    coaCode = item.coaId.code;
                }
            }
            dataGroupTransection.push({
                coaId: coaId,
                coaName: coaName,
                coaCode: coaCode,
                amount: total
            });
        }

        let amountTotalEquity = 0;
        let totalNonCurrentAsset = 0;
        let dataGroupReport: any[] = [];
        for (let i = 0; i < dataGroupTransection.length; i++) {
            let element = dataGroupTransection[i];
            let result = await BusinessLoader.groupReportBusiness.getByCoaIdBalanceSheet(element.coaId);
            if (result) {
                let code = result.code;
                if (result.code === '1-1000') {
                    let amount = totalCurrentAsset;
                    let totalCoa = Number(element.amount);
                    data.asset.currentAsset.dataCoa.push({
                        name: element.coaName, total: totalCoa, type: {
                            spacing: 2,
                            bold: 0,
                            underlined: 0,
                            paddingTop: 0,
                            fontSize: 9
                        },
                    });
                    totalCurrentAsset = amount + element.amount;
                }
                else if (result.code === '3-0000') {
                    let amount = amountTotalEquity;
                    amountTotalEquity = amount + element.amount;
                    let totalCoa = element.amount;
                    data.equity.dataCoa.push({
                        name: element.coaName, total: totalCoa, type: {
                            spacing: 2,
                            bold: 0,
                            underlined: 0,
                            paddingTop: 0,
                            fontSize: 9
                        },
                    });
                }
                else {
                    let checkExists = dataGroupReport.findIndex((ele: any) => {
                        return ele.code === code;
                    });
                    if (checkExists === -1) {
                        dataGroupReport.push({
                            name: result.name,
                            code: result.code,
                            parentId: result.parentId || 0,
                            dataCoa: [{ name: element.coaName, total: element.amount, gstType: element.gstType }]
                        });
                    }
                    else {
                        dataGroupReport[checkExists].dataCoa.push({ 
                            name: element.coaName, 
                            total: element.amount 
                        });
                    }
                }
            }
        }
        let totalCurrentLiabilities = 0;
        let totalNonCurrentLiabilities = 0;
        for (let j = 0; j < dataGroupReport.length; j++) {
            let item = dataGroupReport[j];
            let result = await BusinessLoader.groupReportBusiness.get(item.parentId);
            if (result && result.code === '1-2000') {
                let totalCoa = 0;
                item.dataCoa.forEach(itemCoa => {
                    totalCoa += itemCoa.total;
                });
                totalNonCurrentAsset = totalNonCurrentAsset + totalCoa;
                let coas = item.dataCoa.map(x => x.total > 0 ? {
                    name: x.name, type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    }, total: x.total,
                    coaId: 0
                } : {
                    name: x.name, type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    }, total: x.total,
                    coaId: 0
                    });
                data.asset.nonCurrentAsset.data.push({
                    name: item.name,
                    dataCoa: coas,
                    type: {
                        spacing: 2,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    total: totalCoa,
                });
            }
            else if (result && result.code === '1-3000') {
                let totalCoa = 0;
                item.dataCoa.forEach(itemCoa => {
                    totalCoa += itemCoa.total;
                });
                totalCurrentLiabilities = totalCurrentLiabilities + totalCoa;
                let coas = item.dataCoa.map(x => x.total > 0 ? {
                    name: x.name, type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    }, total: x.total,
                    coaId: 0
                } : {
                    name: x.name, type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    }, total: x.total,
                    coaId: 0
                    });
                data.liabilities.currentLiabilities.data.push({
                    name: item.name,
                    dataCoa: coas,
                    type: {
                        spacing: 2,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    total: totalCoa
                });
            }
            else if (result && result.code === '1-4000') {
                let totalCoa = 0;
                item.dataCoa.forEach(itemCoa => {
                    totalCoa += itemCoa.total;
                });
                totalNonCurrentLiabilities = totalNonCurrentLiabilities + totalCoa;
                let coas = item.dataCoa.map(x => x.total > 0 ? {
                    name: x.name, type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    }, total: x.total
                } : {
                    name: x.name, type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    }, total: x.total
                    });
                data.liabilities.nonCurrentLiabilities.data.push({
                    name: item.name,
                    dataCoa: coas,
                    type: {
                        spacing: 2,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    total: totalCoa
                });
            }
        }

        if (!isHistoricalBalancingAccounts) {
            data.equity.dataCoa.push({
                type: {
                    spacing: 1,
                    bold: 0,
                    underlined: 0,
                    paddingTop: 0,
                    fontSize: 9
                },
                name: 'Historical Balancing Accounts',
                total: totalHistoricalBalancingAccounts = totalHistoricalBankAccounts - totalHistoricalCCAcounts
            });
        } else {
            if(isHistoricalBankAccountsGJ) {
                coaOpeningBalance.dataCoaOpeningBalance.forEach(item => {
                    if(item.coaId.code === '3-9999'){
                        data.equity.dataCoa.push({
                            type: {
                                spacing: 1,
                                bold: 0,
                                underlined: 0,
                                paddingTop: 0,
                                fontSize: 9
                            },
                            name: 'Historical Balancing Accounts',
                            total: totalHistoricalBalancingAccounts = (item.openingBalance - totalHistoricalBankAccountsGJ) - item.openingBalance
                        });
                    }
                })
            }
        }
        let REtotalCurrentEarnings = 0;
        for(let i = coaOpeningBalance.year; i < year; i++){
            if(i < year){
                if(coaOpeningBalance.month >= 7 && month <= 6){

                } else if (month >= 7){
                    let checkRE = false;
                    let endYear = year - 1;
                    (coaOpeningBalance.dataCoaOpeningBalance && coaOpeningBalance.dataCoaOpeningBalance.length) ? coaOpeningBalance.dataCoaOpeningBalance.map(item => {
                        if(item.coaId.code === '3-8000'){
                            checkRE = true;
                        }
                    }) : null
                    if(checkRE){
                        let connectBanks = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(user._id);
                        let connectBankIds = connectBanks.map(item => String(item.accountId));
                        connectBankIds = connectBankIds.filter(item => item);
                        let transactions = await BusinessLoader.transactionBusiness.getTransactionManyBankForReport(userId, connectBankIds, Number(coaOpeningBalance.month), Number(coaOpeningBalance.year), 6, year);
                        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, Number(coaOpeningBalance.month), Number(coaOpeningBalance.year), 6, year);
                        let transactionFollowTime = await Promise.all([transactions, newGJTransactions]);
                        const transactionData = this.filterTransactions(transactionFollowTime[0]).concat(transactionFollowTime[1]);

                        let dataProfitAndLost = await this.caculatorReportProfitAndLost(transactionData, userId, endYear);
                        REtotalCurrentEarnings = Number(dataProfitAndLost.items[dataProfitAndLost.items.length - 1].total.toFixed(2));
                    
                        data.equity.dataCoa.push({
                            type: {
                                spacing: 1,
                                bold: 0,
                                underlined: 0,
                                paddingTop: 0,
                                fontSize: 9
                            },
                            name: 'Retained Earnings',
                            total: REtotalCurrentEarnings
                        })
                    }
                }
            }
        }
        data.equity.totalEquity.total = (amountTotalEquity + totalCurrentEarnings + totalHistoricalBalancingAccounts + REtotalCurrentEarnings);
        data.asset.currentAsset.totalCurrentAsset.total = totalCurrentAsset;
        data.asset.nonCurrentAsset.totalNonCurrentAsset.total = totalNonCurrentAsset;
        data.asset.totalAsset.total = totalCurrentAsset + totalNonCurrentAsset;
        let amountCurrentLiabilities = totalBankCreditCard + (dataGST.taxCollected - dataGST.taxPaid) + totalCurrentLiabilities;
        data.liabilities.currentLiabilities.totalCurrentLiabilities.total = amountCurrentLiabilities;
        data.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities.total = totalDrawing + totalNonCurrentLiabilities;
        data.liabilities.totalLiabilities.total = amountCurrentLiabilities + totalDrawing + totalNonCurrentLiabilities;
        data.netAssets.totalNetAssets = data.asset.totalAsset.total - data.liabilities.totalLiabilities.total;

        let dataTemplate: any = {};
        dataTemplate.user = user;
        dataTemplate.templateData = data;
        dataTemplate.years = { month: month, year: year };
        let monthExport = dataTemplate.years.month;
        let yearExport = dataTemplate.years.year;
        let clientName = dataTemplate.user.fullName;
        let title = 'Balance Sheet';
        let name = clientName + ' - ' + title + ' As of ' + this.convertMonth(monthExport) + ' ' + yearExport;
        let templatePdf = new TemplateBalanceSheetFromCsv(dataTemplate, false).renderHtml(); // Template for Invoice pdf By HTML
        let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.pdf'; // Address and name for new pdf invoice fle

        let options = this.getOptionRender(title);
        await PdfHelper.createPdf(templatePdf, options, localFile);
        let balancePrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, year.toString(), 'bank');

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, balancePrefix, name, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;
    }

    async getBalanceSheetCsvExport(userId: string, originId: string, month: number, year: number): Promise<any> {
        let queryBeginMonth:number = 7;
        let queryBeginYear:number;
        let queryEndYear:number;
        year = Number(year)
        month = Number(month)
        if (month < 7) {
            queryBeginYear = year - 1;
            queryEndYear = year;
        }
        else {
            queryBeginYear = year;
            queryEndYear = year;
        }

        let data: any = {
            asset: {
                name: 'Asset',
                type: {
                    spacing: 0,
                    bold: 1,
                    underlined: 0,
                    paddingTop: 0,
                    fontSize: 10
                },
                currentAsset: {
                    type: {
                        spacing: 1,
                        bold: 1,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    name: 'Current Asset',
                    dataCoa: [],
                    totalCurrentAsset: {
                        type: {
                            spacing: 1,
                            bold: 1,
                            underlined: 1,
                            paddingTop: 0,
                            fontSize: 9
                        },
                        name: 'Total Current Asset',
                        total: 0
                    }
                },
                nonCurrentAsset: {
                    type: {
                        spacing: 1,
                        bold: 1,
                        underlined: 0,
                        paddingTop: 20,
                        fontSize: 9
                    },
                    name: 'Non Current Asset',
                    data: [],
                    totalNonCurrentAsset: {
                        type: {
                            spacing: 1,
                            bold: 1,
                            underlined: 1,
                            paddingTop: 0,
                            fontSize: 9
                        },
                        name: 'Total Non Current Asset',
                        total: 0
                    }
                },
                totalAsset: {
                    type: {
                        spacing: 0,
                        bold: 1,
                        underlined: 1,
                        paddingTop: 0,
                        fontSize: 10
                    },
                    name: 'Total Asset',
                    total: 0
                }
            },
            liabilities: {
                name: 'Liabilities',
                type: {
                    spacing: 0,
                    bold: 1,
                    underlined: 0,
                    paddingTop: 40,
                    fontSize: 10
                },
                currentLiabilities: {
                    type: {
                        spacing: 1,
                        bold: 1,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    name: 'Current Liabilities',
                    data: [],
                    totalCurrentLiabilities: {
                        type: {
                            spacing: 1,
                            bold: 1,
                            underlined: 1,
                            paddingTop: 0,
                            fontSize: 9
                        },
                        name: 'Total Current Liabilities',
                        total: 0
                    }
                },
                nonCurrentLiabilities: {
                    type: {
                        spacing: 1,
                        bold: 1,
                        underlined: 0,
                        paddingTop: 20,
                        fontSize: 9
                    },
                    name: 'Non Current Liabilities',
                    data: [],
                    totalNonCurrentLiabilities: {
                        type: {
                            spacing: 1,
                            bold: 1,
                            underlined: 1,
                            paddingTop: 0,
                            fontSize: 9
                        },
                        name: 'Non Current Liabilities',
                        total: 0
                    }
                },
                totalLiabilities: {
                    type: {
                        spacing: 0,
                        bold: 1,
                        underlined: 1,
                        paddingTop: 0,
                        fontSize: 10
                    },
                    name: 'Total Liabilities',
                    total: 0
                }
            },
            netAssets: {
                name: 'Net Assets',
                type: {
                    spacing: 0,
                    bold: 1,
                    underlined: 0,
                    paddingTop: 40,
                    fontSize: 10
                },
                totalNetAssets: 0
            },
            equity: {
                name: 'Equity',
                type: {
                    spacing: 0,
                    bold: 1,
                    underlined: 0,
                    paddingTop: 40,
                    fontSize: 10
                },
                dataCoa: [],
                totalEquity: {
                    type: {
                        spacing: 0,
                        bold: 1,
                        underlined: 1,
                        paddingTop: 0,
                        fontSize: 10
                    },
                    name: 'Total Equity',
                    total: 0
                }
            }
        };

        let dataBankCreditCard: any = {
            name: 'Credit Card',
            dataCoa: [],
            type: {
                spacing: 2,
                bold: 0,
                underlined: 0,
                paddingTop: 0,
                fontSize: 9
            },
            total: 0
        };

        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');

        let coaOpeningBalance = await BusinessLoader.userBusiness.getUserChartAccountOpeningBalance(user._id);
        if (coaOpeningBalance === undefined){
            throw new ErrorCommon(103, 'Balance Sheet Opening Balance');
        }
        if(coaOpeningBalance.month > Number(month) && coaOpeningBalance.year >= year){
            throw new ErrorCommon(101, 'Download report');
        }
        let hisBalanceAccountsPoint = await BusinessLoader.statementBusiness.getStatementOfClientforBalanceSheetReport(userId, originId, coaOpeningBalance.year, coaOpeningBalance.month);
        let statement = await BusinessLoader.statementBusiness.getStatementOfClientforBalanceSheetReport(userId, originId, year, month);
        if (!statement.length)
            throw new ErrorCommon(102, 'Statement');
        let totalCurrentAsset = 0;
        let totalBankCreditCard = 0;
        let totalHistoricalBankAccounts = 0;
        let totalHistoricalCCAcounts = 0;
        let totalHistoricalBalancingAccounts = 0;
        let isHistoricalBalancingAccounts = false;
        // console.log('statement==>', statement);
        for (let i = 0; i < statement.length; i++) {
            let item = statement[i];
            let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(userId, item.accountId);
            if (!connectBank)
                continue;

            else {
                if (connectBank.type === BankType.Bank) {
                    let totalcloseBalanceBank = Number(item.closeBalance);
                    data.asset.currentAsset.dataCoa.push({
                        name: connectBank.accountName, total: totalcloseBalanceBank, type: {
                            spacing: 2,
                            bold: 0,
                            underlined: 0,
                            paddingTop: 0,
                            fontSize: 9
                        },
                    });
                    totalCurrentAsset = totalCurrentAsset + item.closeBalance;
                    // totalHistoricalBankAccounts += item.openBalance;
                }
                else if (connectBank.type === BankType.CreditCard) {
                    totalBankCreditCard = totalBankCreditCard + item.closeBalance;
                    // totalHistoricalCCAcounts += item.openBalance;
                    dataBankCreditCard.dataCoa.push({
                        type: {
                            spacing: 3,
                            bold: 0,
                            underlined: 0,
                            paddingTop: 0,
                            fontSize: 9
                        },
                        name: connectBank.accountName,
                        total: item.closeBalance
                    });
                }
            }
        }
        for(let i = 0; i < hisBalanceAccountsPoint.length; i++){
            let item = hisBalanceAccountsPoint[i];
            let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(userId, item.accountId);
            if (!connectBank)
                continue;

            else {
                if (connectBank.type === BankType.Bank) {
                    totalHistoricalBankAccounts += item.openBalance;
                }
                else if (connectBank.type === BankType.CreditCard) {
                    totalHistoricalCCAcounts += item.openBalance;
                }
            }
        }
        // console.log('totalHistoricalBankAccounts =>>>>>>>>>>>>>', totalHistoricalBankAccounts);
        // console.log('totalHistoricalCCAcounts =>>>>>>>>>>>>>>>>>>', totalHistoricalCCAcounts);
        dataBankCreditCard.total = totalBankCreditCard;
        // let totalTransactionCrunchTypeExpenses = await BusinessLoader.transactionBusiness.groupByTransactionCrunchTypeExpensesForBalanceSheetReport(user._id, year, month);
        // let totalTransactionCrunchTypeDrawings = await BusinessLoader.transactionBusiness.groupByTransactionCrunchTypeDrawingsForBalanceSheetReport(user._id, year, month);
        let transactionBalanceSheet = await BusinessLoader.transactionBusiness.getTransactionForBalanceSheetReport(user._id,coaOpeningBalance.year, coaOpeningBalance.month, year, month);
        let newGJTransactionAllTimes = await BusinessLoader.generalJournalBusiness.getNewTransactionBalanceSheetByTime(user._id, month, year);

        // sai cho nay do get transactions k co coaId
        let transactionAllTime = await Promise.all([transactionBalanceSheet, newGJTransactionAllTimes]);
        
        let transactionGST = this.filterTransactions(transactionAllTime[0]).concat(transactionAllTime[1]);
        // let chartAccountOpeningBalance = await BusinessLoader.userBusiness.getUserChartAccountOpeningBalance(user._id);
        // transactionGST = transactionGST.filter(transaction => transaction.month >= chartAccountOpeningBalance.month)
        let totalDrawing = 0;
        let dataGroupTransection: any[] = [];
        let totalHistoricalBankAccountsGJ = 0;
        let isHistoricalBankAccountsGJ = (newGJTransactionAllTimes && newGJTransactionAllTimes.length) ? true : false;

        // Calc GJ have COA is Historical Bank Account
        newGJTransactionAllTimes.forEach(item => {
            if(item.coaId.code === '3-9999'){
                if (item.baseType === 'DEBIT')
                    totalHistoricalBankAccountsGJ += (item.amount.amount * -1);
                if (item.baseType === 'CREDIT')
                    totalHistoricalBankAccountsGJ += item.amount.amount;
            }
            
        });

        // let coaOpeningBalance = await BusinessLoader.userBusiness.getUserChartAccountOpeningBalance(user._id);
        if (coaOpeningBalance && coaOpeningBalance.dataCoaOpeningBalance.length) {
            let indexSaleIncome = coaOpeningBalance.dataCoaOpeningBalance.findIndex(x => x.specialCoaName === 'Sales Income');
            if (indexSaleIncome !== -1)
                coaOpeningBalance.dataCoaOpeningBalance.splice(indexSaleIncome, 1);
            let indexDrawing = coaOpeningBalance.dataCoaOpeningBalance.findIndex(x => x.specialCoaName === 'Drawing');
            if (indexDrawing === -1)
                totalDrawing = 0;
            else {
                totalDrawing = coaOpeningBalance.dataCoaOpeningBalance[indexDrawing].openingBalance || 0;
                coaOpeningBalance.dataCoaOpeningBalance.splice(indexDrawing, 1);
            }
            for (let i = 0; i < coaOpeningBalance.dataCoaOpeningBalance.length; i++) {
                let item = coaOpeningBalance.dataCoaOpeningBalance[i];
                if(item.coaId.code === '3-9999'){
                    isHistoricalBalancingAccounts = true;
                }
                let total = item.openingBalance;
                total = Number(parseFloat(total.toFixed(2)));

                // if (item.coaId.gstType === GstType.GST || item.coaId.gstType === GstType.CAP)
                //     total = Number(parseFloat((total / 1.1).toFixed(2)));
                // else
                //     total = Number(parseFloat(total.toFixed(2)));
                dataGroupTransection.push({
                    coaId: item.coaId._id,
                    coaName: item.coaId.name,
                    coaCode: item.coaId.code,
                    amount: total,
                    gstType: item.coaId.gstType
                });
            }
        }
        let drawingtransactionData = transactionGST.filter(item => item.typeCrunch === CrunchType.Drawings && item.year !== 0);

        drawingtransactionData.forEach(item => {
            if (item.baseType === 'DEBIT')
                totalDrawing = totalDrawing + (item.amount.amount * -1);
            if (item.baseType === 'CREDIT')
                totalDrawing = totalDrawing + item.amount.amount;
        });

        let dataGST = await this.createReportGSTForBalanceSheet(transactionGST, userId, queryBeginYear);
        totalDrawing += dataGST.privateUsage;
        let totalCurrentEarnings = 0;

        let connectBanks = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(user._id);
        let connectBankIds = connectBanks.map(item => String(item.accountId));
        connectBankIds = connectBankIds.filter(item => item);
        let transactions = await BusinessLoader.transactionBusiness.getTransactionManyBankForReport(userId, connectBankIds, Number(coaOpeningBalance.month), Number(coaOpeningBalance.year), Number(month), Number(queryEndYear));
        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, Number(coaOpeningBalance.month), Number(coaOpeningBalance.year), Number(month), Number(queryEndYear));
        let transactionFollowTime = await Promise.all([transactions, newGJTransactions]);
        const transactionData = this.filterTransactions(transactionFollowTime[0]).concat(transactionFollowTime[1]);

        let dataProfitAndLost = await this.caculatorReportProfitAndLost(transactionData, userId, queryBeginYear);
        totalCurrentEarnings = Number(dataProfitAndLost.items[dataProfitAndLost.items.length - 1].total.toFixed(2));
        data.equity.dataCoa.push({
            type: {
                spacing: 1,
                bold: 0,
                underlined: 0,
                paddingTop: 0,
                fontSize: 9
            },
            name: 'Current Year Earning',
            total: totalCurrentEarnings
        });
        // DataHelper.convertToCurrency(totalCurrentEarnings, {format: 'en-US', currency: 'USD'}) : `(` + DataHelper.convertToCurrency(totalCurrentEarnings * -1, {format: 'en-US', currency: 'USD'}) + `)`
        data.liabilities.nonCurrentLiabilities.data.push({
            name: 'Drawing',
            dataCoa: [{
                type: {
                    spacing: 3,
                    bold: 0,
                    underlined: 0,
                    paddingTop: 0,
                    fontSize: 9
                },
                name: 'Owers Drawing',
                total: totalDrawing
            }],
            type: {
                spacing: 2,
                bold: 0,
                underlined: 0,
                paddingTop: 0,
                fontSize: 9
            },
            total: totalDrawing

        });

        data.liabilities.currentLiabilities.data.push(
            {
                name: 'GST Liabilities',
                dataCoa: [{
                    type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    name: 'GST Collected',
                    total: dataGST.taxCollected,
                    coaCode: '2-1210'
                }, {
                    type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    name: 'GST Paid',
                    total: dataGST.taxPaid * -1,
                    coaCode: '2-1230'
                }],
                type: {
                    spacing: 2,
                    bold: 0,
                    underlined: 0,
                    paddingTop: 0,
                    fontSize: 9
                },
                total: (dataGST.taxCollected + (dataGST.taxPaid * -1))
            }
        );

        console.log('data template report BAlance Sheet===>', data)
        let datagroupReport = await BusinessLoader.groupReportBusiness.getGroupReportByAsset();
        let coasCode: any[] = [];

        datagroupReport.forEach(item => {
            let coas: any[] = item.coas.map(item => item.code);
            coasCode = coasCode.concat(coas);
        });
        data.liabilities.currentLiabilities.data.push(dataBankCreditCard);
        let newtransactionData = transactionData.filter(item => item.coaId);
        let datas = groupArray(newtransactionData, 'coaId.code');
        // eslint-disable-next-line guard-for-in
        for (let item in datas) {
            let dataArrayTransactions: any[] = datas[item];
            let total = 0;
            let coaId = '';
            let coaName = '';
            let coaCode = '';

            let found = coasCode.findIndex(element => {
                return element.toString() === item.toString();
            });
            if (found === -1) {
                for (let i = 0; i < dataArrayTransactions.length; i++) {
                    let item = dataArrayTransactions[i];
                    let amount = item.amount.amount;
                    amount = item.baseType === 'DEBIT' ? - amount : amount;
                    total = total + Number(parseFloat(amount.toFixed(2)));
                    /* Tinh thue cho COA */
                    // if (item.coaId.gstType === GstType.GST || item.coaId.gstType === GstType.CAP)
                    //     total = total + Number(parseFloat((amount / 1.1).toFixed(2)));
                    // else
                    //     total = total + Number(parseFloat(amount.toFixed(2)));
                    coaId = item.coaId._id;
                    coaName = item.coaId.name;
                    coaCode = item.coaId.code;
                }
            }
            else {
                for (let i = 0; i < dataArrayTransactions.length; i++) {
                    let item = dataArrayTransactions[i];
                    let amount = item.amount.amount;
                    amount = item.baseType === 'DEBIT' ? amount : - amount;
                    total = total + Number(parseFloat(amount.toFixed(2)));
                    /* Tinh thue cho COA */
                    // if (item.coaId.gstType === GstType.GST || item.coaId.gstType === GstType.CAP)
                    //     total = total + Number(parseFloat((amount / 1.1).toFixed(2)));
                    // else
                    //     total = total + Number(parseFloat(amount.toFixed(2)));
                    coaId = item.coaId._id;
                    coaName = item.coaId.name;
                    coaCode = item.coaId.code;
                }
            }
            dataGroupTransection.push({
                coaId: coaId,
                coaName: coaName,
                coaCode: coaCode,
                amount: total
            });
        }

        let amountTotalEquity = 0;
        let totalNonCurrentAsset = 0;
        let dataGroupReport: any[] = [];
        for (let i = 0; i < dataGroupTransection.length; i++) {
            let element = dataGroupTransection[i];
            let result = await BusinessLoader.groupReportBusiness.getByCoaIdBalanceSheet(element.coaId);
            if (result) {
                let code = result.code;
                if (result.code === '1-1000') {
                    let amount = totalCurrentAsset;
                    let totalCoa = Number(element.amount);
                    data.asset.currentAsset.dataCoa.push({
                        name: element.coaName, total: totalCoa, type: {
                            spacing: 2,
                            bold: 0,
                            underlined: 0,
                            paddingTop: 0,
                            fontSize: 9
                        },
                    });
                    totalCurrentAsset = amount + element.amount;
                }
                else if (result.code === '3-0000') {
                    let amount = amountTotalEquity;
                    amountTotalEquity = amount + element.amount;
                    let totalCoa = element.amount;
                    data.equity.dataCoa.push({
                        name: element.coaName, total: totalCoa, type: {
                            spacing: 2,
                            bold: 0,
                            underlined: 0,
                            paddingTop: 0,
                            fontSize: 9
                        },
                    });
                }
                else {
                    let checkExists = dataGroupReport.findIndex((ele: any) => {
                        return ele.code === code;
                    });
                    if (checkExists === -1) {
                        dataGroupReport.push({
                            name: result.name,
                            code: result.code,
                            parentId: result.parentId || 0,
                            dataCoa: [{ name: element.coaName, total: element.amount, gstType: element.gstType }]
                        });
                    }
                    else {
                        dataGroupReport[checkExists].dataCoa.push({ 
                            name: element.coaName, 
                            total: element.amount 
                        });
                    }
                }
            }
        }
        let totalCurrentLiabilities = 0;
        let totalNonCurrentLiabilities = 0;
        for (let j = 0; j < dataGroupReport.length; j++) {
            let item = dataGroupReport[j];
            let result = await BusinessLoader.groupReportBusiness.get(item.parentId);
            if (result && result.code === '1-2000') {
                let totalCoa = 0;
                item.dataCoa.forEach(itemCoa => {
                    totalCoa += itemCoa.total;
                });
                totalNonCurrentAsset = totalNonCurrentAsset + totalCoa;
                let coas = item.dataCoa.map(x => x.total > 0 ? {
                    name: x.name, type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    }, total: x.total,
                    coaId: 0
                } : {
                    name: x.name, type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    }, total: x.total,
                    coaId: 0
                    });
                data.asset.nonCurrentAsset.data.push({
                    name: item.name,
                    dataCoa: coas,
                    type: {
                        spacing: 2,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    total: totalCoa,
                });
            }
            else if (result && result.code === '1-3000') {
                let totalCoa = 0;
                item.dataCoa.forEach(itemCoa => {
                    totalCoa += itemCoa.total;
                });
                totalCurrentLiabilities = totalCurrentLiabilities + totalCoa;
                let coas = item.dataCoa.map(x => x.total > 0 ? {
                    name: x.name, type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    }, total: x.total,
                    coaId: 0
                } : {
                    name: x.name, type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    }, total: x.total,
                    coaId: 0
                    });
                data.liabilities.currentLiabilities.data.push({
                    name: item.name,
                    dataCoa: coas,
                    type: {
                        spacing: 2,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    total: totalCoa
                });
            }
            else if (result && result.code === '1-4000') {
                let totalCoa = 0;
                item.dataCoa.forEach(itemCoa => {
                    totalCoa += itemCoa.total;
                });
                totalNonCurrentLiabilities = totalNonCurrentLiabilities + totalCoa;
                let coas = item.dataCoa.map(x => x.total > 0 ? {
                    name: x.name, type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    }, total: x.total
                } : {
                    name: x.name, type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    }, total: x.total
                    });
                data.liabilities.nonCurrentLiabilities.data.push({
                    name: item.name,
                    dataCoa: coas,
                    type: {
                        spacing: 2,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    total: totalCoa
                });
            }
        }

        if (!isHistoricalBalancingAccounts) {
            data.equity.dataCoa.push({
                type: {
                    spacing: 1,
                    bold: 0,
                    underlined: 0,
                    paddingTop: 0,
                    fontSize: 9
                },
                name: 'Historical Balancing Accounts',
                total: totalHistoricalBalancingAccounts = totalHistoricalBankAccounts - totalHistoricalCCAcounts
            });
        } else {
            if(isHistoricalBankAccountsGJ) {
                coaOpeningBalance.dataCoaOpeningBalance.forEach(item => {
                    if(item.coaId.code === '3-9999'){
                        data.equity.dataCoa.push({
                            type: {
                                spacing: 1,
                                bold: 0,
                                underlined: 0,
                                paddingTop: 0,
                                fontSize: 9
                            },
                            name: 'Historical Balancing Accounts',
                            total: totalHistoricalBalancingAccounts = (item.openingBalance - totalHistoricalBankAccountsGJ) - item.openingBalance
                        });
                    }
                })
            }
        }
        let REtotalCurrentEarnings = 0;
        for(let i = coaOpeningBalance.year; i < year; i++){
            if(i < year){
                if(coaOpeningBalance.month >= 7 && month <= 6){

                } else if (month >= 7){
                    let checkRE = false;
                    let endYear = year - 1;
                    (coaOpeningBalance.dataCoaOpeningBalance && coaOpeningBalance.dataCoaOpeningBalance.length) ? coaOpeningBalance.dataCoaOpeningBalance.map(item => {
                        if(item.coaId.code === '3-8000'){
                            checkRE = true;
                        }
                    }) : null
                    if(checkRE){
                        let connectBanks = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(user._id);
                        let connectBankIds = connectBanks.map(item => String(item.accountId));
                        connectBankIds = connectBankIds.filter(item => item);
                        let transactions = await BusinessLoader.transactionBusiness.getTransactionManyBankForReport(userId, connectBankIds, Number(coaOpeningBalance.month), Number(coaOpeningBalance.year), 6, year);
                        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, Number(coaOpeningBalance.month), Number(coaOpeningBalance.year), 6, year);
                        let transactionFollowTime = await Promise.all([transactions, newGJTransactions]);
                        const transactionData = this.filterTransactions(transactionFollowTime[0]).concat(transactionFollowTime[1]);

                        let dataProfitAndLost = await this.caculatorReportProfitAndLost(transactionData, userId, endYear);
                        REtotalCurrentEarnings = Number(dataProfitAndLost.items[dataProfitAndLost.items.length - 1].total.toFixed(2));
                    
                        data.equity.dataCoa.push({
                            type: {
                                spacing: 1,
                                bold: 0,
                                underlined: 0,
                                paddingTop: 0,
                                fontSize: 9
                            },
                            name: 'Retained Earnings',
                            total: REtotalCurrentEarnings
                        })
                    }
                }
            }
        }
        data.equity.totalEquity.total = (amountTotalEquity + totalCurrentEarnings + totalHistoricalBalancingAccounts + REtotalCurrentEarnings);
        data.asset.currentAsset.totalCurrentAsset.total = totalCurrentAsset;
        data.asset.nonCurrentAsset.totalNonCurrentAsset.total = totalNonCurrentAsset;
        data.asset.totalAsset.total = totalCurrentAsset + totalNonCurrentAsset;
        let amountCurrentLiabilities = totalBankCreditCard + (dataGST.taxCollected - dataGST.taxPaid) + totalCurrentLiabilities;
        data.liabilities.currentLiabilities.totalCurrentLiabilities.total = amountCurrentLiabilities;
        data.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities.total = totalDrawing + totalNonCurrentLiabilities;
        data.liabilities.totalLiabilities.total = amountCurrentLiabilities + totalDrawing + totalNonCurrentLiabilities;
        data.netAssets.totalNetAssets = data.asset.totalAsset.total - data.liabilities.totalLiabilities.total;

        let dataTemplate: any = [];
        dataTemplate.user = user;
        dataTemplate.templateData = data;
        dataTemplate.years = { month: month, year: year };
        let monthExport = dataTemplate.years.month;
        let yearExport = dataTemplate.years.year;
        let clientName = dataTemplate.user.fullName;
        let title = 'Balance Sheet';
        let name = clientName + ' - ' + title + ' As of ' + this.convertMonth(monthExport) + ' ' + yearExport;
        let csvContent = new TemplateBalanceSheetCsv(dataTemplate);
        let fileName = `${name}.csv`;
        let localFile = 'tmp/' + title.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('&', 'g'), 'and') + '.csv';
        fs.writeFileSync(localFile, csvContent.renderCsvContent());
        let balancePrefix = GoogleStorageHelper.getTransactionPrefix(userId, 1, year.toString(), 'bank');

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, balancePrefix, fileName, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;

    }

    async getPreviewBalanceSheetReportPdf(userId: string, originId: string, month: number, year: number): Promise<any> {
        let queryBeginYear:number;
        let queryEndYear:number;
        year = Number(year)
        month = Number(month)
        if (month < 7) {
            queryBeginYear = year - 1;
            queryEndYear = year;
        }
        else {
            queryBeginYear = year;
            queryEndYear = year;
        }

        let data: any = {
            asset: {
                name: 'Asset',
                type: {
                    spacing: 0,
                    bold: 1,
                    underlined: 0,
                    paddingTop: 0,
                    fontSize: 10
                },
                currentAsset: {
                    type: {
                        spacing: 1,
                        bold: 1,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    name: 'Current Asset',
                    dataCoa: [],
                    totalCurrentAsset: {
                        type: {
                            spacing: 1,
                            bold: 1,
                            underlined: 1,
                            paddingTop: 0,
                            fontSize: 9
                        },
                        name: 'Total Current Asset',
                        total: 0
                    }
                },
                nonCurrentAsset: {
                    type: {
                        spacing: 1,
                        bold: 1,
                        underlined: 0,
                        paddingTop: 20,
                        fontSize: 9
                    },
                    name: 'Non Current Asset',
                    data: [],
                    totalNonCurrentAsset: {
                        type: {
                            spacing: 1,
                            bold: 1,
                            underlined: 1,
                            paddingTop: 0,
                            fontSize: 9
                        },
                        name: 'Total Non Current Asset',
                        total: 0
                    }
                },
                totalAsset: {
                    type: {
                        spacing: 0,
                        bold: 1,
                        underlined: 1,
                        paddingTop: 0,
                        fontSize: 10
                    },
                    name: 'Total Asset',
                    total: 0
                }
            },
            liabilities: {
                name: 'Liabilities',
                type: {
                    spacing: 0,
                    bold: 1,
                    underlined: 0,
                    paddingTop: 40,
                    fontSize: 10
                },
                currentLiabilities: {
                    type: {
                        spacing: 1,
                        bold: 1,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    name: 'Current Liabilities',
                    data: [],
                    totalCurrentLiabilities: {
                        type: {
                            spacing: 1,
                            bold: 1,
                            underlined: 1,
                            paddingTop: 0,
                            fontSize: 9
                        },
                        name: 'Total Current Liabilities',
                        total: 0
                    }
                },
                nonCurrentLiabilities: {
                    type: {
                        spacing: 1,
                        bold: 1,
                        underlined: 0,
                        paddingTop: 20,
                        fontSize: 9
                    },
                    name: 'Non Current Liabilities',
                    data: [],
                    totalNonCurrentLiabilities: {
                        type: {
                            spacing: 1,
                            bold: 1,
                            underlined: 1,
                            paddingTop: 0,
                            fontSize: 9
                        },
                        name: 'Non Current Liabilities',
                        total: 0
                    }
                },
                totalLiabilities: {
                    type: {
                        spacing: 0,
                        bold: 1,
                        underlined: 1,
                        paddingTop: 0,
                        fontSize: 10
                    },
                    name: 'Total Liabilities',
                    total: 0
                }
            },
            netAssets: {
                name: 'Net Assets',
                type: {
                    spacing: 0,
                    bold: 1,
                    underlined: 0,
                    paddingTop: 40,
                    fontSize: 10
                },
                totalNetAssets: 0
            },
            equity: {
                name: 'Equity',
                type: {
                    spacing: 0,
                    bold: 1,
                    underlined: 0,
                    paddingTop: 40,
                    fontSize: 10
                },
                dataCoa: [],
                totalEquity: {
                    type: {
                        spacing: 0,
                        bold: 1,
                        underlined: 1,
                        paddingTop: 0,
                        fontSize: 10
                    },
                    name: 'Total Equity',
                    total: 0
                }
            }
        };

        let dataBankCreditCard: any = {
            name: 'Credit Card',
            dataCoa: [],
            type: {
                spacing: 2,
                bold: 0,
                underlined: 0,
                paddingTop: 0,
                fontSize: 9
            },
            total: 0
        };

        let user: any = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'Client');

        let coaOpeningBalance = await BusinessLoader.userBusiness.getUserChartAccountOpeningBalance(user._id);
        if (coaOpeningBalance === undefined){
            throw new ErrorCommon(103, 'Balance Sheet Opening Balance');
        }
        if(coaOpeningBalance.month > Number(month) && coaOpeningBalance.year >= year){
            throw new ErrorCommon(101, 'Download report');
        }
        let hisBalanceAccountsPoint = await BusinessLoader.statementBusiness.getStatementOfClientforBalanceSheetReport(userId, originId, coaOpeningBalance.year, coaOpeningBalance.month);
        let statement = await BusinessLoader.statementBusiness.getStatementOfClientforBalanceSheetReport(userId, originId, year, month);
        if (!statement.length)
            throw new ErrorCommon(102, 'Statement');
        let totalCurrentAsset = 0;
        let totalBankCreditCard = 0;
        let totalHistoricalBankAccounts = 0;
        let totalHistoricalCCAcounts = 0;
        let totalHistoricalBalancingAccounts = 0;
        let isHistoricalBalancingAccounts = false;
        // console.log('statement==>', statement);
        for (let i = 0; i < statement.length; i++) {
            let item = statement[i];
            let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(userId, item.accountId);
            if (!connectBank)
                continue;

            else {
                if (connectBank.type === BankType.Bank) {
                    let totalcloseBalanceBank = Number(item.closeBalance);
                    data.asset.currentAsset.dataCoa.push({
                        name: connectBank.accountName, total: totalcloseBalanceBank, type: {
                            spacing: 2,
                            bold: 0,
                            underlined: 0,
                            paddingTop: 0,
                            fontSize: 9
                        },
                    });
                    totalCurrentAsset = totalCurrentAsset + item.closeBalance;
                    // totalHistoricalBankAccounts += item.openBalance;
                }
                else if (connectBank.type === BankType.CreditCard) {
                    totalBankCreditCard = totalBankCreditCard + item.closeBalance;
                    // totalHistoricalCCAcounts += item.openBalance;
                    dataBankCreditCard.dataCoa.push({
                        type: {
                            spacing: 3,
                            bold: 0,
                            underlined: 0,
                            paddingTop: 0,
                            fontSize: 9
                        },
                        name: connectBank.accountName,
                        total: item.closeBalance
                    });
                }
            }
        }
        for(let i = 0; i < hisBalanceAccountsPoint.length; i++){
            let item = hisBalanceAccountsPoint[i];
            let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(userId, item.accountId);
            if (!connectBank)
                continue;

            else {
                if (connectBank.type === BankType.Bank) {
                    totalHistoricalBankAccounts += item.openBalance;
                }
                else if (connectBank.type === BankType.CreditCard) {
                    totalHistoricalCCAcounts += item.openBalance;
                }
            }
        }
        // console.log('totalHistoricalBankAccounts =>>>>>>>>>>>>>', totalHistoricalBankAccounts);
        // console.log('totalHistoricalCCAcounts =>>>>>>>>>>>>>>>>>>', totalHistoricalCCAcounts);
        dataBankCreditCard.total = totalBankCreditCard;
        // let totalTransactionCrunchTypeExpenses = await BusinessLoader.transactionBusiness.groupByTransactionCrunchTypeExpensesForBalanceSheetReport(user._id, year, month);
        // let totalTransactionCrunchTypeDrawings = await BusinessLoader.transactionBusiness.groupByTransactionCrunchTypeDrawingsForBalanceSheetReport(user._id, year, month);
        let transactionBalanceSheet = await BusinessLoader.transactionBusiness.getTransactionForBalanceSheetReport(user._id,coaOpeningBalance.year, coaOpeningBalance.month, year, month);
        let newGJTransactionAllTimes = await BusinessLoader.generalJournalBusiness.getNewTransactionBalanceSheetByTime(user._id, month, year);

        // sai cho nay do get transactions k co coaId
        let transactionAllTime = await Promise.all([transactionBalanceSheet, newGJTransactionAllTimes]);
        
        let transactionGST = this.filterTransactions(transactionAllTime[0]).concat(transactionAllTime[1]);
        // let chartAccountOpeningBalance = await BusinessLoader.userBusiness.getUserChartAccountOpeningBalance(user._id);
        // transactionGST = transactionGST.filter(transaction => transaction.month >= chartAccountOpeningBalance.month)
        let totalDrawing = 0;
        let dataGroupTransection: any[] = [];
        let totalHistoricalBankAccountsGJ = 0;
        let isHistoricalBankAccountsGJ = (newGJTransactionAllTimes && newGJTransactionAllTimes.length) ? true : false;

        // Calc GJ have COA is Historical Bank Account
        newGJTransactionAllTimes.forEach(item => {
            if(item.coaId.code === '3-9999'){
                if (item.baseType === 'DEBIT')
                    totalHistoricalBankAccountsGJ += (item.amount.amount * -1);
                if (item.baseType === 'CREDIT')
                    totalHistoricalBankAccountsGJ += item.amount.amount;
            }
            
        });

        // let coaOpeningBalance = await BusinessLoader.userBusiness.getUserChartAccountOpeningBalance(user._id);
        if (coaOpeningBalance && coaOpeningBalance.dataCoaOpeningBalance.length) {
            let indexSaleIncome = coaOpeningBalance.dataCoaOpeningBalance.findIndex(x => x.specialCoaName === 'Sales Income');
            if (indexSaleIncome !== -1)
                coaOpeningBalance.dataCoaOpeningBalance.splice(indexSaleIncome, 1);
            let indexDrawing = coaOpeningBalance.dataCoaOpeningBalance.findIndex(x => x.specialCoaName === 'Drawing');
            if (indexDrawing === -1)
                totalDrawing = 0;
            else {
                totalDrawing = coaOpeningBalance.dataCoaOpeningBalance[indexDrawing].openingBalance || 0;
                coaOpeningBalance.dataCoaOpeningBalance.splice(indexDrawing, 1);
            }
            for (let i = 0; i < coaOpeningBalance.dataCoaOpeningBalance.length; i++) {
                let item = coaOpeningBalance.dataCoaOpeningBalance[i];
                if(item.coaId.code === '3-9999'){
                    isHistoricalBalancingAccounts = true;
                }
                let total = item.openingBalance;
                total = Number(parseFloat(total.toFixed(2)));

                // if (item.coaId.gstType === GstType.GST || item.coaId.gstType === GstType.CAP)
                //     total = Number(parseFloat((total / 1.1).toFixed(2)));
                // else
                //     total = Number(parseFloat(total.toFixed(2)));
                dataGroupTransection.push({
                    coaId: item.coaId._id,
                    coaName: item.coaId.name,
                    coaCode: item.coaId.code,
                    amount: total,
                    gstType: item.coaId.gstType
                });
            }
        }
        let drawingtransactionData = transactionGST.filter(item => item.typeCrunch === CrunchType.Drawings && item.year !== 0);

        drawingtransactionData.forEach(item => {
            if (item.baseType === 'DEBIT')
                totalDrawing = totalDrawing + (item.amount.amount * -1);
            if (item.baseType === 'CREDIT')
                totalDrawing = totalDrawing + item.amount.amount;
        });

        let dataGST = await this.createReportGSTForBalanceSheet(transactionGST, userId, queryBeginYear);
        totalDrawing += dataGST.privateUsage;
        let totalCurrentEarnings = 0;

        let connectBanks = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(user._id);
        let connectBankIds = connectBanks.map(item => String(item.accountId));
        connectBankIds = connectBankIds.filter(item => item);
        let transactions = await BusinessLoader.transactionBusiness.getTransactionManyBankForReport(userId, connectBankIds, Number(coaOpeningBalance.month), Number(coaOpeningBalance.year), Number(month), Number(queryEndYear));
        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, Number(coaOpeningBalance.month), Number(coaOpeningBalance.year), Number(month), Number(queryEndYear));
        let transactionFollowTime = await Promise.all([transactions, newGJTransactions]);
        const transactionData = this.filterTransactions(transactionFollowTime[0]).concat(transactionFollowTime[1]);

        let dataProfitAndLost = await this.caculatorReportProfitAndLost(transactionData, userId, queryBeginYear);
        totalCurrentEarnings = Number(dataProfitAndLost.items[dataProfitAndLost.items.length - 1].total.toFixed(2));
        data.equity.dataCoa.push({
            type: {
                spacing: 1,
                bold: 0,
                underlined: 0,
                paddingTop: 0,
                fontSize: 9
            },
            name: 'Current Year Earning',
            total: totalCurrentEarnings
        });
        // DataHelper.convertToCurrency(totalCurrentEarnings, {format: 'en-US', currency: 'USD'}) : `(` + DataHelper.convertToCurrency(totalCurrentEarnings * -1, {format: 'en-US', currency: 'USD'}) + `)`
        data.liabilities.nonCurrentLiabilities.data.push({
            name: 'Drawing',
            dataCoa: [{
                type: {
                    spacing: 3,
                    bold: 0,
                    underlined: 0,
                    paddingTop: 0,
                    fontSize: 9
                },
                name: 'Owers Drawing',
                total: totalDrawing
            }],
            type: {
                spacing: 2,
                bold: 0,
                underlined: 0,
                paddingTop: 0,
                fontSize: 9
            },
            total: totalDrawing

        });

        data.liabilities.currentLiabilities.data.push(
            {
                name: 'GST Liabilities',
                dataCoa: [{
                    type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    name: 'GST Collected',
                    total: dataGST.taxCollected,
                    coaCode: '2-1210'
                }, {
                    type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    name: 'GST Paid',
                    total: dataGST.taxPaid * -1,
                    coaCode: '2-1230'
                }],
                type: {
                    spacing: 2,
                    bold: 0,
                    underlined: 0,
                    paddingTop: 0,
                    fontSize: 9
                },
                total: (dataGST.taxCollected + (dataGST.taxPaid * -1))
            }
        );

        console.log('data template report BAlance Sheet===>', data)
        let datagroupReport = await BusinessLoader.groupReportBusiness.getGroupReportByAsset();
        let coasCode: any[] = [];

        datagroupReport.forEach(item => {
            let coas: any[] = item.coas.map(item => item.code);
            coasCode = coasCode.concat(coas);
        });
        data.liabilities.currentLiabilities.data.push(dataBankCreditCard);
        let newtransactionData = transactionData.filter(item => item.coaId);
        let datas = groupArray(newtransactionData, 'coaId.code');
        // eslint-disable-next-line guard-for-in
        for (let item in datas) {
            let dataArrayTransactions: any[] = datas[item];
            let total = 0;
            let coaId = '';
            let coaName = '';
            let coaCode = '';

            let found = coasCode.findIndex(element => {
                return element.toString() === item.toString();
            });
            if (found === -1) {
                for (let i = 0; i < dataArrayTransactions.length; i++) {
                    let item = dataArrayTransactions[i];
                    let amount = item.amount.amount;
                    amount = item.baseType === 'DEBIT' ? - amount : amount;
                    total = total + Number(parseFloat(amount.toFixed(2)));
                    coaId = item.coaId._id;
                    coaName = item.coaId.name;
                    coaCode = item.coaId.code;
                }
            }
            else {
                for (let i = 0; i < dataArrayTransactions.length; i++) {
                    let item = dataArrayTransactions[i];
                    let amount = item.amount.amount;
                    amount = item.baseType === 'DEBIT' ? amount : - amount;
                    total = total + Number(parseFloat(amount.toFixed(2)));
                    coaId = item.coaId._id;
                    coaName = item.coaId.name;
                    coaCode = item.coaId.code;
                }
            }
            dataGroupTransection.push({
                coaId: coaId,
                coaName: coaName,
                coaCode: coaCode,
                amount: total
            });
        }

        let amountTotalEquity = 0;
        let totalNonCurrentAsset = 0;
        let dataGroupReport: any[] = [];
        for (let i = 0; i < dataGroupTransection.length; i++) {
            let element = dataGroupTransection[i];
            let result = await BusinessLoader.groupReportBusiness.getByCoaIdBalanceSheet(element.coaId);
            if (result) {
                let code = result.code;
                if (result.code === '1-1000') {
                    let amount = totalCurrentAsset;
                    let totalCoa = Number(element.amount);
                    data.asset.currentAsset.dataCoa.push({
                        name: element.coaName, total: totalCoa, type: {
                            spacing: 2,
                            bold: 0,
                            underlined: 0,
                            paddingTop: 0,
                            fontSize: 9
                        },
                    });
                    totalCurrentAsset = amount + element.amount;
                }
                else if (result.code === '3-0000') {
                    let amount = amountTotalEquity;
                    amountTotalEquity = amount + element.amount;
                    let totalCoa = element.amount;
                    data.equity.dataCoa.push({
                        name: element.coaName, total: totalCoa, type: {
                            spacing: 2,
                            bold: 0,
                            underlined: 0,
                            paddingTop: 0,
                            fontSize: 9
                        },
                    });
                }
                else {
                    let checkExists = dataGroupReport.findIndex((ele: any) => {
                        return ele.code === code;
                    });
                    if (checkExists === -1) {
                        dataGroupReport.push({
                            name: result.name,
                            code: result.code,
                            parentId: result.parentId || 0,
                            dataCoa: [{ name: element.coaName, total: element.amount, gstType: element.gstType }]
                        });
                    }
                    else {
                        dataGroupReport[checkExists].dataCoa.push({ 
                            name: element.coaName, 
                            total: element.amount 
                        });
                    }
                }
            }
        }
        let totalCurrentLiabilities = 0;
        let totalNonCurrentLiabilities = 0;
        for (let j = 0; j < dataGroupReport.length; j++) {
            let item = dataGroupReport[j];
            let result = await BusinessLoader.groupReportBusiness.get(item.parentId);
            if (result && result.code === '1-2000') {
                let totalCoa = 0;
                item.dataCoa.forEach(itemCoa => {
                    totalCoa += itemCoa.total;
                });
                totalNonCurrentAsset = totalNonCurrentAsset + totalCoa;
                let coas = item.dataCoa.map(x => x.total > 0 ? {
                    name: x.name, type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    }, total: x.total,
                    coaId: 0
                } : {
                    name: x.name, type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    }, total: x.total,
                    coaId: 0
                    });
                data.asset.nonCurrentAsset.data.push({
                    name: item.name,
                    dataCoa: coas,
                    type: {
                        spacing: 2,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    total: totalCoa,
                });
            }
            else if (result && result.code === '1-3000') {
                let totalCoa = 0;
                item.dataCoa.forEach(itemCoa => {
                    totalCoa += itemCoa.total;
                });
                totalCurrentLiabilities = totalCurrentLiabilities + totalCoa;
                let coas = item.dataCoa.map(x => x.total > 0 ? {
                    name: x.name, type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    }, total: x.total,
                    coaId: 0
                } : {
                    name: x.name, type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    }, total: x.total,
                    coaId: 0
                    });
                data.liabilities.currentLiabilities.data.push({
                    name: item.name,
                    dataCoa: coas,
                    type: {
                        spacing: 2,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    total: totalCoa
                });
            }
            else if (result && result.code === '1-4000') {
                let totalCoa = 0;
                item.dataCoa.forEach(itemCoa => {
                    totalCoa += itemCoa.total;
                });
                totalNonCurrentLiabilities = totalNonCurrentLiabilities + totalCoa;
                let coas = item.dataCoa.map(x => x.total > 0 ? {
                    name: x.name, type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    }, total: x.total
                } : {
                    name: x.name, type: {
                        spacing: 3,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    }, total: x.total
                    });
                data.liabilities.nonCurrentLiabilities.data.push({
                    name: item.name,
                    dataCoa: coas,
                    type: {
                        spacing: 2,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: 9
                    },
                    total: totalCoa
                });
            }
        }

        if (!isHistoricalBalancingAccounts) {
            data.equity.dataCoa.push({
                type: {
                    spacing: 1,
                    bold: 0,
                    underlined: 0,
                    paddingTop: 0,
                    fontSize: 9
                },
                name: 'Historical Balancing Accounts',
                total: totalHistoricalBalancingAccounts = totalHistoricalBankAccounts - totalHistoricalCCAcounts
            });
        } else {
            if(isHistoricalBankAccountsGJ) {
                coaOpeningBalance.dataCoaOpeningBalance.forEach(item => {
                    if(item.coaId.code === '3-9999'){
                        data.equity.dataCoa.push({
                            type: {
                                spacing: 1,
                                bold: 0,
                                underlined: 0,
                                paddingTop: 0,
                                fontSize: 9
                            },
                            name: 'Historical Balancing Accounts',
                            total: totalHistoricalBalancingAccounts = (item.openingBalance - totalHistoricalBankAccountsGJ) - item.openingBalance
                        });
                    }
                })
            }
        }
        let REtotalCurrentEarnings = 0;
        for(let i = coaOpeningBalance.year; i < year; i++){
            if(i < year){
                if(coaOpeningBalance.month >= 7 && month <= 6){

                } else if (month >= 7){
                    let checkRE = false;
                    let endYear = year - 1;
                    (coaOpeningBalance.dataCoaOpeningBalance && coaOpeningBalance.dataCoaOpeningBalance.length) ? coaOpeningBalance.dataCoaOpeningBalance.map(item => {
                        if(item.coaId.code === '3-8000'){
                            checkRE = true;
                        }
                    }) : null
                    if(checkRE){
                        let connectBanks = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(user._id);
                        let connectBankIds = connectBanks.map(item => String(item.accountId));
                        connectBankIds = connectBankIds.filter(item => item);
                        let transactions = await BusinessLoader.transactionBusiness.getTransactionManyBankForReport(userId, connectBankIds, Number(coaOpeningBalance.month), Number(coaOpeningBalance.year), 6, year);
                        const newGJTransactions = await BusinessLoader.generalJournalBusiness.getNewTransactionGJByTime(userId, Number(coaOpeningBalance.month), Number(coaOpeningBalance.year), 6, year);
                        let transactionFollowTime = await Promise.all([transactions, newGJTransactions]);
                        const transactionData = this.filterTransactions(transactionFollowTime[0]).concat(transactionFollowTime[1]);

                        let dataProfitAndLost = await this.caculatorReportProfitAndLost(transactionData, userId, endYear);
                        REtotalCurrentEarnings = Number(dataProfitAndLost.items[dataProfitAndLost.items.length - 1].total.toFixed(2));
                    
                        data.equity.dataCoa.push({
                            type: {
                                spacing: 1,
                                bold: 0,
                                underlined: 0,
                                paddingTop: 0,
                                fontSize: 9
                            },
                            name: 'Retained Earnings',
                            total: REtotalCurrentEarnings
                        })
                    }
                }
            }
        }
        data.equity.totalEquity.total = (amountTotalEquity + totalCurrentEarnings + totalHistoricalBalancingAccounts + REtotalCurrentEarnings);
        data.asset.currentAsset.totalCurrentAsset.total = totalCurrentAsset;
        data.asset.nonCurrentAsset.totalNonCurrentAsset.total = totalNonCurrentAsset;
        data.asset.totalAsset.total = totalCurrentAsset + totalNonCurrentAsset;
        let amountCurrentLiabilities = totalBankCreditCard + (dataGST.taxCollected - dataGST.taxPaid) + totalCurrentLiabilities;
        data.liabilities.currentLiabilities.totalCurrentLiabilities.total = amountCurrentLiabilities;
        data.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities.total = totalDrawing + totalNonCurrentLiabilities;
        data.liabilities.totalLiabilities.total = amountCurrentLiabilities + totalDrawing + totalNonCurrentLiabilities;
        data.netAssets.totalNetAssets = data.asset.totalAsset.total - data.liabilities.totalLiabilities.total;

        let dataTemplate: any = {};
        dataTemplate.user = user;
        dataTemplate.templateData = data;
        dataTemplate.years = { month: month, year: year };
        let title = 'Balance Sheet';
        let html = ``;
        html = this.createReportBalanceSheetPDF(dataTemplate, true);
        return html;
    }
    convertCsvToGstReport(csvContent: string) {
        const lines = csvContent.split('\n');
        return (lines.map(line => {
            return this.handlerLineCsvGst(line);
        })).filter(item => item);
    }

    handlerLineCsvGst(line: string) {
        const indexType = 0;
        const indexKey = 1;
        const indexValue = 2;

        let name = '';
        let value: any = '';

        const regNumber = /^-?\d+\.?\d*$/;
        let type: any = null;
        const data = line.split(',');
        if (data.length > 3 || data.length < 2)
            return null;
        for (let index = 0; index < data.length; index++) {
            switch (index) {
                case indexType:
                    type = this.parseTypeFormat(data[index]);
                    break;
                case indexKey:
                    name = data[index];
                    break;
                case indexValue:
                    if (regNumber.test(data[index]))
                        value = parseFloat(data[index]);
                default:
                    break;
            }
        }
        return {
            name,
            type,
            value
        };
    }

    parseTypeFormat(contentType) {
        const regexType = /^(?:[1-9]\d*|\d)\|(?:[1-9]\d*|\d)\|(?:[1-9]\d*|\d)\|(?:[1-9]\d*|\d)\|(?:[1-9]\d*|\d)$/;
        if (!regexType.test(contentType))
            throw new Error('csv format not correct!');
        const types = contentType.split('|');

        if (types.length !== 5)
            throw new Error('csv format not correct!');
        return {
            spacing: types[0],
            bold: types[1],
            underlined: types[2],
            paddingTop: types[3],
            fontSize: types[4]
        };
    }

    // async createReportGSTDetail(transactions:any[]) {
    //     const TYPE_GST_REPORT = 4;
    //     transactions = transactions.filter(transaction => transaction.typeCrunch);
    // }

    async createReportTrialBalance(userId: string, managerId: string, transactions: Transaction[], beginMonth: number, beginYear: number, endMonth: number, endYear: number) {
        transactions = transactions.filter(transaction => transaction.typeCrunch);
        let transactionsIncome = transactions.filter(transaction => transaction.typeCrunch === CrunchType.Income);

        let transactionsDrawing = transactions.filter(transaction => transaction.typeCrunch === CrunchType.Drawings);
     
        let transactionsExpenses = await transactions.filter(transaction => transaction.typeCrunch === CrunchType.Expenses);       
        
        let income = await this.caculatorTotalIncomeTrialBalance(userId, transactionsIncome, beginMonth, beginYear, endMonth, endYear);
        let drawing = await this.caculatorTotalDrawingTrialBalance(userId, transactionsDrawing, beginMonth, beginYear, endMonth, endYear);
        let expenses = await this.caculatorTotalExpenseTrialBalance(userId, transactionsExpenses, beginMonth, beginYear, endMonth, endYear);
        expenses.push(income);
        expenses.push(drawing);

        let statement = await BusinessLoader.statementBusiness.getStatementOfClientforBalanceSheetReport(userId, managerId, beginYear, beginMonth);
        if (!statement.length)
            throw new ErrorCommon(102, 'Statement')
        for (let i = 0; i < statement.length; i++) {
            let item = statement[i];
            let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(userId, item.accountId);
            if (!connectBank)
                continue;
            else {
                if (connectBank.type === BankType.Bank) {
                    let totalcloseBalanceBank = Number(item.closeBalance);
                    expenses.push({
                        coa: {
                            "name": connectBank.accountName,
                            "_id": null,
                            "coaCode": "1-1200"
                        },
                        total: {
                            "isCredit": false,
                            "amount": totalcloseBalanceBank > 0 ? totalcloseBalanceBank : (totalcloseBalanceBank * -1)
                        },
                        "totalYTD": {
                            "isCredit": false,
                            "amount": totalcloseBalanceBank > 0 ? totalcloseBalanceBank : (totalcloseBalanceBank * -1)
                        }
                    });
                }
                else if (connectBank.type === BankType.CreditCard) {
                    let totalBankCreditCard = Number(item.closeBalance);
                    expenses.push({
                        coa: {
                            
                            "name": connectBank.accountName,
                            "_id": null,
                            "coaCode": "2-1100"
                        },
                        total: {
                            "isCredit": true,
                            "amount": totalBankCreditCard > 0 ? totalBankCreditCard : (totalBankCreditCard * -1)
                        },
                        "totalYTD": {
                            "isCredit": true,
                            "amount": totalBankCreditCard > 0 ? totalBankCreditCard : (totalBankCreditCard * -1)
                        }
                    });
                }
            }
        }

        let dataGST = await this.createReportGSTForTrialBalance(transactions, userId, beginMonth, beginYear);
        let dataGSTYTD = await this.createReportGSTForBalanceSheet(transactions, userId, beginYear);

        if(!dataGST)
            throw new ErrorCommon(102, 'dataGST')
        else {
            expenses.push({
                coa: {
                    "name": "GST Collected",
                    "_id": null,
                    "coaCode": "2-1210"
                },
                total: {
                    "isCredit": true,
                    "amount": dataGST.taxCollected
                },
                "totalYTD": {
                    "isCredit": true,
                    "amount": dataGSTYTD.taxCollected
                }
            },{
                coa: {
                    "name": "GST Paid",
                    "_id": null,
                    "coaCode": '2-1230'
                },
                total: {
                    "isCredit": false,
                    "amount": dataGST.taxPaid
                },
                "totalYTD": {
                    "isCredit": false,
                    "amount": dataGSTYTD.taxPaid
                }
            });
        }
        return expenses;
        // const profitLossTemplate = new ProfitLossTemplate().getTemplate();
        // let balanceSheetCodes = this.filterCode(balanceSheetTemplate);
        // let profitLossCodes = this.filterCode(profitLossTemplate);
        // let codes = balanceSheetCodes.concat(profitLossCodes);
        // let groupSettings = await BusinessLoader.settingReportBusiness.getSettingByCodes(codes);
        // let groupReports = await BusinessLoader.groupReportBusiness.getByGroupIds(groupSettings.map(item => item.groupId));
        // let totalCoas:any[] = [];
        // groupSettings.forEach(setting => {
        //     const groupReport = groupReports.find(item => item._id.toString() === setting.groupId.toString());
        //     if (groupReport && groupReport.coas)
        //         totalCoas = totalCoas.concat(groupReport.coas.map(coa => ({coa: coa, isCreditAsPositive: setting.isCreditAsPositive, total: 0, totalYTD: 0})));
        // });
        // totalCoas.push({coa: {_id: '69696969969', name: 'Sales Income'}, isCreditAsPositive: true, total: 0, totalYTD: 0});
        // const gstCoas = await BusinessLoader.groupReportBusiness.getGroupBySettingCode(ReportSettingCode.GST);
        // let year = this.timeFilter(beginMonth, beginYear, endMonth, endYear);
        // const usageBudgets = transactions.length ? await BusinessLoader.usageBudgetBusiness.getByBeginYear(transactions[0].userId, year) : [];
        // for (const coaItem of totalCoas) {
        //     const usageBudget = usageBudgets.find(item => (item.coaId._id.toString() === coaItem.coa._id.toString()));
        //     if (usageBudget)
        //         coaItem.coa.name = coaItem.coa.name + ` (BU ${usageBudget.percentUsage}%)`;
        // }
        // return this.caculatorCoaTotal(transactions, {
        //     startMonth: beginMonth,
        //     startYear: beginYear,
        //     endMonth,
        //     endYear
        // }, totalCoas, gstCoas, usageBudgets);
    }
    private async caculatorTotalIncomeTrialBalance(userId: string, transactionsIncome: Transaction[], beginMonth: number, beginYear: number, endMonth: number, endYear: number) {
        let income: any = { coa: { _id: '69696969969', name: 'Sales Income', coaCode: '4-1000' }, total: { isCredit: true, amount: 0 }, totalYTD: { isCredit: true, amount: 0 } };
        transactionsIncome.forEach(transaction => {
            const isMonthTransaction = this.isTransactionMonthly(
                transaction,
                beginMonth,
                beginYear,
                endMonth,
                endYear);

            let amount = Number(parseFloat((transaction.amount.amount / 1.1).toFixed(6)));
            if (transaction.baseType === 'CREDIT')
                income.totalYTD.amount = income.totalYTD.amount + amount;
            if (transaction.baseType === 'DEBIT')
                income.totalYTD.amount = income.totalYTD.amount - amount;
            if (isMonthTransaction) {
                if (transaction.baseType === 'CREDIT')
                    income.total.amount = income.total.amount + amount;
                if (transaction.baseType === 'DEBIT')
                    income.total.amount = income.total.amount - amount;
            }
        });
        let userChartAccountOpeningBalance = await BusinessLoader.userBusiness.getUserChartAccountOpeningBalance(userId);
        if (userChartAccountOpeningBalance && userChartAccountOpeningBalance.dataCoaOpeningBalance.length && userChartAccountOpeningBalance.month && userChartAccountOpeningBalance.year) {
            let queryBeginMonth = beginMonth;
            let queryBeginYear = beginYear;
            let queryEndMonth = endMonth;
            let queryEndYear = endYear;
            queryBeginMonth = 7;
            if (endMonth < 7) {
                queryBeginYear = endYear - 1;
                queryEndYear = endYear;
            }
            let isChartAccountOpeningBalanceMonth = this.ischartAccountOpeningBalanceMonthly(userChartAccountOpeningBalance, beginMonth, beginYear, endMonth, endYear);
            let isChartAccountOpeningBalanceYear = this.ischartAccountOpeningBalanceMonthly(userChartAccountOpeningBalance, queryBeginMonth, queryBeginYear, queryEndMonth, queryEndYear);
            let found = userChartAccountOpeningBalance.dataCoaOpeningBalance.find((item: any) => item.specialCoaName === 'Sales Income');
            if (isChartAccountOpeningBalanceMonth && found) {
                income.total.amount = income.total.amount + found.openingBalance;
            }
            if (isChartAccountOpeningBalanceYear && found) {
                income.totalYTD.amount = income.totalYTD.amount + found.openingBalance;
            }
        }
        if (income.total.amount < 0) {
            income.total.isCredit = false;
            income.total.amount *= -1;
        }
        else
            income.total.isCredit = true;

        if (income.totalYTD.amount < 0) {
            income.totalYTD.isCredit = false;
            income.totalYTD.amount *= -1;
        }
        else
            income.totalYTD.isCredit = true;
        return income;
    }

    private async caculatorTotalDrawingTrialBalance(userId: string, transactionsDrawing: Transaction[], beginMonth: number, beginYear: number, endMonth: number, endYear: number) {
        let drawing: any = { coa: { name: 'Drawings', coaCode: '3-4000' }, total: { isCredit: true, amount: 0 }, totalYTD: { isCredit: true, amount: 0 } };
        transactionsDrawing.forEach(transaction => {
            const isMonthTransaction = this.isTransactionMonthly(
                transaction,
                beginMonth,
                beginYear,
                endMonth,
                endYear);

            let amount = transaction.amount.amount;
            if (transaction.baseType === 'CREDIT')
                drawing.totalYTD.amount = drawing.totalYTD.amount + amount;
            else if (transaction.baseType === 'DEBIT')
                drawing.totalYTD.amount = drawing.totalYTD.amount - amount;
            else
                drawing.totalYTD.amount = drawing.totalYTD.amount + amount;
            if (isMonthTransaction) {
                if (transaction.baseType === 'CREDIT')
                    drawing.total.amount = drawing.total.amount + amount;
                else if (transaction.baseType === 'DEBIT')
                    drawing.total.amount = drawing.total.amount - amount;
                else
                    drawing.total.amount = drawing.total.amount + amount;
            }
        });
        let userChartAccountOpeningBalance = await BusinessLoader.userBusiness.getUserChartAccountOpeningBalance(userId);
        if (userChartAccountOpeningBalance && userChartAccountOpeningBalance.dataCoaOpeningBalance.length && userChartAccountOpeningBalance.month && userChartAccountOpeningBalance.year) {
            let queryBeginMonth = beginMonth;
            let queryBeginYear = beginYear;
            let queryEndMonth = endMonth;
            let queryEndYear = endYear;
            queryBeginMonth = 7;
            if (endMonth < 7) {
                queryBeginYear = endYear - 1;
                queryEndYear = endYear;
            }
            let isChartAccountOpeningBalanceMonth = this.ischartAccountOpeningBalanceMonthly(userChartAccountOpeningBalance, beginMonth, beginYear, endMonth, endYear);
            let isChartAccountOpeningBalanceYear = this.ischartAccountOpeningBalanceMonthly(userChartAccountOpeningBalance, queryBeginMonth, queryBeginYear, queryEndMonth, queryEndYear);
            let found = userChartAccountOpeningBalance.dataCoaOpeningBalance.find((item: any) => item.specialCoaName === 'Drawing');
            if (isChartAccountOpeningBalanceMonth && found) {
                drawing.total.amount = drawing.total.amount + found.openingBalance;
            }
            if (isChartAccountOpeningBalanceYear && found) {
                drawing.totalYTD.amount = drawing.totalYTD.amount + found.openingBalance;
            }
        }
        if (drawing.total.amount < 0) {
            drawing.total.isCredit = false;
            drawing.total.amount *= -1;
        }
        else
            drawing.total.isCredit = true;
        if (drawing.totalYTD.amount < 0) {
            drawing.totalYTD.isCredit = false;
            drawing.totalYTD.amount *= -1
        }
        else
            drawing.totalYTD.isCredit = true;
        return drawing;
    }

    private async caculatorTotalExpenseTrialBalance(userId: string, transactions: Transaction[], beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<any[]> {
        let dataFull;
        let datas:any = [];
        let datasTmp = groupArray(transactions, 'coaId.code');
        for(let item of Object.entries(datasTmp)){
            datas = [...datas, item]
        }
        let year = this.timeFilter(beginMonth, beginYear, endMonth, endYear);
        const usageBudgets = transactions.length ? await BusinessLoader.usageBudgetBusiness.getByBeginYear(transactions[0].userId, year) : [];
        let userChartAccountOpeningBalance = await BusinessLoader.userBusiness.getUserChartAccountOpeningBalance(userId);

        if (userChartAccountOpeningBalance && userChartAccountOpeningBalance.dataCoaOpeningBalance.length && userChartAccountOpeningBalance.month && userChartAccountOpeningBalance.year) {
            let dataCoaOpeningBalance = userChartAccountOpeningBalance.dataCoaOpeningBalance;
            let indexDrawing = dataCoaOpeningBalance.findIndex((item: any) => item.specialCoaName === 'Drawing');
            if (indexDrawing !== -1)
                dataCoaOpeningBalance.splice(indexDrawing, 1);
            let indexSalesIncome = dataCoaOpeningBalance.findIndex((item: any) => item.specialCoaName === 'Sales Income');
            if (indexSalesIncome !== -1)
                dataCoaOpeningBalance.splice(indexSalesIncome, 1);

            // eslint-disable-next-line guard-for-in
            //////////////////////// check tieppppppppppppppppppppppppppppppppppppppppppppppp
            if (datas.length > 0) {
                for (let item in datas) {
                    let indexData = Number(item)
                    let result = datas[indexData][0].split('-');
                    let dataArrayTransactions: any[] = datas[indexData][1];
                    let index = dataCoaOpeningBalance.findIndex(element => {
                        return element.coaId.code === datas[indexData][0];
                    });
                    if (index !== -1) {
                        if ((Number(result[0]) === 1 || Number(result[0]) === 5 || Number(result[0]) === 6 || Number(result[0]) === 9)) {
                            dataArrayTransactions.push({
                                amount: {
                                    amount: dataCoaOpeningBalance[index].openingBalance
                                },
                                baseType: 'DEBIT',
                                coaId: {
                                    _id: dataCoaOpeningBalance[index].coaId._id
                                },
                                isCoaOpeningBalance: true,
                            });
                        }
                        if (Number(result[0]) === 2 || Number(result[0]) === 3 || Number(result[0]) === 4 || Number(result[0]) === 8) {
                            dataArrayTransactions.push({
                                amount: {
                                    amount: dataCoaOpeningBalance[index].openingBalance
                                },
                                baseType: 'CREDIT',
                                coaId: {
                                    _id: dataCoaOpeningBalance[index].coaId._id
                                },
                                isCoaOpeningBalance: true,
                            });
                        }
                        dataCoaOpeningBalance.splice(index, 1);
                    }
                }
            }
            
            if (dataCoaOpeningBalance.length) {
                console.log("length array",dataCoaOpeningBalance.length);
                let objectCoaOpeningBalance: any = {};
                for (let i = 0; i < dataCoaOpeningBalance.length; i++) {
                    let result = dataCoaOpeningBalance[i].coaId.code.split('-');
                    console.log("results.....", result);
                    let code = dataCoaOpeningBalance[i].coaId.code;
                    console.log("code.....", code);

                    if ((Number(result[0]) === 1 || Number(result[0]) === 5 || Number(result[0]) === 6 || Number(result[0]) === 9)) {
                        objectCoaOpeningBalance = [
                            code,
                            [{
                                amount: {
                                    amount: dataCoaOpeningBalance[i].openingBalance
                                },
                                baseType: 'DEBIT',
                                coaId: {
                                    _id: dataCoaOpeningBalance[i].coaId._id
                                },
                                isCoaOpeningBalance: true,
                            }]
                        ];
                    }
                    if (Number(result[0]) === 2 || Number(result[0]) === 3 || Number(result[0]) === 4 || Number(result[0]) === 8) {
                        objectCoaOpeningBalance = [
                            code,
                            [{
                                amount: {
                                    amount: dataCoaOpeningBalance[i].openingBalance
                                },
                                baseType: 'CREDIT',
                                coaId: {
                                    _id: dataCoaOpeningBalance[i].coaId._id
                                },
                                isCoaOpeningBalance: true,
                            }]
                        ];
                    }
                }
                dataFull = [ ...datas, objectCoaOpeningBalance ];
            }
            else
                dataFull = datas;
        }
        else {
            dataFull = datas;
        }
        let results: any[] = [];
        // eslint-disable-next-line guard-for-in
        for (let item of dataFull) {
            let dataArrayTransactions: any[] = item[1];
            let result = item[0].split('-');
            let coaCode = item[0]
            let chartAccount = await BusinessLoader.chartAccountBusiness.getCOAByCode(coaCode);
            if (!chartAccount || !chartAccount._id)
                continue;
            else {
                let data: any = { coa: { name: chartAccount.name, _id: chartAccount._id, coaCode: coaCode }, total: { isCredit: true, amount: 0 }, totalYTD: { isCredit: true, amount: 0 } };
                let chartAccountId = chartAccount._id.toString();
                const usageBudget = usageBudgets.find(item => (item.coaId._id.toString() === chartAccountId));
                if (usageBudget)
                    data.coa.name = chartAccount.name + ` (BU ${usageBudget.percentUsage}%)`;
                for (let i = 0; i < dataArrayTransactions.length; i++) {
                    let item = dataArrayTransactions[i];
                    let amount = item.amount.amount;
                    if (Number(result[0]) === 1 || Number(result[0]) === 5 || Number(result[0]) === 6 || Number(result[0]) === 9)
                        amount = item.baseType === 'DEBIT' ? amount : - amount;
                    else if (Number(result[0]) === 2 || Number(result[0]) === 3 || Number(result[0]) === 4 || Number(result[0]) === 8)
                        amount = item.baseType === 'DEBIT' ? - amount : amount;
                    const usageBudget = usageBudgets.find(item => (item.coaId._id.toString() === chartAccountId));
                    if (usageBudget) {
                        const businessUsage = Number(parseFloat((amount * usageBudget.percentUsage / 100).toFixed(6)));
                        amount = businessUsage;
                    }
                    if (chartAccount.gstType === GstType.GST || chartAccount.gstType === GstType.CAP)
                        amount = Number(parseFloat((amount / 1.1).toFixed(5)));
                    if (item.isCoaOpeningBalance) {
                        let queryBeginMonth = beginMonth;
                        let queryBeginYear = beginYear;
                        let queryEndMonth = endMonth;
                        let queryEndYear = endYear;
                        queryBeginMonth = 7;
                        if (endMonth < 7) {
                            queryBeginYear = endYear - 1;
                            queryEndYear = endYear;
                        }
                        let isChartAccountOpeningBalanceMonth = this.ischartAccountOpeningBalanceMonthly(userChartAccountOpeningBalance, beginMonth, beginYear, endMonth, endYear);
                        let isChartAccountOpeningBalanceYear = this.ischartAccountOpeningBalanceMonthly(userChartAccountOpeningBalance, queryBeginMonth, queryBeginYear, queryEndMonth, queryEndYear);
                        if (isChartAccountOpeningBalanceMonth)
                            data.totalYTD.amount += amount;
                        if (isChartAccountOpeningBalanceYear)
                            data.total.amount += amount;
                    }
                    else {
                        const isMonthTransaction = this.isTransactionMonthly(
                            item,
                            beginMonth,
                            beginYear,
                            endMonth,
                            endYear);
                        data.totalYTD.amount += amount;
                        if (isMonthTransaction)
                            data.total.amount += amount;
                    }
                }
                if (Number(result[0]) === 1 || Number(result[0]) === 5 || Number(result[0]) === 6 || Number(result[0]) === 9) {
                    if (data.total.amount < 0) {
                        data.total.isCredit = true;
                        data.total.amount *= -1;
                    }
                    else
                        data.total.isCredit = false;
                    if (data.totalYTD.amount < 0) {
                        data.totalYTD.isCredit = true;
                        data.totalYTD.amount *= -1
                    }
                    else
                        data.totalYTD.isCredit = false;
                }
                else if (Number(result[0]) === 2 || Number(result[0]) === 3 || Number(result[0]) === 4 || Number(result[0]) === 8) {
                    if (data.total.amount < 0) {
                        data.total.isCredit = false;
                        data.total.amount *= -1
                    }
                    else
                        data.total.isCredit = true;
                    if (data.totalYTD.amount < 0) {
                        data.totalYTD.isCredit = false;
                        data.totalYTD.amount *= -1
                    }
                    else
                        data.totalYTD.isCredit = true;
                }
                results.push(data);
            }
        }

        return results;
    }

    // private caculatorCoaTotal(
    //     transactions:Transaction[],
    //     timeFilter : {startMonth:number, startYear:number, endMonth:number, endYear:number},
    //     totalCoas:{coa:any, isCreditAsPositive:boolean, total:number, totalYTD: number}[],
    //     gstCoas:any[],
    //     usageBudgets:any[]
    // ) {
    //     const saleIncomeID = '69696969969';
    //     const indexSaleIncome = totalCoas.findIndex(item => item.coa._id.toString() === saleIncomeID);
    //     transactions.forEach(transaction => {
    //         const isMonthTransaction = this.isTransactionMonthly(
    //             transaction,
    //             timeFilter.startMonth,
    //             timeFilter.startYear,
    //             timeFilter.endMonth,
    //             timeFilter.endYear);

    //         if (transaction.coaId && transaction.coaId._id) {
    //             const index = totalCoas.findIndex(item => item.coa._id.toString() === transaction.coaId._id.toString());
    //             const coaInGst = gstCoas.find(coa => coa._id.toString() === transaction.coaId._id.toString());
    //             const usageBudget = usageBudgets.find(item => (item.coaId._id.toString() === transaction.coaId._id.toString()));
    //             if (index >= 0) {
    //                 let amount = (totalCoas[index].isCreditAsPositive && transaction.baseType === 'CREDIT')
    //                 || (!totalCoas[index].isCreditAsPositive && transaction.baseType === 'DEBIT')
    //                     ? transaction.amount.amount
    //                     : -transaction.amount.amount;

    //                 if (usageBudget) {
    //                     const businessUsage = parseFloat((amount * usageBudget.percentUsage / 100).toFixed(2));
    //                     amount = businessUsage;
    //                 }

    //                 if (coaInGst)
    //                     amount = parseFloat((amount / 1.1).toFixed(2));

    //                 totalCoas[index].totalYTD += amount;
    //                 if (isMonthTransaction)
    //                     totalCoas[index].total += amount;
    //             }
    //         }
    //         if (transaction.typeCrunch === CrunchType.Income && indexSaleIncome >= 0) {
    //             let amount = (totalCoas[indexSaleIncome].isCreditAsPositive && transaction.baseType === 'CREDIT')
    //                 || (!totalCoas[indexSaleIncome].isCreditAsPositive && transaction.baseType === 'DEBIT')
    //                 ? transaction.amount.amount
    //                 : -transaction.amount.amount;
    //             amount = parseFloat((amount / 1.1).toFixed(2));
    //             totalCoas[indexSaleIncome].totalYTD += amount;
    //             if (isMonthTransaction)
    //                 totalCoas[indexSaleIncome].total += amount;
    //         }
    //     });

    //     return totalCoas.filter(item => item.total !== 0 || item.totalYTD !== 0);
    // }

    caculatorTransaction(transactions: any[], list: any[]) {
        transactions = transactions.filter(transaction => transaction.coaId && transaction.coaId.code);
        list = list.map(item => ({ code: item, name: '', total: 0 }));
        transactions.forEach(transaction => {
            let index = list.findIndex(item => item.code === transaction.coaId.code);
            if (index !== -1) {
                list[index].name = transaction.coaId.name;
                list[index].total += transaction.baseType === 'DEBIT' ? - parseFloat(transaction.amount.amount) : parseFloat(transaction.amount.amount);
            }
        });
        return list.filter(item => item.name && item.total);
    }

    async createCruncherPdfReport(originId: string, clientId: string, accountId: string, productCode: number, type: number, month: number, year: number): Promise<string> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        if (!accountId)
            throw new ErrorCommon(101, 'accountId');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return '';

        let targetUser: any = await AuthorizationHelper.userService.get(clientId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return '';
        let crunchs = await this.getCrunchStatus(clientId, accountId, type, month, year);
        crunchs.forEach(crunch => {
            if (!crunch.completedAt)
                throw new ErrorCommon(106, 'Crunch Export');
        });

        let statement = await BusinessLoader.statementBusiness.getStatementOfClient(clientId, originId, accountId, type, year, month);
        if (!statement)
            throw new ErrorCommon(102, 'Statement');

        let date = moment(statement.month, 'MM').format('MMMM').toString() + ' ' + statement.year;
        let transactions = await BusinessLoader.transactionBusiness.getAllTransaction(clientId, accountId, type, year, month);
        let defaultTransaction = transactions.filter(transaction => !transaction.typeCrunch);

        if (defaultTransaction.length > 0)
            throw new ErrorCommon(106, 'Crunch');

        let user: any = await BusinessLoader.userBusiness.get(clientId);
        if (!user)
            throw new ErrorCommon(102, 'Client');

        let product = await BusinessLoader.productBusiness.get(user.permission.product);
        if (!product || !product.type)
            throw new ErrorCommon(102, 'Product');

        let connectedBank = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(clientId, accountId);
        if (!connectedBank)
            throw new ErrorCommon(102, 'connectedBank');

        // let connectedBank = connectedBanks.find(item => item.type === type);
        if (!connectedBank.accountName || !connectedBank.providerAccountId || !connectedBank.type || connectedBank.type !== type)
            throw new ErrorCommon(107, 'Bank');
        // let yodleeAccount;
        // if (!connectedBank.accounts || connectedBank.accounts.length === 0) {
        //     console.log('account not in connect bank , get account from yodlee');
        //     let {account} = await BusinessLoader.yodleeBusiness.getBankAccounts(clientId, type);
        //     if (account.length === 0)
        //         throw new ErrorYodlee(1);
        //     yodleeAccount = account;
        // }
        // else
        //     yodleeAccount = connectedBank.accounts[0];

        let fullName = user.businessInfo ? (user.businessInfo.entityName ? user.businessInfo.entityName : user.fullName) : user.fullName;
        let expenses = transactions.filter(transaction => transaction.typeCrunch === CrunchType.Expenses && transaction.coaId && transaction.coaId._id);
        // expenses.forEach(element => {
        //     if (!element.coaId || !element.coaId._id) {
        //         throw new ErrorYodlee(2);
        //     }
        // });
        let other = transactions.filter(transaction => transaction.typeCrunch === CrunchType.Other);
        let income = transactions.filter(transaction => transaction.typeCrunch === CrunchType.Income);
        let drawings = transactions.filter(transaction => transaction.typeCrunch === CrunchType.Drawings);
        let crunch = {
            expenses: expenses,
            other: other,
            income: income,
            drawings: drawings,
            date: date,
            ...statement
        };
        let linkLogo = product.logo ? Project.GOOGLE_STORAGE.BASE_URL + product.logo : '';
        let templateCrunch = new TemplateCrunch(crunch, connectedBank, fullName, linkLogo); // Template for Invoice pdf By HTML
        let localFile = 'tmp/' + 'crunch-' + crunch._id + '.pdf'; // Address and name for new pdf invoice fle
        let options = {
            format: 'A4', border: '0cm',
            footer: {
                height: '2cm',
                contents: {
                    default: '' +
                        '<div style="font-size: 6px;color:#BFBFBF;position: relative;bottom:0px">' +
                        '<div style="position: relative;bottom: -5px">CRUNCH REPORT</div>' +
                        '<div style="text-align: right;">PAGE {{page}}/{{pages}} </div>' +
                        '</div>',
                }
            },
            header: {
                height: '1cm',
            },
        };

        await PdfHelper.createPdf(templateCrunch.templateCrunch, options, localFile);
        let typeCrunch = type === BankType.Bank ? 'bank' : 'credit card';
        let monthCrunch = moment(String(statement.month)).format('MMMM');
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(user._id, productCode, year.toString(), typeCrunch);
        let fileName = `${targetUser.fullName}_${monthCrunch}${year}_${connectedBank.accountNumber}_cruncherReport.pdf`;

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, fileName, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;
    }

    async createCruncherPdfReportYear(originId: string, clientId: string, accountId: string, productCode: number, type: number, year: number): Promise<string> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        if (!accountId)
            throw new ErrorCommon(101, 'accountId');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return '';

        let targetUser: any = await AuthorizationHelper.userService.get(clientId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return '';
        let user: any = await BusinessLoader.userBusiness.get(clientId);
        if (!user)
            throw new ErrorCommon(102, 'Client');

        let product = await BusinessLoader.productBusiness.get(user.permission.product);
        if (!product || !product.type)
            throw new ErrorCommon(102, 'Product');
        let beginMonth = product.config.financialYear.beginMonth;
        let endMonth = product.config.financialYear.endMonth;
        let crunchs = await this.getCrunchFinalYearStatus(clientId, accountId, type, beginMonth, endMonth, year);

        let connectedBank = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(clientId, accountId);
        if (!connectedBank)
            throw new ErrorCommon(102, 'connectedBank');

        if (!connectedBank.accountName || !connectedBank.providerAccountId || !connectedBank.type || connectedBank.type !== type)
            throw new ErrorCommon(107, 'Bank');
        // let connectedBanks = user.connectedBanks;
        // let connectedBank = connectedBanks.find(item => item.type === type);
        // if (!connectedBank || !connectedBank.connectedId || !connectedBank.connectedName || !connectedBank.providerId)
        //     throw new ErrorCommon(107, 'Bank');
        // let yodleeAccount;
        // if (!connectedBank.accounts || connectedBank.accounts.length === 0) {
        //     console.log('account not in connect bank , get account from yodlee');
        //     let {account} = await BusinessLoader.yodleeBusiness.getBankAccounts(clientId, type);
        //     if (account.length === 0)
        //         throw new ErrorYodlee(1);
        //     yodleeAccount = account;
        // }
        // else
        //     yodleeAccount = connectedBank.accounts[0];

        crunchs = crunchs.filter(crunch => crunch.completedAt);
        crunchs = crunchs.sort((a, b) => {
            if (a.year !== b.year)
                return a.year - b.year;
            else
                return a.month - b.month;
        });
        let firstCrunch = crunchs[0];
        let statement = await BusinessLoader.statementBusiness.getStatementOfClient(clientId, originId, accountId, type, firstCrunch.year, firstCrunch.month);
        if (!statement)
            throw new ErrorCommon(102, 'Statement');
        const timeQuery: any = [];
        crunchs.forEach(crunch => {
            const yearIndex = timeQuery.findIndex(item => item.year === Number(crunch.year));
            if (yearIndex === -1)
                timeQuery.push({ year: crunch.year, months: [crunch.month] });
            else {
                const months: any[] = timeQuery[yearIndex].months ? timeQuery[yearIndex].months : [];
                const indexMonth = months.findIndex(month => month === crunch.month);
                if (indexMonth === -1)
                    timeQuery[yearIndex].months.push(crunch.month);
            }
        });
        console.log(timeQuery);
        const transactions = await BusinessLoader.transactionBusiness.getTransactionByMonths(clientId, accountId, type, timeQuery);
        let fullName = user.businessInfo ? (user.businessInfo.entityName ? user.businessInfo.entityName : user.fullName) : user.fullName;
        let expenses = transactions.filter(transaction => transaction.typeCrunch === CrunchType.Expenses && transaction.coaId && transaction.coaId._id);
        // expenses.forEach(element => {
        //     if (!element.coaId || !element.coaId._id) {
        //         throw new ErrorYodlee(2);
        //     }
        // });
        let other = transactions.filter(transaction => transaction.typeCrunch === CrunchType.Other);
        let income = transactions.filter(transaction => transaction.typeCrunch === CrunchType.Income);
        let drawings = transactions.filter(transaction => transaction.typeCrunch === CrunchType.Drawings);
        let crunch = {
            expenses: expenses,
            other: other,
            income: income,
            drawings: drawings,
            type: type,
            Title: 'Year To Date',
            openBalance: statement.openBalance
        };
        let linkLogo = product.logo ? Project.GOOGLE_STORAGE.BASE_URL + product.logo : '';
        let templateCrunch = new TemplateYearCrunch(crunch, connectedBank, fullName, linkLogo); // Template for Invoice pdf By HTML
        let localFile = 'tmp/' + 'crunch-year' + year + '.pdf'; // Address and name for new pdf invoice fle
        let options = {
            format: 'A4', border: '0cm',
            footer: {
                height: '2cm',
                contents: {
                    default: '' +
                        '<div style="font-size: 6px;color:#BFBFBF;position: relative;bottom:0px">' +
                        '<div style="position: relative;bottom: -5px">CRUNCH REPORT</div>' +
                        '<div style="text-align: right;">PAGE {{page}}/{{pages}} </div>' +
                        '</div>',
                }
            },
            header: {
                height: '1cm',
            },
        };

        await PdfHelper.createPdf(templateCrunch.templateCrunch, options, localFile);
        let typeCrunch = type === BankType.Bank ? 'bank' : 'credit card';
        // let monthCrunch = moment(Number(statement.month)).format('MMMM');

        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(user._id, productCode, year.toString(), typeCrunch);
        let fileName = `${targetUser.fullName}_${year}_${connectedBank.accountNumber}_cruncherReportFinalYear.pdf`;

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, fileName, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;
    }

    async createCruncherCsvReport(originId: string, clientId: string, accountId: string, productCode: number, type: number, month: number, year: number): Promise<string> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        if (!accountId)
            throw new ErrorCommon(101, 'accountId');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return '';

        let targetUser: any = await AuthorizationHelper.userService.get(clientId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return '';
        let crunchs = await this.getCrunchStatus(clientId, accountId, type, month, year);

        crunchs.forEach(crunch => {
            if (!crunch.completedAt)
                throw new ErrorCommon(106, 'Crunch Export');
        });

        let statement = await BusinessLoader.statementBusiness.getStatementOfClient(clientId, originId, accountId, type, year, month);
        if (!statement)
            throw new ErrorCommon(102, 'Statement');

        let date = moment(statement.month, 'MM').format('MMMM').toString() + ' ' + statement.year;
        let transactions = await BusinessLoader.transactionBusiness.getAllTransaction(clientId, accountId, type, year, month);

        let defaultTransaction = transactions.filter(transaction => !transaction.typeCrunch);
        if (defaultTransaction.length > 0)
            throw new ErrorCommon(106, 'Crunch');

        let user: any = await BusinessLoader.userBusiness.get(clientId);
        if (!user)
            throw new ErrorCommon(102, 'Client');

        let connectedBank = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(clientId, accountId);
        if (!connectedBank)
            throw new ErrorCommon(102, 'connectedBank');

        if (!connectedBank.accountName || !connectedBank.providerAccountId || !connectedBank.type || connectedBank.type !== type)
            throw new ErrorCommon(107, 'Bank');
        // let connectedBanks = user.connectedBanks;
        // let connectedBank = connectedBanks.find(item => item.type === type);
        // if (!connectedBank || !connectedBank.connectedId || !connectedBank.connectedName || !connectedBank.providerId)
        //     throw new ErrorCommon(107, 'Bank');
        // let yodleeAccount; // eslint-disable-line
        // if (!connectedBank.accounts || connectedBank.accounts.length === 0) {
        //     console.log('account not in connect bank , get account from yodlee');
        //     let {account} = await BusinessLoader.yodleeBusiness.getBankAccounts(clientId, type);
        //     if (account.length === 0)
        //         throw new ErrorYodlee(1);
        //     yodleeAccount = account;
        // }
        // else
        //     yodleeAccount = connectedBank.accounts[0];

        let fullName = user.businessInfo ? (user.businessInfo.entityName ? user.businessInfo.entityName : user.fullName) : user.fullName;
        let expenses = transactions.filter(transaction => transaction.typeCrunch === CrunchType.Expenses && transaction.coaId && transaction.coaId._id);
        // expenses.forEach(element => {
        //     if (!element.coaId || !element.coaId._id) {
        //         throw new ErrorYodlee(2);
        //     }
        // });
        let other = transactions.filter(transaction => transaction.typeCrunch === CrunchType.Other);
        let income = transactions.filter(transaction => transaction.typeCrunch === CrunchType.Income);
        let drawings = transactions.filter(transaction => transaction.typeCrunch === CrunchType.Drawings);
        let crunch = {
            userName: fullName,
            expenses: expenses,
            other: other,
            income: income,
            drawings: drawings,
            date: date,
            ...statement
        };
        let csvData = CsvHelper.createCsvCrunch(crunch);

        let monthCrunch = moment(statement.month, 'MM').format('MM');
        let typeCrunch = type === BankType.Bank ? 'bank' : 'credit card';
        let product = await BusinessLoader.productBusiness.get(user.permission.product);
        let localFile = `tmp/cruncher_${monthCrunch}.csv`;

        if (!product || !product.type)
            throw new ErrorCommon(102, 'Product');
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(user._id, productCode, year.toString(), typeCrunch);
        let monthCrunchCSV = moment(String(statement.month)).format('MMMM');
        let fileName = `${targetUser.fullName}_${monthCrunchCSV}${year}_${connectedBank.accountNumber}_cruncherReport.csv`;

        fs.writeFileSync(localFile, csvData);

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, fileName, Project.GOOGLE_STORAGE.BUCKET_NAME);
        // return Project.GOOGLE_STORAGE.BASE_URL + `/${Project.GOOGLE_STORAGE.BUCKET_NAME}` + crunchPathS3;
        return urlDownload;
    }

    async createCruncherYearCsvReport(originId: string, clientId: string, accountId: string, productCode: number, type: number, year: number): Promise<string> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        if (!accountId)
            throw new ErrorCommon(101, 'accountId');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return '';

        let targetUser: any = await AuthorizationHelper.userService.get(clientId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return '';
        let user: any = await BusinessLoader.userBusiness.get(clientId);
        if (!user)
            throw new ErrorCommon(102, 'Client');

        let product = await BusinessLoader.productBusiness.get(user.permission.product);
        if (!product || !product.type)
            throw new ErrorCommon(102, 'Product');
        let beginMonth = product.config.financialYear.beginMonth;
        let endMonth = product.config.financialYear.endMonth;
        let crunchs = await this.getCrunchFinalYearStatus(clientId, accountId, type, beginMonth, endMonth, year);

        let connectedBank = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(clientId, accountId);
        if (!connectedBank)
            throw new ErrorCommon(102, 'connectedBank');

        if (!connectedBank.accountName || !connectedBank.providerAccountId || !connectedBank.type || connectedBank.type !== type)
            throw new ErrorCommon(107, 'Bank');

        // let connectedBanks = user.connectedBanks;
        // let connectedBank = connectedBanks.find(item => item.type === type);
        // if (!connectedBank || !connectedBank.connectedId || !connectedBank.connectedName || !connectedBank.providerId)
        //     throw new ErrorCommon(107, 'Bank');
        // let yodleeAccount;
        // if (!connectedBank.accounts || connectedBank.accounts.length === 0) {
        //     console.log('account not in connect bank , get account from yodlee');
        //     let {account} = await BusinessLoader.yodleeBusiness.getBankAccounts(clientId, type);
        //     if (account.length === 0)
        //         throw new ErrorYodlee(1);
        //     yodleeAccount = account;
        // }
        // else
        //     yodleeAccount = connectedBank.accounts[0];

        crunchs = crunchs.filter(crunch => crunch.completedAt);
        crunchs = crunchs.sort((a, b) => {
            if (a.year !== b.year)
                return a.year - b.year;
            else
                return a.month - b.month;
        });
        let firstCrunch = crunchs[0];
        let statement = await BusinessLoader.statementBusiness.getStatementOfClient(clientId, originId, accountId, type, firstCrunch.year, firstCrunch.month);
        if (!statement)
            throw new ErrorCommon(102, 'Statement');
        const timeQuery: any = [];
        crunchs.forEach(crunch => {
            const yearIndex = timeQuery.findIndex(item => item.year === Number(crunch.year));
            if (yearIndex === -1)
                timeQuery.push({ year: crunch.year, months: [crunch.month] });
            else {
                const months: any[] = timeQuery[yearIndex].months ? timeQuery[yearIndex].months : [];
                const indexMonth = months.findIndex(month => month === crunch.month);
                if (indexMonth === -1)
                    timeQuery[yearIndex].months.push(crunch.month);
            }
        });
        const transactions = await BusinessLoader.transactionBusiness.getTransactionByMonths(clientId, accountId, type, timeQuery);
        let fullName = user.businessInfo ? (user.businessInfo.entityName ? user.businessInfo.entityName : user.fullName) : user.fullName;
        let expenses = transactions.filter(transaction => transaction.typeCrunch === CrunchType.Expenses && transaction.coaId && transaction.coaId._id);
        // expenses.forEach(element => {
        //     if (!element.coaId || !element.coaId._id) {
        //         throw new ErrorYodlee(2);
        //     }
        // });
        let other = transactions.filter(transaction => transaction.typeCrunch === CrunchType.Other);
        let income = transactions.filter(transaction => transaction.typeCrunch === CrunchType.Income);
        let drawings = transactions.filter(transaction => transaction.typeCrunch === CrunchType.Drawings);
        let crunch = {
            expenses: expenses,
            other: other,
            income: income,
            drawings: drawings,
            userName: fullName,
            type: type,
            date: 'Year To Date',
            openBalance: statement.openBalance
        };
        let csvData = CsvHelper.createCsvCrunch(crunch);

        let nameCrunch = 'reportfinalyear';
        let typeCrunch = type === BankType.Bank ? 'bank' : 'credit card';
        let localFile = `tmp/cruncher_${nameCrunch}.csv`;

        if (!product || !product.type)
            throw new ErrorCommon(102, 'Product');
        let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(user._id, productCode, year.toString(), typeCrunch);
        let fileName = `${targetUser.fullName}_${year}_${connectedBank.accountNumber}_cruncherReportFinalYear.csv`;

        fs.writeFileSync(localFile, csvData);

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, fileName, Project.GOOGLE_STORAGE.BUCKET_NAME);
        // return Project.GOOGLE_STORAGE.BASE_URL + `/${Project.GOOGLE_STORAGE.BUCKET_NAME}` + crunchPathS3;
        return urlDownload;
    }

    async exportDataReportPDF(originId: string, productCode: number, managerId: string, clientIds: any[], types: any[], beginYear: number, beginMonth: number, endYear: number, endMonth: number, productSelect: number): Promise<string> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        if ((clientIds && !clientIds.length) && (types && !types.length)) {
            throw new ErrorCommon(101, 'Request');
        }

        let numberColumn = clientIds.length * types.length;
        if (numberColumn > 7) {
            throw new ErrorCommon(101, 'Request');
        }

        let products = await Authenticator.filterProductsPermission([module.REPORT.claim.GET.code], originId, []);

        if (!products || !products.length)
            return '';
        let product;

        if (productSelect)
            product = products.find(item => item.code === productSelect);
        else
            product = products.find(item => item.code === productCode);

        let users: any = await BusinessLoader.userBusiness.getListUser(clientIds);
        // let user: any = await BusinessLoader.userBusiness.get(clientIds[0]);

        if (!users || !Array.isArray(users) || users.length === 0)
            throw new ErrorCommon(102, 'Client');

        let dataReports = await BusinessLoader.crunchBusiness.getDataReport(originId, productCode, managerId, clientIds, beginYear, beginMonth, endYear, endMonth);

        let date = {
            beginYear: beginYear,
            beginMonth: beginMonth,
            endYear: endYear,
            endMonth: endMonth
        };

        let TemplateDateReport = new TemplateDataReport(users, date, dataReports, types, product); // Template for Invoice pdf By HTML

        let localFile = 'tmp/' + 'data-report-' + users[0]._id + '.pdf'; // Address and name for new pdf invoice fle
        let options = {
            format: 'A4', border: '0cm',
            footer: {
                height: '2cm',
                contents: {
                    default: '' +
                        '<div style="font-size: 6px;color:#BFBFBF;position: relative;bottom:0px">' +
                        '<div style="position: relative;bottom: -5px">DATA REPORT</div>' +
                        '<div style="text-align: right;">PAGE {{page}}/{{pages}} </div>' +
                        '</div>',
                }
            },
            header: {
                height: '1cm',
            },
            renderDelay: 1000
        };

        await PdfHelper.createPdf(TemplateDateReport.templateDateReport, options, localFile);

        let crunchPrefix = `${users[0]._id}/${productCode}/${beginMonth}_${beginYear}-${endMonth}_${endYear}`;
        let fileName = `data-report${beginMonth}_${beginYear}-${endMonth}_${endYear}.pdf`;

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, fileName, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;
    }

    async exportDataReportCSV(originId: string, productCode: number, managerId: string, clientIds: any[], types: any[], beginYear: number, beginMonth: number, endYear: number, endMonth: number, productSelect: number): Promise<string> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.REPORT.claim.GET.code], originId, []);
        if (!products || !products.length)
            return '';
        let product; // eslint-disable-line
        if (productSelect)
            product = products.find(item => item.code === productSelect);
        else
            product = products.find(item => item.code === productCode);
        let user: any = await BusinessLoader.userBusiness.get(clientIds[0]);
        if (!user)
            throw new ErrorCommon(102, 'Client');
        let clients = await BusinessLoader.userBusiness.getListUser(clientIds);
        let listClient = clientIds.map(userId => {
            let client = clients.find(c => c._id.toString() === userId.toString());
            if (!client)
                throw new ErrorCommon(102, 'Client');
            else
                return client;
        });

        let dataReports = await BusinessLoader.crunchBusiness.getDataReport(originId, productCode, managerId, clientIds, beginYear, beginMonth, endYear, endMonth);

        let TemplateDataReport = new TemplateDataReportCsv(dataReports, listClient);
        let localFile = 'tmp/' + 'data-report-' + user._id + '.csv'; // Address and name for new pdf invoice fle
        await TemplateDataReport.exportCsvFile(localFile);

        let crunchPrefix = `${user._id}/${productCode}/${beginMonth}_${beginYear}-${endMonth}_${endYear}`;
        let fileName = `data-report${beginMonth}_${beginYear}-${endMonth}_${endYear}.csv`;

        let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, fileName, Project.GOOGLE_STORAGE.BUCKET_NAME);
        return urlDownload;
    }

    async exportCrunchReportAllClient(originId: string, type: number, beginYear: number, beginMonth: number, endYear: number, endMonth: number, productSelect: number): Promise<any> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        if (!type)
            throw new ErrorCommon(101, 'type');
        if (!beginYear)
            throw new ErrorCommon(101, 'beginYear');
        if (!beginMonth)
            throw new ErrorCommon(101, 'beginMonth');
        if (!endYear)
            throw new ErrorCommon(101, 'endYear');
        if (!endMonth)
            throw new ErrorCommon(101, 'endMonth');
        if (!productSelect)
            throw new ErrorCommon(101, 'productSelect');

        let endTime = moment([endYear, endMonth]);
        let startTime = moment([beginYear, beginMonth]);
        let differenceTime = endTime.diff(startTime, 'months');
        if (differenceTime > 12 || differenceTime < 0)
            throw new ErrorCommon(101, 'Time');

        let dataTime: Array<{ year: number, month: number }> = [];
        for (let j = 0; j < differenceTime + 1; j++) {
            let date = `${endYear}-${endMonth}-01`;
            let data = moment(new Date(date)).subtract(j, 'months').format('YYYY-MM-DD');
            let month = moment(new Date(data)).format('MM');
            let year = moment(new Date(data)).format('YYYY');
            dataTime.push({
                year: Number(year),
                month: Number(month)
            });
        }

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return false;

        let product = await BusinessLoader.productBusiness.getByCode(productSelect);
        if (!product)
            throw new ErrorCommon(101, 'product');
        let clients = await BusinessLoader.userBusiness.getAllUserByProductAndManager(originId, product._id);
        if (!clients || !Array.isArray(clients) || clients.length === 0)
            throw new ErrorCommon(102, 'Client');
        let dataExport: any = [];
        for (let i = 0; i < clients.length; i++) {
            let item = clients[i];
            let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByUserId(item._id);
            if (connectBank.length) {
                connectBank.forEach(element => {
                    dataExport.push({
                        originId: originId,
                        clientId: item._id,
                        accountId: element.accountId,
                        productCode: productSelect,
                        type: element.type,
                    });
                });
            }
        }
        return true;
    }

    private sortByTime(transactions) {
        return transactions.sort((a, b) => {
            if (a.year !== b.year)
                return a.year - b.year;
            else
                return a.month - b.month;
        });
    }

    private getOptionRender(title) {
        return {
            format: 'A4', border: '0cm',
            footer: {
                height: '2cm',
                contents: {
                    default: '' +
                        '<div style="font-size: 6px;color:#BFBFBF;position: relative;bottom:0px">' +
                        '<div style="position: relative;bottom: -5px">' + title + '</div>' +
                        '<div style="text-align: right;">PAGE {{page}}/{{pages}} </div>' +
                        '</div>',
                }
            },
            header: {
                height: '1cm',
            },
            renderDelay: 1000
        };
    }

    private filterCode(template: any): string[] {
        let result: any = [];
        if (template.items && template.items.length > 0) {
            template.items.forEach(item => {
                result = result.concat(this.filterCode(item));
            });
        }
        if (template.code && !template.items)
            result.push(template.code);
        return result;
    }

    private getContentCsvByRequest(csvPath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            request.get(csvPath, function (error, response, body) {
                if (error)
                    reject(error);
                else
                    resolve(body);
            });
        });
    }

    private isTransactionMonthly(transaction: Transaction, beginMonth: number, beginYear: number, endMonth: number, endYear: number) {
        // console.log(beginYear, beginMonth, endYear, endMonth);
        const result = new Date(transaction.year, transaction.month, 1) >= new Date(beginYear, beginMonth, 1) && new Date(transaction.year, transaction.month, 1) <= new Date(endYear, endMonth, 1);
        // console.log(transaction.year, transaction.month, result);
        return result;
    }

    private ischartAccountOpeningBalanceMonthly(chartAccountOpeningBalanceTime: any, beginMonth: number, beginYear: number, endMonth: number, endYear: number) {
        // console.log(beginYear, beginMonth, endYear, endMonth);
        const result = new Date(chartAccountOpeningBalanceTime.year, chartAccountOpeningBalanceTime.month, 1) >= new Date(beginYear, beginMonth, 1) && new Date(chartAccountOpeningBalanceTime.year, chartAccountOpeningBalanceTime.month, 1) <= new Date(endYear, endMonth, 1);
        // console.log(transaction.year, transaction.month, result);
        return result;
    }

    private timeFilter(beginMonth: number, beginYear: number, endMonth: number, endYear: number) {
        const beginMonthInFinalYear = 7;
        let beginFinalYear = beginYear;
        if (beginMonth < beginMonthInFinalYear)
            beginFinalYear = beginFinalYear - 1;
        return beginFinalYear;
    }

    private convertMonth(number:number) {
        let month:any = [];
        month[0] = 'January';
        month[1] = 'February';
        month[2] = 'March';
        month[3] = 'April';
        month[4] = 'May';
        month[5] = 'June';
        month[6] = 'July';
        month[7] = 'August';
        month[8] = 'September';
        month[9] = 'October';
        month[10] = 'November';
        month[11] = 'December';

        return month[number - 1];
    }
}

Object.seal(ReportBusiness);
export default ReportBusiness;
