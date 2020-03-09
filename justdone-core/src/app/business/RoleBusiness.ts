import IRoleBusiness from './interfaces/IRoleBusiness'; // eslint-disable-line
import RoleRepository from 'justdone-system-package/dest/app/repository/RoleRepository'; // eslint-disable-line
import Role from 'justdone-system-package/dest/app/model/role/Role'; // eslint-disable-line
import RoleLookup from 'justdone-system-package/dest/app/model/role/RoleLookup'; // eslint-disable-line
import RoleCreate from 'justdone-system-package/dest/app/model/role/RoleCreate'; // eslint-disable-line
import RoleUpdate from 'justdone-system-package/dest/app/model/role/RoleUpdate'; // eslint-disable-line
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error'; // eslint-disable-line
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
// import DataCachingHelper from 'justdone-system-package/dest/helpers/DataCachingHelper';
import module from 'justdone-system-package/dest/resources/permission/module';
import getRoles from '../../resources/initialData/Roles';
import {RoleCode, RoleForManagement, RoleForWhiteLabel, RoleForFreshNumber} from 'justdone-system-package/dest/app/model/common/CommonType'; // eslint-disable-line

class RoleBusiness implements IRoleBusiness {
    private roleRepository: RoleRepository;

    constructor() {
        this.roleRepository = new RoleRepository();
    }

    async getAll(): Promise<Role[]> {
        let roles = await this.roleRepository.findAll({}, {level: 1});
        return Role.parseArray(roles);
    }

    async getRoleLookup(originId: string, productCodes: number[], toRoleCodes?: number[]): Promise<RoleLookup[]> {
        let {roles} = await Authenticator.filterPermission([module.ROLE.claim.GET.code], originId, productCodes, toRoleCodes);
        return RoleLookup.parseArray(<any>roles);
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

        let roles;
        roles = await this.roleRepository.findAll({query: {code: {$in: codes}}});
        return Role.parseArray(roles);
    }

    async createRoleByProductType(productId: string, productType: number): Promise<Role[]> {
        if (!productType)
            return [];

        let roleCodes: any[] = [];
        let roles: any;
        if (productType === 1)
            roles = RoleForManagement;
        else if (productType === 3)
            roles = RoleForFreshNumber;
        else if (productType === 4)
            roles = RoleForWhiteLabel;

        Object.keys(roles).forEach(role => {
            if (typeof(RoleCode[role]) === 'number')
                roleCodes.push(RoleCode[role]);
        });

        let data: any[] = await this.getByCodes(roleCodes);

        if (!data.length) {
            let list = getRoles();
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                if (roleCodes.find(role => item!.data!.code === role )) {
                    item.data.products = [productId];
                    let role = await this.create(item.data);
                    data.push(role);
                }
            }
        }
        else {
            for (let item of data) {
                if (!item.products.find(r => r.toString() === productId.toString())) {
                    item.products.push(productId);
                    this.updateProducts(item._id, productId);
                }
            }
        }
        return Role.parseArray(data);
    }

    // Only use to check name exists.
    async getByName(name: string): Promise<Role | null> {
        if (!name)
            return null;

        let role = await this.roleRepository.findOne({query: {name}});
        return role && new Role(role);
    }

    async create(data: RoleCreate): Promise<Role> {
        let role;
        if (validateName(data.name)) {
            if (await this.getByCode(data.code))
                throw new ErrorCommon(104, 'Role code');
            if (await this.getByName(data.name))
                throw new ErrorCommon(104, 'Role name');

            role = await this.roleRepository.create(data);
        }
        return role && new Role(role);
    }

    async update(_id: string, data: RoleUpdate): Promise<Role | null> {
        let role;
        if (validateName(data.name)) {
            role = await this.getByName(data.name);
            if (role && role._id === _id)
                throw new ErrorCommon(104, 'Role name');

            role = null;
            let result = await this.roleRepository.update(_id, data);

            if (result) {
                role = await this.roleRepository.get(_id);
            }
        }
        return role;
    }

    async updateProducts(_id: string, productId: string): Promise<Boolean> {
        if (!_id || !productId)
            return false;

        let result = await this.roleRepository.update(_id, {$addToSet: {products: {$each: [productId]}}});
        return result;
    }

    async delete(_id: string): Promise<boolean> {
        let role = await this.get(_id);
        if (!role)
            return false;

        let result = await this.roleRepository.delete(_id);
        return result;
    }
}

function validateName(name: string): boolean {
    if (!name)
        throw new ErrorCommon(105, 'Name');
    return true;
}

Object.seal(RoleBusiness);
export default RoleBusiness;
