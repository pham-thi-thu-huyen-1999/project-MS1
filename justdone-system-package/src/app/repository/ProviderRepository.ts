import IProvider from '../model/provider/interfaces/IProvider'; // eslint-disable-line
import ProviderCreate from '../model/provider/ProviderCreate'; // eslint-disable-line
import ProviderSchema from '../dataAccess/schemas/ProviderSchema';
import BaseRepository from './base/BaseRepository';

class ProviderRepository extends BaseRepository<IProvider> {
    constructor() {
        super(ProviderSchema);
    }

    async create(data: ProviderCreate): Promise<IProvider> {
        return await super.create(data);
    }
}

Object.seal(ProviderRepository);
export default ProviderRepository;
