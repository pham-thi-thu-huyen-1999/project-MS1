import BusinessLoader from '../system/BusinessLoader';
import BaseController from './base/BaseController';

class StransactionController extends BaseController {
    private transactionBusiness = BusinessLoader.transactionBusiness;

    constructor() {
        super();

        this.post('/get-transaction-by-month', this.getTransactionsByMonth.bind(this));
    }

    async getTransactionsByMonth(req): Promise<any> {
        return await this.transactionBusiness.getTransactionsByMonth(req.body.userId, req.body.accountId, req.body.type, req.body.month, req.body.year);
    }
}

Object.seal(StransactionController);
export default StransactionController;
