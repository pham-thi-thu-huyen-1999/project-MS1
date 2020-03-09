import IUserBusiness from './interfaces/IUserBusiness'; // eslint-disable-line
import UserRepository from 'justdone-system-package/dest/app/repository/UserRepository';
import User from 'justdone-system-package/dest/app/model/user/User';
import IUser from 'justdone-system-package/dest/app/model/user/interfaces/IUser'; // eslint-disable-line
import UserConnectedBank from 'justdone-system-package/dest/app/model/user/UserConnectedBank'; // eslint-disable-line
import YodleeHelper from 'justdone-system-package/dest/helpers/YodleeHelper';// eslint-disable-line
import LogHelper from 'justdone-system-package/dest/helpers/LogHelper';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import {BankType} from 'justdone-system-package/dest/app/model/common/CommonType';
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';

const fileName = 'UserBusiness';
class UserBusiness implements IUserBusiness {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async get(_id: string): Promise<User | null> {
        if (!_id)
            return null;

        let user = await this.userRepository.get(_id);
        return user && new User(user);
    }

    async getYodleeAccountByUserId(_id: string): Promise<any> {
        const fnName = 'Get Yodlee Account By UserId';
        // LogHelper.logInfo(fileName, fnName, `Geting Yodlee Account With User Id : ${_id}`);
        console.log(`Geting Yodlee Account With User Id : ${_id}`);
        if (!_id) {
            console.log('===============> error');
            throw new Error('user id is not null');
        }
        console.log('===============> 1');
        let yodleeAccount;
        try {
            let param = {
                query: <any>{
                    _id: DataHelper.toObjectId(_id)
                }
            };

            let user = await this.userRepository.findOne(param);
            if (!user)
                throw new ErrorCommon(101, 'User');
            yodleeAccount = user.yodleeAccount;
        }
        catch (error) {
            console.log(error);
        }
        console.log('===============> 2');
        LogHelper.logInfo(fileName, fnName, `Yodlee Account With User Id : ${yodleeAccount}`);
        if (!yodleeAccount || !yodleeAccount.user)
            yodleeAccount = {
                user: 'JustDone_Live_' + _id,
                password: '@69n@mTech@hungLive!'
            };
        LogHelper.logInfo(fileName, fnName, `Yodlee Account With User Id : ${yodleeAccount}`);
        return yodleeAccount;
    }
    async getConnectedBanksByUserId(_id: string): Promise<UserConnectedBank[]> {
        if (!_id)
            return [];

        let param = {
            query: <any>{
                _id: DataHelper.toObjectId(_id)
            }
        };
        let user = await this.userRepository.findOne(param);

        if (!user)
            return [];

        return user.connectedBanks && UserConnectedBank.parseArray(user.connectedBanks);
    }

    async updateConnectedBanks(_id: string, UserConnectedBank: UserConnectedBank): Promise<boolean> {
        const fnName = 'update connected bank';
        console.log(fileName, fnName, `Update Connected Bank With User Id : ${_id}`, UserConnectedBank);
        if (!_id) {
            throw new Error('missing User Id');
        }
        if (!UserConnectedBank)
            throw new Error('missing type connected');
        if (UserConnectedBank['type'] !== BankType.Bank && UserConnectedBank['type'] !== BankType.CreditCard)
            new Error('type bank not exits');
        let user = await this.userRepository.get(_id);
        if (!user) {
            throw new Error('user not exits');
        }
        // let connectedBanks = user.connectedBanks ? user.connectedBanks : [];
        // let indexConnected = _.findIndex(connectedBanks, (item) => {
        //     return item.type === userConnectedBanks.type;
        // });
        // if (indexConnected === -1) {
        //     if (!userConnectedBanks.providerId)
        //         throw new Error('missing providerId');
        //     connectedBanks.push({
        //         currentBalance: userConnectedBanks.currentBalance ? userConnectedBanks.currentBalance : 0,
        //         type: userConnectedBanks.type,
        //         providerId: userConnectedBanks.providerId ? userConnectedBanks.providerId : '',
        //         connectedId: userConnectedBanks.connectedId ? userConnectedBanks.connectedId : '',
        //         connectedName: userConnectedBanks.connectedName ? userConnectedBanks.connectedName : '',
        //         bankId: userConnectedBanks.bankId ? userConnectedBanks.bankId : ''
        //     });
        // }
        // else {
        //     connectedBanks[indexConnected] = {
        //         currentBalance: userConnectedBanks.currentBalance ? userConnectedBanks.currentBalance : (connectedBanks[indexConnected] ? connectedBanks[indexConnected].currentBalance : 0),
        //         type: connectedBanks[indexConnected].type,
        //         providerId: userConnectedBanks.providerId ? userConnectedBanks.providerId : connectedBanks[indexConnected].providerId,
        //         connectedId: userConnectedBanks.connectedId ? userConnectedBanks.connectedId : connectedBanks[indexConnected].connectedId,
        //         connectedName: userConnectedBanks.connectedName ? userConnectedBanks.connectedName : connectedBanks[indexConnected].connectedName,
        //         accounts: userConnectedBanks.accounts ? userConnectedBanks.accounts : (connectedBanks[indexConnected].accounts ? connectedBanks[indexConnected].accounts : []),
        //         bankId: userConnectedBanks.bankId ? userConnectedBanks.bankId : connectedBanks[indexConnected].bankId,
        //         disabledPullTransaction: userConnectedBanks.disabledPullTransaction || userConnectedBanks.disabledPullTransaction === false ? userConnectedBanks.disabledPullTransaction : (
        //             connectedBanks[indexConnected].disabledPullTransaction ? connectedBanks[indexConnected].disabledPullTransaction : false
        //         ),
        //         isReconnectBank: userConnectedBanks.isReconnectBank || userConnectedBanks.isReconnectBank === false ? userConnectedBanks.isReconnectBank : (
        //             connectedBanks[indexConnected].isReconnectBank ? connectedBanks[indexConnected].isReconnectBank : false
        //         )
        //     };
        // }
        let updateData:any = {};
        if (UserConnectedBank.accounts)
            updateData['connectedBanks.$.accounts'] = UserConnectedBank.accounts;
        if (UserConnectedBank.providerId)
            updateData['connectedBanks.$.providerId'] = UserConnectedBank.providerId;
        if (UserConnectedBank.currentBalance)
            updateData['connectedBanks.$.currentBalance'] = UserConnectedBank.currentBalance;
        if (Object.keys(updateData).length > 0)
            await this.userRepository.findOneAndUpdate({_id: _id, connectedBanks: {$elemMatch: {type: UserConnectedBank.type}}}, updateData);
        return true;
    }
}

Object.seal(UserBusiness);
export default UserBusiness;
