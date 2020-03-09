import BusinessLoader from '../../system/BusinessLoader';
import IConnectBankBusiness from './interfaces/IConnectBankBusiness'; // eslint-disable-line
import ConnectBankRepository from 'justdone-system-package/dest/app/repository/ConnectBankRepository';
import ConnectBank from 'justdone-system-package/dest/app/model/connectBank/ConnectBank'; // eslint-disable-line
import ConnectBankCreate from 'justdone-system-package/dest/app/model/connectBank/ConnectBankCreate'; // eslint-disable-line
import ConnectBankUpdate from 'justdone-system-package/dest/app/model/connectBank/ConnectBankUpdate'; // eslint-disable-line
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import {StatusConnectBank} from 'justdone-system-package/dest/app/model/common/CommonType';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';

class ConnectBankBusiness implements IConnectBankBusiness {
    private connectBankRepository: ConnectBankRepository;

    constructor() {
        this.connectBankRepository = new ConnectBankRepository();
    }

    async get(_id: string): Promise<ConnectBank | null> {
        if (!_id)
            throw new ErrorCommon(101, 'id');

        let connectBank = await this.connectBankRepository.get(_id);

        return connectBank && new ConnectBank(connectBank);
    }

    async findAllConnectBank(userIds?:string[]): Promise<ConnectBank[]> {
        let params = {
            query: <any>{
                type: {
                    $exists: true,
                    $ne: ''
                },
                providerAccountId: {
                    $exists: true,
                    $ne: ''
                },
                accountId: {
                    $exists: true,
                    $ne: ''
                },
                accountName: {
                    $exists: true,
                    $ne: ''
                },
                isDisabled: false,
                status: StatusConnectBank.Connected
            },
            populate: [{
                path: 'userId',
                select: '_id email'
            }]
        };

        if (userIds && Array.isArray(userIds) && userIds.length > 0)
            params.query.userId = {
                $in: userIds
            };

        let connectBanks = await this.connectBankRepository.findAll(params);

        return ConnectBank.parseArray(connectBanks);
    }

    async getConnectBanksByUserId(userId: string): Promise<ConnectBank[]> {
        if (!userId)
            throw new ErrorCommon(101, 'Request');

        let originUser = await BusinessLoader.userBusiness.get(userId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');

        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                isDisabled: false,
                status: StatusConnectBank.Connected
            }
        };

        let connectBanks = await this.connectBankRepository.findAll(params);

        return ConnectBank.parseArray(connectBanks);
    }

    async getConnectBankByAccountId(userId: string, accountId: string): Promise<ConnectBank | null> {
        if (!userId)
            throw new ErrorCommon(101, 'Request');
        if (!accountId)
            throw new ErrorCommon(101, 'Account Id');

        let originUser = await BusinessLoader.userBusiness.get(userId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');
        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                accountId: accountId,
                isDisabled: false,
                status: StatusConnectBank.Connected
            }
        };

        let connectBank = await this.connectBankRepository.findOne(params);

        return connectBank && new ConnectBank(connectBank);
    }

    async create(data: ConnectBankCreate): Promise<ConnectBank> {
        if (!data)
            throw new ErrorCommon(101, 'data');

        let connectBank = await this.connectBankRepository.create(data);
        let aaa = new ConnectBank(connectBank);
        console.log(aaa);
        return connectBank && new ConnectBank(connectBank);
    }

    async update(_id: string, data: ConnectBankUpdate): Promise<any | null> {
        await this.connectBankRepository.update(_id, data);
        return true;
    }

    async updateConnectedBanks(_id: string, data: ConnectBankUpdate): Promise<any | null> {
        if (!_id)
            throw new ErrorCommon(101, '_id');
        if (!data)
            throw new ErrorCommon(101, 'data');
        let connectBank = await this.get(_id);
        if (!connectBank)
            throw new ErrorCommon(101, 'connectBank');

        if (data.type)
            connectBank.type = data.type;

        if (data.providerId)
            connectBank.providerId = data.providerId;

        if (data.providerAccountId)
            connectBank.providerAccountId = data.providerAccountId;

        if (data.refreshinfo)
            connectBank.refreshinfo = data.refreshinfo;

        if (data.accountId)
            connectBank.accountId = data.accountId;

        if (data.accountStatus)
            connectBank.accountStatus = data.accountStatus;

        if (data.accountNumber)
            connectBank.accountNumber = data.accountNumber;

        if (data.accountName)
            connectBank.accountName = data.accountName;

        if (data.currentBalance)
            connectBank.currentBalance = data.currentBalance;

        if (data.balance)
            connectBank.balance = data.balance;

        if (data.status)
            connectBank.status = data.status;

        if (data.disabledPullTransaction)
            connectBank.disabledPullTransaction = data.disabledPullTransaction;

        let result = await this.connectBankRepository.update(_id, connectBank);
        if (!result)
            throw new ErrorCommon(101, 'result');

        return true;
    }

    async delete(_id: string): Promise<boolean> {
        if (!_id)
            throw new ErrorCommon(101, '_id');
        let connectBank = await this.connectBankRepository.get(_id);
        if (!connectBank)
            throw new ErrorCommon(101, 'connectBank');

        return await this.connectBankRepository.delete(_id, true);
    }
}
Object.seal(ConnectBankBusiness);
export default ConnectBankBusiness;
