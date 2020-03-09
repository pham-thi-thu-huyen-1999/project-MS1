import IProductBusiness from './interfaces/IProductBusiness'; // eslint-disable-line
import ProductRepository from 'justdone-system-package/dest/app/repository/ProductRepository';
import Product from 'justdone-system-package/dest/app/model/product/Product'; // eslint-disable-line

class ProductBusiness implements IProductBusiness {
    private productRepository: ProductRepository;

    constructor() {
        this.productRepository = new ProductRepository();
    }

    // Only use internal (not public api)
    async getAll(): Promise<Product[]> {
        let param = {
            query: {
                deletedAt: null
            },
            populate: populateInfoCommon()
        };
        let products = await this.productRepository.findAll(param, {type: 1, code: 1});
        return Product.parseArray(products);
    }

    async get(_id: string): Promise<Product | null> {
        if (!_id)
            return null;

        let product = await this.productRepository.get(_id, populateInfoCommon());
        return product && new Product(product);
    }

    async getCodesByTypes(types: number[]): Promise<number[]> {
        if (!types || !types.length)
            return [];

        let param = {
            query: {
                type: {$in: types},
                deletedAt: null,
                isCompleted: true
            },
            select: 'code'
        };
        let products = await this.productRepository.findAll(param, {type: 1, code: 1});
        return products.map(p => p.code);
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

    create(data: any): any {}

    update(_id: string, data: any): any {}

    delete(_id: string, isRealDelete?: boolean): any {}
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

Object.seal(ProductBusiness);
export default ProductBusiness;
