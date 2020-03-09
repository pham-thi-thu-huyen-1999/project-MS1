import IBaseBusiness from './base/IBaseBusiness';
import Role from 'justdone-system-package/dest/app/model/role/Role'; // eslint-disable-line

interface IRoleBusiness extends IBaseBusiness<Role> {
    getAll: () => Promise<Role[]>;
    getByCodes: (codes: number[]) => Promise<Role[]>;
    getByProductCode: (productCode: number) => Promise<Role[]>;
    checkAndCreateDataCaching: (countRolesCached: number) => Promise<boolean>;
}

export default IRoleBusiness;
