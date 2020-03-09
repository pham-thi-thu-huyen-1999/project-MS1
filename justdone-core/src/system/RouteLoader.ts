import * as express from 'express';
import SystemController from '../controllers/SystemController';
import UserController from '../controllers/UserController';
import ManagerController from '../controllers/ManagerController';
import ProductController from '../controllers/ProductController';
import RoleController from '../controllers/RoleController';
// import FinanceController from '../controllers/FinanceController';
// import AccountingController from '../controllers/AccountingController';
import FildeController from '../controllers/FileController';
// import ReceiptController from '../controllers/ReceiptController';
import YodleeController from '../controllers/YodleeController';
import StatementController from '../controllers/StatementController';
import TransactionController from '../controllers/TransactionController';
import AbnController from '../controllers/AbnController';
// import StripeController from '../controllers/StripeController';
import GroupExpensController from '../controllers/GroupExpenseController';
import ChartAccountController from '../controllers/ChartAccountController';
import BudgetController from '../controllers/BudgetController';
import CrunchController from '../controllers/CrunchController';
import NotificationController from '../controllers/NotificationController';
import MessageController from '../controllers/MessageController';
import SettingReportController from '../controllers/SettingReportController';
import GroupReportController from '../controllers/GroupReportController';
import GeneralJournalController from '../controllers/GeneralJournalController';
import ConnectBankController from '../controllers/ConnectBankController';

class RouteLoader {
    private app: express.Express = express();

    constructor() {
        this.app.use('/api/system', new SystemController().getRouter());
        this.app.use('/api/user', new UserController().getRouter());
        this.app.use('/api/manager', new ManagerController().getRouter());
        this.app.use('/api/role', new RoleController().getRouter());
        // this.app.use('/api/finance', new FinanceController().getRouter());
        // this.app.use('/api/accounting', new AccountingController().getRouter());
        this.app.use('/api/crunch', new CrunchController().getRouter());
        this.app.use('/api/file', new FildeController().getRouter());
        // this.app.use('/api/receipt', new ReceiptController().getRouter());
        this.app.use('/api/yodlee', new YodleeController().getRouter());
        this.app.use('/api/statement', new StatementController().getRouter());
        this.app.use('/api/transaction', new TransactionController().getRouter());
        this.app.use('/api/abn', new AbnController().getRouter());
        this.app.use('/api/chart-account', new ChartAccountController().getRouter());
        this.app.use('/api/group-expenses', new GroupExpensController().getRouter());
        this.app.use('/api/product', new ProductController().getRouter());
        this.app.use('/api/budget', new BudgetController().getRouter());
        this.app.use('/api/notification', new NotificationController().getRouter());
        this.app.use('/api/message', new MessageController().getRouter());
        this.app.use('/api/setting-report', new SettingReportController().getRouter());
        this.app.use('/api/group-report', new GroupReportController().getRouter());
        this.app.use('/api/general-journal', new GeneralJournalController().getRouter());
        // this.app.use('/api/stripe', new StripeController().getRouter());
        this.app.use('/api/connect-bank', new ConnectBankController().getRouter());
    }

    getRouters() {
        return this.app;
    }
}

export default RouteLoader;
