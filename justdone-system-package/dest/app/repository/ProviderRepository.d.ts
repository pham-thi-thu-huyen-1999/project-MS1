import IProvider from '../model/provider/interfaces/IProvider';
import ProviderCreate from '../model/provider/ProviderCreate';
import BaseRepository from './base/BaseRepository';
declare class ProviderRepository extends BaseRepository<IProvider> {
    constructor();
    create(data: ProviderCreate): Promise<IProvider>;
}
export default ProviderRepository;
