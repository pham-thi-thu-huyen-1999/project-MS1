import * as express from 'express';
import YodleeController from '../controllers/YodleeController';
import StatementController from '../controllers/StatementController';
import AccountingController from '../controllers/AccountingController';
import SystemController from '../controllers/SystemController';
import ConnectBankController from '../controllers/ConnectBankController';
import TransactionController from '../controllers/TransactionController';

class RouteLoader {
    private app: express.Express = express();

    constructor() {
        this.app.use('/api/yodlee', new YodleeController().getRouter());
        this.app.use('/api/statement', new StatementController().getRouter());
        this.app.use('/api/accounting', new AccountingController().getRouter());
        this.app.use('/api/system', new SystemController().getRouter());
        this.app.use('/api/connect-bank', new ConnectBankController().getRouter());
        this.app.use('/api/transaction', new TransactionController().getRouter());
    }

    getRouters() {
        return this.app;
    }
}

export default RouteLoader;
