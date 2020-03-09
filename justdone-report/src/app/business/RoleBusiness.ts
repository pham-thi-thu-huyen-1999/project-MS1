import IRoleBusiness from './interfaces/IRoleBusiness'; // eslint-disable-line
import RoleRepository from 'justdone-system-package/dest/app/repository/RoleRepository'; // eslint-disable-line
import Role from 'justdone-system-package/dest/app/model/role/Role'; // eslint-disable-line
import RoleLookup from 'justdone-system-package/dest/app/model/role/RoleLookup'; // eslint-disable-line
import RoleCreate from 'justdone-system-package/dest/app/model/role/RoleCreate'; // eslint-disable-line
import RoleUpdate from 'justdone-system-package/dest/app/model/role/RoleUpdate'; // eslint-disable-line
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error'; // eslint-disable-line
// import DataCachingHelper from 'justdone-system-package/dest/helpers/DataCachingHelper';

class RoleBusiness implements IRoleBusiness {
    private roleRepository: RoleRepository;

    constructor() {
        this.roleRepository = new RoleRepository();
    }

    async getAll(): Promise<Role[]> {
        let roles = await this.roleRepository.findAll({}, {level: 1});
        return Role.parseArray(roles);
    }

    async get(_id: string): Promise<Role | null> {
        if (!_id)
            return null;

        let role = await this.roleRepository.get(_id);
        return role && new Role(role);
    }

    async getByCode(code: number): Promise<Role | null> {
        if (!code)
            return null;

        let role = await this.roleRepository.findOne({query: {code}});
        return role && new Role(role);
    }

    async getByCodes(codes: number[]): Promise<Role[]> {
        if (!codes || !codes.length)
            return [];

        let roles = await this.roleRepository.findAll({query: {code: {$in: codes}}});
        return Role.parseArray(roles);
    }

    // Only use to check name exists.
    async getByName(name: string): Promise<Role | null> {
        if (!name)
            return null;

        let role = await this.roleRepository.findOne({query: {name}});
        return role && new Role(role);
    }

    create(data: RoleCreate): any {}

    update(_id: string, data: RoleUpdate): any { }

    delete(_id: string): any {}
}

Object.seal(RoleBusiness);
export default RoleBusiness;
