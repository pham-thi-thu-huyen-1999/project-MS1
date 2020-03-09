import BusinessLoader from '../system/BusinessLoader';
import BaseController from './base/BaseController';

class ConnectBankController extends BaseController {
    private connectBankBusiness = BusinessLoader.connectBankBusiness;

    constructor() {
        super();

        this.get('/test-created', this.create.bind(this));
    }

    async create(req): Promise<any> {
        const createData:any = {
            userId: '5bb709698548eb19fdfec4cf',
            type: 1,
            providerId: '3952',
            providerAccountId: '11815232',
            currentBalance: 9080.55,
            refreshinfo: {
                lastRefreshed: new Date('2019-05-26T11:56:42Z'),
                nextRefreshScheduled: new Date('2019-05-27T03:38:51Z'),
                lastRefreshAttempt: new Date('2019-05-26T11:56:42Z'),
                statusMessage: 'OK',
                statusCode: 0
            },
            accountId: 14337654,
            accountName: 'Cheque Account',
            accountNumber: 'xxxx5654',
            accountStatus: '1',
            balance: 9080.55,
            status: 1,
            disabledPullTransaction: true
        };
        return await this.connectBankBusiness.create(createData);
    }
}

Object.seal(ConnectBankController);
export default ConnectBankController;
