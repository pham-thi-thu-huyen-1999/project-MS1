import * as crypto from 'crypto';
import IProductBusiness from './interfaces/IProductBusiness'; // eslint-disable-line
import BusinessLoader from '../../system/BusinessLoader';
import ProductRepository from 'justdone-system-package/dest/app/repository/ProductRepository';
import Product from 'justdone-system-package/dest/app/model/product/Product'; // eslint-disable-line
import ProductLookup from 'justdone-system-package/dest/app/model/product/ProductLookup'; // eslint-disable-line
import ProductCreate from 'justdone-system-package/dest/app/model/product/Product'; // eslint-disable-line
import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate'; // eslint-disable-line
import {RoleCode, ProductType, ProductCode, ImageProduct} from 'justdone-system-package/dest/app/model/common/CommonType'; // eslint-disable-line
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import module from 'justdone-system-package/dest/resources/permission/module';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper'; // eslint-disable-line
import GoogleStorageHelper from 'justdone-system-package/dest/helpers/GoogleStorageHelper';
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';
import {getPermissionsByProductType} from '../../resources/initialData/Permissions';
import Project from '../../config/Project'; // eslint-disable-line
import MailHelper from 'justdone-system-package/dest/helpers/MailHelper'; // eslint-disable-line
import Role from 'justdone-system-package/dest/app/model/role/Role'; // eslint-disable-line

class ProductBusiness implements IProductBusiness {
    private productRepository: ProductRepository;

    constructor() {
        this.productRepository = new ProductRepository();
    }

    // Only use internal (not public api)
    async getAll(): Promise<Product[]> {
        let products = <any[]>[];
        let param = {
            query: {
                deletedAt: null,
            },
            populate: populateInfoCommon()
        };
        products = await this.productRepository.findAll(param, {type: 1, code: 1});
        return Product.parseArray(products);
    }

    async getProducts(originId: string, productCodes?: number[]): Promise<Product[]> {
        let products = await Authenticator.filterProductsPermission([module.PRODUCT.claim.GET.code], originId);
        if (!products || !products.length)
            return [];

        products = await this.getAll();
        if (productCodes && productCodes.length)
            products = products.filter(product => productCodes.find(code => code === product.code));

        /* get product is active. */
        products = products.filter(product => product.isCompleted === true);
        return Product.parseArray(<any>products);
    }

    async getProductLookup(originId: string, productCodes?: number[], claims?: number[]): Promise<ProductLookup[]> {
        let products = await Authenticator.filterProductsPermission([module.PRODUCT.claim.GET.code], originId, productCodes);
        if (!products || !products.length)
            return [];

        if (claims && claims.length)
            products = await Authenticator.filterProductsPermission(claims, originId, productCodes);

        // fix cache
        let productAll = await this.getAll();
        products.map(item => {
            let productAllItem = productAll.find(itemx => itemx.code === item.code);
            if (productAllItem) item.name = productAllItem.name;
        });

        /* get product is active. */
        products = products.filter(product => product.isCompleted === true);
        return ProductLookup.parseArray(<any>products);
    }

    async get(_id: string): Promise<Product | null> {
        if (!_id)
            return null;

        let product;
        product = await this.productRepository.get(_id, populateInfoCommon());
        return product && new Product(product);
    }

    async getCodesByTypes(types: number[]): Promise<number[]> {
        if (!types || !types.length)
            return [];

        let products = <any[]>[];
        let param = {
            query: {
                type: {$in: types},
                deletedAt: null,
                isCompleted: true
            },
            select: 'code'
        };
        products = await this.productRepository.findAll(param, {type: 1, code: 1});
        return products.map(p => p.code);
    }

    // TODO: Need check permission
    async getByTypes(originId: string, productCodes: number[], types: number[]): Promise<Product[]> {
        if (!originId || !types || !types.length)
            return [];

        let listProducts = await Authenticator.filterProductsPermission([module.PRODUCT.claim.GET.code], originId, productCodes ? productCodes : []);

        if (productCodes && productCodes.length)
            listProducts = listProducts.filter(product => productCodes.find(code => code === product.code));

        if (!listProducts || !listProducts.length)
            return [];

        let products = <any[]>[];
        // try {
        //     products = await DataCachingHelper.productService.getByTypes(types);
        // }
        // catch (error) {
        let param = {
            query: {
                type: {$in: types},
                deletedAt: null,
                isCompleted: true
            },
            populate: populateInfoCommon()
        };
        products = await this.productRepository.findAll(param, {type: 1, code: 1});
        // }

        if (!products || !products.length)
            return [];

        return products;
    }

    async getByCode(code: number): Promise<Product | null> {
        if (!code)
            return null;

        let param = {
            query: {
                code,
                deletedAt: null,
                isCompleted: true
            },
            populate: populateInfoCommon()
        };
        let product = await this.productRepository.findOne(param);
        return product && new Product(product);
    }

    async getByCodes(codes: number[]): Promise<Product[]> {
        let param = {
            query: {
                code: {$in: codes},
                deletedAt: null,
                isCompleted: true
            },
            populate: populateInfoCommon()
        };
        let products = await this.productRepository.findAll(param, {type: 1, code: 1});
        return Product.parseArray(products);
    }

