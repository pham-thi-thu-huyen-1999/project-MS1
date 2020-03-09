import IConnectBank from '../model/connectBank/interfaces/IConnectBank';
import BaseRepository from './base/BaseRepository';
import ConnectBankCreate from '../model/connectBank/ConnectBankCreate';
declare class ConnectBankRepository extends BaseRepository<IConnectBank> {
    constructor();
    create(data: ConnectBankCreate): Promise<IConnectBank>;
}
export default ConnectBankRepository;
