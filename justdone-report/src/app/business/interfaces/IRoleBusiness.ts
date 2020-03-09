import IBaseBusiness from './base/IBaseBusiness';
import Role from 'justdone-system-package/dest/app/model/role/Role'; // eslint-disable-line
import RoleCreate from 'justdone-system-package/dest/app/model/role/RoleCreate'; // eslint-disable-line
import RoleUpdate from 'justdone-system-package/dest/app/model/role/RoleUpdate'; // eslint-disable-line

interface IRoleBusiness extends IBaseBusiness<Role> {
    getAll: () => Promise<Role[]>;
    getByCode: (code: number) => Promise<Role | null>;
}

export default IRoleBusiness;
