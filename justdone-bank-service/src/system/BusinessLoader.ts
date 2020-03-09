import AccountingBusiness from '../app/business/AccountingBusiness';
import IAccountingBusiness from '../app/business/interfaces/IAccountingBusiness';
import LogBusiness from '../app/business/LogBusiness';
import ILogBusiness from '../app/business/interfaces/ILogBusiness';
import StatementBusiness from '../app/business/StatementBusiness';
import IStatementBusiness from '../app/business/interfaces/IStatementBusiness';
import TransactionBusiness from '../app/business/TransactionBusiness';
import ITransactionBusiness from '../app/business/interfaces/ITransactionBusiness';
import UserBusiness from '../app/business/UserBusiness';
import IUserBusiness from '../app/business/interfaces/IUserBusiness';
import YodleeBusiness from '../app/business/YodleeBusiness';
import IYodleeBusiness from '../app/business/interfaces/IYodleeBusiness';
import CrunchBusiness from '../app/business/CrunchBusiness';
import ICrunchBusiness from '../app/business/interfaces/ICrunchBusiness';
import ConnectBankBusiness from '../app/business/ConnectBankBusiness';
import IConnectBankBusiness from '../app/business/interfaces/IConnectBankBusiness';

class BusinessLoader {
    static accountingBusiness: IAccountingBusiness;
    static logBusiness: ILogBusiness;
    static statementBusiness: IStatementBusiness;
    static transactionBusiness: ITransactionBusiness;
    static userBusiness: IUserBusiness;
    static yodleeBusiness: IYodleeBusiness;
    static crunchBusiness: ICrunchBusiness;
    static connectBankBusiness: IConnectBankBusiness;

    static init() {
        BusinessLoader.accountingBusiness = new AccountingBusiness();
        BusinessLoader.logBusiness = new LogBusiness();
        BusinessLoader.statementBusiness = new StatementBusiness();
        BusinessLoader.transactionBusiness = new TransactionBusiness();
        BusinessLoader.userBusiness = new UserBusiness();
        BusinessLoader.yodleeBusiness = new YodleeBusiness();
        BusinessLoader.crunchBusiness = new CrunchBusiness();
        BusinessLoader.connectBankBusiness = new ConnectBankBusiness();
    }
}

export default BusinessLoader;
