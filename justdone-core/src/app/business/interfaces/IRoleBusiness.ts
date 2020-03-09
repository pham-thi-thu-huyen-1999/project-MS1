import IBaseBusiness from './base/IBaseBusiness';
import Role from 'justdone-system-package/dest/app/model/role/Role'; // eslint-disable-line
import RoleLookup from 'justdone-system-package/dest/app/model/role/RoleLookup'; // eslint-disable-line
import RoleCreate from 'justdone-system-package/dest/app/model/role/RoleCreate'; // eslint-disable-line
import RoleUpdate from 'justdone-system-package/dest/app/model/role/RoleUpdate'; // eslint-disable-line

interface IRoleBusiness extends IBaseBusiness<Role> {
    getAll: () => Promise<Role[]>;
    getRoleLookup: (originId: string, productCodes: number[], toRoleCodes?: number[]) => Promise<RoleLookup[]>;
    getByCode: (code: number) => Promise<Role | null>;
    getByCodes: (codes: number[]) => Promise<Role[]>;
    createRoleByProductType: (productId: string, productType: number) => Promise<Role[]>;
    create: (data: RoleCreate) => Promise<Role>;
    update: (_id: string, data: RoleUpdate) => Promise<Role | null>;
}

export default IRoleBusiness;
