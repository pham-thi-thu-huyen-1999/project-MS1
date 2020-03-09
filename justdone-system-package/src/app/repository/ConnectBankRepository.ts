import IConnectBank from '../model/connectBank/interfaces/IConnectBank'; // eslint-disable-line
import ConnectBankSchema from '../dataAccess/schemas/ConnectBankSchema';
import BaseRepository from './base/BaseRepository';
import ConnectBankCreate from '../model/connectBank/ConnectBankCreate'; // eslint-disable-line

class ConnectBankRepository extends BaseRepository<IConnectBank> {
    constructor() {
        super(ConnectBankSchema);
    }

    async create(data: ConnectBankCreate): Promise<IConnectBank> {
        return await super.create(data);
    }
}

Object.seal(ConnectBankRepository);
export default ConnectBankRepository;