    // Only use to check name exists.
    async getByName(name: string): Promise<Product | null> {
        if (!name)
            return null;

        let params = {
            query: {
                name: name,
                deletedAt: null,
                isCompleted: true
            }
        };

        let product = await this.productRepository.findOne(params);
        return product && new Product(product);
    }

    async getByDomain(domain: string): Promise<Product | null> {
        if (!domain)
            return null;
        let param = {
            query: {
                'config.domain': domain,
                'deletedAt': null,
                'isCompleted': true
            },
            populate: populateInfoCommon()
        };

        let product = await this.productRepository.findOne(param);
        return product && new Product(product);
    }

    private async getNewCode(): Promise<number> {
        let query: any = [{
            $group: {
                _id: '$_id',
                code: {$max: '$code'}
            }
        }, {
            $sort: {code: -1}
        }, {
            $limit: 1
        }];

        let results = await this.productRepository.aggregate(query);
        if (!results || !results.length)
            return 1;
        return results[0].code + 1;
    }

    async create(data: any): Promise<Product> {
        let productCreate = new ProductCreate(data);
        productCreate.code = await this.getNewCode();
        let product;

        if (validateName(productCreate.name)) {
            if (await this.getByCode(productCreate.code))
                throw new ErrorCommon(104, 'Product code');
            if (await this.getByName(productCreate.name))
                throw new ErrorCommon(104, 'Product name');

            product = await this.productRepository.create(productCreate);
        }
        return product && new Product(product);
    }

    async setupProduct(originId: string, productCreate: any, userCreate: any, removeClaims: number[]): Promise<Product | null> {
        if (!originId || !productCreate || !userCreate || !productCreate.type)
            throw new ErrorCommon(101, 'Request');

        productCreate.config.colorScheme = 1;
        productCreate.config.emailSupport = userCreate.email;
        productCreate.config.nameSupport = userCreate.fullName;

        // Create information Product.
        let product = await this.create(productCreate);
        if (!product)
            throw new ErrorCommon(113, 'Create product');

        // Create role to Product
        let roles = await BusinessLoader.roleBusiness.createRoleByProductType(product._id, product.type);
        if (!roles.length) {
            this.delete(product._id, true);
            throw new ErrorCommon(113, 'Create Role');
        }

        // create permission for type WhiteLable product.
        let list = await getPermissionsByProductType(productCreate.type, product.code);
        let permissions: any[] = [];
        // await DataCachingHelper.delete('/api/permission/all');

        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            if (!removeClaims.includes(item.claim)) {
                try {
                    let permission = await AuthorizationHelper.permissionService.create(<any>item);
                    permissions.push(permission);
                }
                catch (error) {
                }
            }
        }
        // if (productCreate.type !== ProductType.FreshNumber) {
        let user = await BusinessLoader.managerBusiness.createManager(originId, product.code, RoleCode.ProductAdmin, userCreate);
        if (!user) {
            this.delete(product._id, true);
            for (let permission of permissions) {
                AuthorizationHelper.permissionService.delete(permission._id);
            }
            throw new ErrorCommon(113, 'Create product admin');
        }
        // }
        // let permission = <any> {
        //     claim: module.PRODUCT.claim.GET.code,
        //     product: product.code,
        //     fromRole: RoleCode.SuperAdmin,
        //     toRole: null
        // };

        // await AuthorizationHelper.permissionService.create(permission);

