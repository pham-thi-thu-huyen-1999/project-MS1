import IRoleBusiness from './interfaces/IRoleBusiness'; // eslint-disable-line
import RoleRepository from 'justdone-system-package/dest/app/repository/RoleRepository';
import CachingHelper from 'justdone-system-package/dest/helpers/CachingHelper';
import Role from 'justdone-system-package/dest/app/model/role/Role'; // eslint-disable-line
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import BusinessLoader from '../../system/BusinessLoader';

class RoleBusiness implements IRoleBusiness {
    private roleRepository: RoleRepository;

    constructor() {
        this.roleRepository = new RoleRepository();
    }

    async getAll(): Promise<Role[]> {
        let roles = <any[]>[];
        try {
            // roles = await DataCachingHelper.roleService.getAll();
            roles = await CachingHelper.get(`/role/all`);
        }
        catch (error) {
            console.log('RoleBusiness.getAll\n', error);
            roles = await this.roleRepository.findAll({}, {level: 1});
        }
        return Role.parseArray(roles);
    }

    async getByCodes(codes: number[]): Promise<Role[]> {
        let roles = <any[]>[];
        try {
            // roles = await DataCachingHelper.roleService.getByCodes(codes);
            roles = await CachingHelper.get(`/role/codes?codes=${codes.join(',')}`);
            if (!roles.length)
                roles = await this.roleRepository.find({query: {code: {$in: codes}}}, {level: 1});
        }
        catch (error) {
            console.log('RoleBusiness.getByCodes\n', error);
            roles = await this.roleRepository.find({query: {code: {$in: codes}}}, {level: 1});
        }
        return Role.parseArray(roles);
    }

    async getByProductCode(productCode: number): Promise<Role[]> {
        let roles = <any[]>[];
        try {
            // roles = await DataCachingHelper.roleService.getByProductCode(productCode);
            roles = await CachingHelper.get(`/role/product-code?productCode=${productCode}`);
        }
        catch (error) {
            console.log('RoleBusiness.getByProductCode\n', error);
            let product = await BusinessLoader.productBusiness.getByCode(productCode);
            if (!product)
                return [];

            let param = {
                query: {
                    products: DataHelper.toObjectId(product._id)
                }
            };
            roles = await this.roleRepository.find(param, {level: 1});
        }
        return Role.parseArray(roles);
    }

    async checkAndCreateDataCaching(countRolesCached: number): Promise<boolean> {
        let countRoles = await this.roleRepository.getCount();

        if (countRoles !== countRolesCached) {
            let roles = await this.roleRepository.findAll({}, {level: 1});
            CachingHelper.post(`/role/multiple`, Role.parseArray(roles));
            return true;
        }
        return false;
    }

    get(): any {}
    create(): any {}
    update(): any {}
    delete(): any {}
}

Object.seal(RoleBusiness);
export default RoleBusiness;
