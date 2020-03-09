import IPermission from '../model/permission/interfaces/IPermission';
import BaseRepository from './base/BaseRepository';
import PermissionCreate from '../model/permission/PermissionCreate';
import PermissionUpdate from '../model/permission/PermissionUpdate';
declare class PermissionRepository extends BaseRepository<IPermission> {
    constructor();
    create(data: PermissionCreate): Promise<IPermission>;
    update(_id: string, data: PermissionUpdate): Promise<boolean>;
}
export default PermissionRepository;
