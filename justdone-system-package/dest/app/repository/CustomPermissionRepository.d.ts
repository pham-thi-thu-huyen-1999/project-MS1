import ICustomPermission from '../model/permission/interfaces/ICustomPermission';
import BaseRepository from './base/BaseRepository';
import CustomPermission from '../model/permission/CustomPermission';
declare class CustomPermissionRepository extends BaseRepository<ICustomPermission> {
    constructor();
    create(data: CustomPermission): Promise<ICustomPermission>;
    update(_id: string, data: CustomPermission): Promise<boolean>;
}
export default CustomPermissionRepository;
