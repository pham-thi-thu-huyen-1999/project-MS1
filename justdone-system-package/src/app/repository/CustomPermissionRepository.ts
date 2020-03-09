import ICustomPermission from '../model/permission/interfaces/ICustomPermission'; // eslint-disable-line
import CustomPermissionSchema from '../dataAccess/schemas/CustomPermissionSchema';
import BaseRepository from './base/BaseRepository';
import CustomPermission from '../model/permission/CustomPermission'; // eslint-disable-line

class CustomPermissionRepository extends BaseRepository<ICustomPermission> {
    constructor() {
        super(CustomPermissionSchema);
    }

    async create(data: CustomPermission): Promise<ICustomPermission> {
        return await super.create(data);
    }

    async update(_id: string, data: CustomPermission): Promise<boolean> {
        return await super.update(_id, data);
    }
}

Object.seal(CustomPermissionRepository);
export default CustomPermissionRepository;
