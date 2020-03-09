import FileBusiness from '../app/business/FileBusiness';
import IFileBusiness from '../app/business/interfaces/IFileBusiness'; import RoleBusiness from '../app/business/RoleBusiness';
import IRoleBusiness from '../app/business/interfaces/IRoleBusiness';
import IUserBusiness from '../app/business/interfaces/IUserBusiness';
import UserBusiness from '../app/business/UserBusiness';
import ProductBusiness from '../app/business/ProductBusiness';
import IProductBusiness from '../app/business/interfaces/IProductBusiness';
import PermissionBusiness from '../app/business/PermissionBusiness';
import IPermissionBusiness from '../app/business/interfaces/IPermissionBusiness';
import ICachingBusiness from '../app/business/interfaces/ICachingBusiness';
import CachingBusiness from '../app/business/CachingBusiness';

class BusinessLoader {
    static fileBusiness: IFileBusiness;
    static roleBusiness: IRoleBusiness;
    static userBusiness: IUserBusiness;
    static productBusiness: IProductBusiness;
    static permissionBusiness: IPermissionBusiness;
    static cachingBusiness: ICachingBusiness;

    static init() {
        BusinessLoader.fileBusiness = new FileBusiness();
        BusinessLoader.roleBusiness = new RoleBusiness();
        BusinessLoader.userBusiness = new UserBusiness();
        BusinessLoader.productBusiness = new ProductBusiness();
        BusinessLoader.permissionBusiness = new PermissionBusiness();
        BusinessLoader.cachingBusiness = new CachingBusiness();
    }
}

export default BusinessLoader;