        let result = await this.get(product._id);
        this.sendMailDevOps(originId, result);
        return result;
    }

    async uploadLogo(originId: string, _id: string, imageProductType: number, logo: FileCreate): Promise<string | null> {
        let file;
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let productCodes = <any[]>[];
        let proCode;
        let targetUser = await AuthorizationHelper.userService.get(originId);
        if (!targetUser)
            return null;

        let roleCode = targetUser.permission && targetUser.permission.role && targetUser.permission.role.code;
        if (Number(roleCode) === RoleCode.ProductAdmin) {
            proCode = targetUser.permission && targetUser.permission.product && targetUser.permission.product.code;
            proCode && productCodes.push(proCode);
        }

        let products = await Authenticator.filterProductsPermission([module.PRODUCT.claim.UPDATE.code], originId, productCodes, []);
        if (!products || !products.length)
            return null;
        if (!_id)
            throw new ErrorCommon(101, 'Product id');

        if (!logo || !logo.extension || !logo.name)
            throw new ErrorCommon(101, 'File logo');

        let product = await this.get(_id);
        if (!product)
            throw new ErrorCommon(101, 'Product');

        logo.productCode = product.code;

        let prefix = GoogleStorageHelper.getProductPrefix(_id);
        logo.prefix = prefix;

        file = await BusinessLoader.fileBusiness.create(logo);
        if (!file)
            throw new ErrorCommon(101, 'File logo');
        // update product with logo or favicon
        if (imageProductType === ImageProduct.Logo) {
            product.logo = file._id;
            await this.productRepository.findOneAndUpdate({_id: DataHelper.toObjectId(_id)}, {logo: product.logo});
        }
        else if (imageProductType === ImageProduct.Favicon) {
            product.favicon = file._id;
            await this.productRepository.findOneAndUpdate({_id: DataHelper.toObjectId(_id)}, {favicon: product.favicon});
        }
        return file.url;
    }

    async update(_id: string, data: any): Promise<Product | null> {
        if (validateName(data.name) && validateEmail(data.config.emailSupport) && validateName(data.config.nameSupport)) {
            await this.productRepository.updateDataByFields(_id, data.config, 'config');
            await this.productRepository.update(_id, {name: data.name});
            let dataConfig = await this.productRepository.get(_id);

            if (dataConfig) {
                return dataConfig;
            }
            else
                return null;
        }
        else
            return null;
    }

    async completed(_id: string, key: string): Promise<boolean> {
        if (!_id)
            return false;

        key = hashKey(key);
        let keyOrigin = hashKey('@Justdone2018');
        if (key.toString() !== keyOrigin.toString())
            return false;

        let product = await this.get(_id);
        if (!product)
            return false;

        return await this.productRepository.update(_id, {isCompleted: true});
    }

    async deleteProductAndUserPopulate(productId: string, ): Promise<any> {
        let product = await this.get(productId);
        if (!product)
            return {status: 400, message: "Product Not Found!"};

        let users = await BusinessLoader.userBusiness.getByProductId(product._id);
        if (users) {
            for (let i = 0; i < users.length; i++) {
                await BusinessLoader.userBusiness.delete(users[i]._id);
            }
        }

        await this.productRepository.delete(product._id, true);
        return true;
    }

    async delete(_id: string, isRealDelete?: boolean): Promise<boolean> {
        let product = await this.get(_id);
        if (!product)
            return false;

        let result = await this.productRepository.delete(_id, isRealDelete);
        return result;
    }

    async deleteByHand(_id: string, key: string): Promise<boolean> {
        let product = await this.get(_id);
        if (!product)
            return false;

        key = hashKey(key);
        let keyOrigin = hashKey('@Justdone2018');
        if (key.toString() !== keyOrigin.toString())
            return false;

        let result = await this.productRepository.delete(_id);
        if (result) {
            AuthorizationHelper.delete(`/api/product/${_id}`);
            return result;
        }
        return result;
    }

    async deleteProduct(originId: string, ProductId: string, isRealDelete?: boolean): Promise<boolean> {
        let product = await this.get(ProductId);
        if (!product)
            return false;
        let productCode = product.code;

        let products = await Authenticator.filterProductsPermission([module.PRODUCT.claim.GET.code], originId, productCode ? [productCode] : []);

        if (product && products && products.length)
            products = products.filter(item => item.code === productCode);

        if (!products || !products.length)
            return false;

        if (product && product.logo)
            await BusinessLoader.fileBusiness.delete(product.logo);

        let result = await this.productRepository.delete(ProductId, isRealDelete);
        return result;
    }

    async sendMailDevOps(originId: string, productCreated: any): Promise<any> {
        let manager = await AuthorizationHelper.userService.get(originId);
        let devOpsList = Project.DEVELOPERS;
        if (!manager)
            throw new ErrorCommon(101, 'Manager');

        let product = await BusinessLoader.productBusiness.getByCode(manager!.permission!.product.code);
        if (!product)
            throw new ErrorCommon(101, 'Request');

        let content = `<p>Hi Team</p><br>`
                    + `Product created by ${manager.fullName}<br>`
                    + `Product Id: ${productCreated._id}<br>`
                    + `Product name: ${productCreated.name}<br>`
                    + `Product type: ${productCreated.type}<br>`
                    + `Product code: ${productCreated.code}<br>`
                    + `Product domain: ${productCreated.config.domain}<br>`
                    + `Server name: ${productCreated.config.nameSupport}<br>`
                    + `Server mail: ${productCreated.config.emailSupport}<br>`
                    + `Start month of a Financial Year: ${productCreated.config.financialYear.beginMonth}<br>`
                    + `Server mail: ${productCreated.config.emailSupport}<br>`
                    + `<br>`
                    + `Thank for Team!`;
        let result;
        try {
            result = await MailHelper.sendMailAdvanced(null, devOpsList, 'New Product', content);
        }
        catch (e) {}
        return result;
    }
}

function populateInfoCommon() {
    return [{
        path: 'logo',
        select: 'url'
    }, {
        path: 'favicon',
        select: 'url'
    }];
}

function validateEmail(email) {
    let regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
    if (!regExp.test(email))
        throw new ErrorCommon(201, 'email');
    return true;
}

function validateName(name: string): boolean {
    if (!name)
        throw new ErrorCommon(105, 'Name');
    else if (name.trim().length < 3)
        throw new ErrorCommon(201, 'name', 3);

    return true;
}

function hashKey(key: string) {
    if (key)
        return crypto.createHash('md5').update(key).digest('hex');
    return '';
}
Object.seal(ProductBusiness);
export default ProductBusiness;
