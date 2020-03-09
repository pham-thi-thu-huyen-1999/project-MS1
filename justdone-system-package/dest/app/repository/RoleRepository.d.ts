import IRole from '../model/role/interfaces/IRole';
import BaseRepository from './base/BaseRepository';
import RoleCreate from '../model/role/RoleCreate';
declare class RoleRepository extends BaseRepository<IRole> {
    constructor();
    create(data: RoleCreate): Promise<IRole>;
}
export default RoleRepository;
