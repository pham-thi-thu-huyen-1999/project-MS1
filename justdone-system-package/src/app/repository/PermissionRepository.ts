import IPermission from '../model/permission/interfaces/IPermission'; // eslint-disable-line
import PermissionSchema from '../dataAccess/schemas/PermissionSchema';
import BaseRepository from './base/BaseRepository';
import PermissionCreate from '../model/permission/PermissionCreate'; // eslint-disable-line
import PermissionUpdate from '../model/permission/PermissionUpdate'; // eslint-disable-line

class PermissionRepository extends BaseRepository<IPermission> {
    constructor() {
        super(PermissionSchema);
    }

    async create(data: PermissionCreate): Promise<IPermission> {
        return await super.create(data);
    }

    async update(_id: string, data: PermissionUpdate): Promise<boolean> {
        return await super.update(_id, data);
    }
}

Object.seal(PermissionRepository);
export default PermissionRepository;
