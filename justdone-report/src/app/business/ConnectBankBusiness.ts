// import BankServiceHelper from 'justdone-system-package/dest/helpers/BankServiceHelper';
// import {BankType} from 'justdone-system-package/dest/app/model/common/CommonType';
import ConnectBankRepository from 'justdone-system-package/dest/app/repository/ConnectBankRepository';
import IConnectBankBusiness from './interfaces/IConnectBankBusiness'; // eslint-disable-line
import ConnectBank from 'justdone-system-package/dest/app/model/connectBank/ConnectBank'; // eslint-disable-line
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import {StatusConnectBank} from 'justdone-system-package/dest/app/model/common/CommonType';
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';

class ConnectBankBusiness implements IConnectBankBusiness {
    private connectBankRepository: ConnectBankRepository;

    constructor() {
        this.connectBankRepository = new ConnectBankRepository();
    }

    async getConnectBankByAccountId(userId: string, accountId: string, excludeId?: string): Promise<ConnectBank | null> {
        if (!userId)
            throw new ErrorCommon(101, 'Request');
        if (!accountId)
            throw new ErrorCommon(101, 'id');
        // let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return [];

        let originUser = await AuthorizationHelper.userService.get(userId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');
        // let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        // if (!originUser || !originUser.permission ||
        //     !products.find(product => product.code === productCode))
        //     return [];
        let params = {
            query: <any>{
                accountId: accountId,
                userId: DataHelper.toObjectId(userId),
            }
        };
        if (excludeId)
            params.query._id = {$ne: DataHelper.toObjectId(excludeId)};
        let connectBank = await this.connectBankRepository.findOne(params);

        return connectBank && new ConnectBank(connectBank);
    }

    async getConnectBankByUserId(userId: string): Promise<ConnectBank[]> {
        if (!userId)
            throw new ErrorCommon(101, 'Request');
        // let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return [];

        let originUser = await AuthorizationHelper.userService.get(userId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');
        // let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        // if (!originUser || !originUser.permission ||
        //     !products.find(product => product.code === productCode))
        //     return [];
        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                status: StatusConnectBank.Connected
            }
        };
        let connectBanks = await this.connectBankRepository.findAll(params);

        return ConnectBank.parseArray(connectBanks);
    }

    async getConnectBankByUserIds(originId: string, userIds: string[]): Promise<ConnectBank[]> {
        if (!userIds.length)
            throw new ErrorCommon(101, 'accountIds');
        if (!originId)
            throw new ErrorCommon(101, 'originId');
        // let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return [];

        let originUser = await AuthorizationHelper.userService.get(originId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');

        // let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        // if (!originUser || !originUser.permission ||
        //     !products.find(product => product.code === productCode))s
        //     return [];
        let params = {
            query: <any>{
                userId: {$in: userIds.map(item => {
                    DataHelper.toObjectId(item);
                })},
                status: StatusConnectBank.Connected
            }
        };

        let connectBank = await this.connectBankRepository.find(params);

        return ConnectBank.parseArray(connectBank);
    }
}

Object.seal(ConnectBankBusiness);
export default ConnectBankBusiness;
