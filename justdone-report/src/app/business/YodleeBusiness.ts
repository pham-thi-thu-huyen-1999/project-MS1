import BankServiceHelper from 'justdone-system-package/dest/helpers/BankServiceHelper';
import {BankType} from 'justdone-system-package/dest/app/model/common/CommonType';
import ProviderRepository from 'justdone-system-package/dest/app/repository/ProviderRepository';
import IYodleeBusiness from './interfaces/IYodleeBusiness'; // eslint-disable-line
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';

class YodleeBusiness implements IYodleeBusiness {
    private providerRepository: ProviderRepository;

    constructor() {
        this.providerRepository = new ProviderRepository();
    }

    async getBankAccounts(userId: string, type: number): Promise<any> {
        if (!BankType[type]) {
            throw new ErrorCommon(102, 'Type bank');
        }
        let typeBank = type === BankType.Bank ? 'bank' : 'creditCard';
        let userDB = await AuthorizationHelper.userService.get(userId);
        if (!userDB) {
            throw new ErrorCommon(102, 'User');
        }
        let connectedBanks = userDB.connectedBanks;
        if (connectedBanks.length === 0)
            return [];

        let providerAccountId: any = '';
        let accounts: any;
        // let indexConnected = -1;
        for (let index = 0; index < connectedBanks.length; index++) {
            if (connectedBanks[index].type === type) {
                accounts = connectedBanks[index].accounts;
                // indexConnected = index;
                providerAccountId = connectedBanks[index].providerId ? connectedBanks[index].providerId : '';
                break;
            }
        }
        if (accounts && accounts.length !== 0)
            return {account: accounts};
        else {
            let bankAccounts = await BankServiceHelper.getBankAccounts(userId);
            accounts = bankAccounts.account ? bankAccounts.account : [];
            accounts = accounts.filter((account) => {
                return (account.providerAccountId.toString() === providerAccountId.toString() && account.CONTAINER === typeBank);
            });
            // if (indexConnected !== -1) {
            //     let bankAccountUpdate = {
            //         type: connectedBanks[indexConnected].type,
            //         providerId: connectedBanks[indexConnected].providerId ? connectedBanks[indexConnected].providerId : '',
            //         connectedId: connectedBanks[indexConnected].connectedId ? connectedBanks[indexConnected].connectedId : '',
            //         connectedName: connectedBanks[indexConnected].connectedName ? connectedBanks[indexConnected].connectedName : '',
            //         currentBalance: 0,
            //         accounts: accounts ? accounts : (connectedBanks[indexConnected].accounts ? connectedBanks[indexConnected].accounts : [])
            //     };
            //     BusinessLoader.userBusiness.updateConnectedBanks(userId, bankAccountUpdate);
            // }

            return {account: accounts};
        }
    }
}

Object.seal(YodleeBusiness);
export default YodleeBusiness;
