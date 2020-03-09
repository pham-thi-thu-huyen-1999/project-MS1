import RoleBusiness from '../app/business/RoleBusiness';
import IRoleBusiness from '../app/business/interfaces/IRoleBusiness';
import ProductBusiness from '../app/business/ProductBusiness';
import IProductBusiness from '../app/business/interfaces/IProductBusiness';
import ReportBusiness from '../app/business/ReportBusiness';
import IReportBusiness from '../app/business/interfaces/IReportBusiness';
import SettingReportBusiness from '../app/business/SettingReportBusiness';
import ISettingReportBusiness from '../app/business/interfaces/ISettingReportBusiness';
import StatementBusiness from '../app/business/StatementBusiness';
import IStatementBusiness from '../app/business/interfaces/IStatementBusiness';
import YodleeBusiness from '../app/business/YodleeBusiness';
import IYodleeBusiness from '../app/business/interfaces/IYodleeBusiness';
import AnalyticBusiness from '../app/business/AnalyticBusiness';
import IAnalyticBusiness from '../app/business/interfaces/IAnalyticBusiness';
import ITransactionBusiness from '../app/business/interfaces/ITransactionBusiness';
import TransactionBusiness from '../app/business/TransactionBusiness';
import ChartAccountBusiness from '../app/business/ChartAccountBusiness';
import IChartAccountBusiness from '../app/business/interfaces/IChartAccountBusiness';
import IConnectBankBusiness from '../app/business/interfaces/IConnectBankBusiness';

import UserBusiness from '../app/business/UserBusiness';
import IUserBusiness from '../app/business/interfaces/IUserBusiness';
import CrunchBusiness from '../app/business/CrunchBusiness';
import ICrunchBusiness from '../app/business/interfaces/ICrunchBusiness';
import GroupExpenseBusiness from '../app/business/GroupExpenseBusiness';
import IGroupExpenseBusiness from '../app/business/interfaces/IGroupExpenseBusiness';
import ChartAccountAssignmentBusiness from '../app/business/ChartAccountAssignmentBusiness';
import IChartAccountAssignmentBusiness from '../app/business/interfaces/IChartAccountAssignmentBusiness';
import BudgetBusiness from '../app/business/BudgetBusiness';
import IBudgetBusiness from '../app/business/interfaces/IBudgetBusiness';
import GroupReportBusiness from '../app/business/GroupReportBusiness';
import IGroupReportBusiness from '../app/business/interfaces/IGroupReportBusiness';
import BalanceSheetReportBusiness from '../app/business/BalanceSheetReportBusiness';
import IBalanceSheetReportBusiness from '../app/business/interfaces/IBalanceSheetReportBusiness';
import IFileBusiness from '../app/business/interfaces/IFileBusiness';
import FileBusiness from '../app/business/FileBusiness';
import IUsageBudgetBusiness from '../app/business/interfaces/IUsageBudgetBusiness';
import UsageBudgetBusiness from '../app/business/UsageBudgetBusiness';
import IGeneralJournalBusiness from '../app/business/interfaces/IGeneralJournalBusiness';
import GeneralJournalBusiness from '../app/business/GeneralJournalBusiness';
import ConnectBankBusiness from '../app/business/ConnectBankBusiness';

class BusinessLoader {
    static roleBusiness: IRoleBusiness;
    static productBusiness: IProductBusiness;
    static reportBusiness: IReportBusiness;
    static statementBusiness: IStatementBusiness;
    static yodleeBusiness: IYodleeBusiness;
    static analyticBusiness: IAnalyticBusiness;
    static transactionBusiness: ITransactionBusiness;
    static chartAccountBusiness: IChartAccountBusiness;
    static userBusiness: IUserBusiness;
    static crunchBusiness:ICrunchBusiness;
    static groupExpenseBusiness: IGroupExpenseBusiness;
    static chartAccountAssignmentBusiness: IChartAccountAssignmentBusiness;
    static budgetBusiness: IBudgetBusiness;
    static settingReportBusiness: ISettingReportBusiness;
    static groupReportBusiness: IGroupReportBusiness;
    static balanceSheetBusiness: IBalanceSheetReportBusiness;
    static fileBusiness: IFileBusiness;
    static usageBudgetBusiness: IUsageBudgetBusiness;
    static generalJournalBusiness: IGeneralJournalBusiness;
    static connectBankBusiness: IConnectBankBusiness;

    static init() {
        BusinessLoader.roleBusiness = new RoleBusiness();
        BusinessLoader.productBusiness = new ProductBusiness();
        BusinessLoader.reportBusiness = new ReportBusiness();
        BusinessLoader.statementBusiness = new StatementBusiness();
        BusinessLoader.yodleeBusiness = new YodleeBusiness();
        BusinessLoader.analyticBusiness = new AnalyticBusiness();
        BusinessLoader.transactionBusiness = new TransactionBusiness();
        BusinessLoader.chartAccountBusiness = new ChartAccountBusiness();
        BusinessLoader.userBusiness = new UserBusiness();
        BusinessLoader.crunchBusiness = new CrunchBusiness();
        BusinessLoader.groupExpenseBusiness = new GroupExpenseBusiness();
        BusinessLoader.chartAccountAssignmentBusiness = new ChartAccountAssignmentBusiness();
        BusinessLoader.budgetBusiness = new BudgetBusiness();
        BusinessLoader.settingReportBusiness = new SettingReportBusiness();
        BusinessLoader.groupReportBusiness = new GroupReportBusiness();
        BusinessLoader.balanceSheetBusiness = new BalanceSheetReportBusiness();
        BusinessLoader.fileBusiness = new FileBusiness();
        BusinessLoader.usageBudgetBusiness = new UsageBudgetBusiness();
        BusinessLoader.generalJournalBusiness = new GeneralJournalBusiness();
        BusinessLoader.connectBankBusiness = new ConnectBankBusiness();
    }
}

export default BusinessLoader;
