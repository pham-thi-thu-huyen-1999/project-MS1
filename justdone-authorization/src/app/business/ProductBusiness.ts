import Product from 'justdone-system-package/dest/app/model/product/Product'; // eslint-disable-line
import ProductRepository from 'justdone-system-package/dest/app/repository/ProductRepository';
import IProductBusiness from './interfaces/IProductBusiness'; // eslint-disable-line
import CachingHelper from 'justdone-system-package/dest/helpers/CachingHelper';

class ProductBusiness implements IProductBusiness {
    private productRepository: ProductRepository;

    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getAll(): Promise<Product[]> {
        let products = <any[]>[];
        try {
            // products = await DataCachingHelper.productService.getAll();
            products = await CachingHelper.get(`/product/all`);
        }
        catch (error) {
            console.log('ProductBusiness.getAll\n', error);
            let param = {
                populate: populateInfoCommon(),
            };
            products = await this.productRepository.findAll(param, {type: 1, code: 1});
        }
        return Product.parseArray(products);
    }

    async getByCode(productCode: number): Promise<Product | null> {
        let product;
        try {
            // product = await DataCachingHelper.productService.getByCode(productCode);
            product = await CachingHelper.get(`/product/code?code=${productCode}`);
        }
        catch (error) {
            console.log('ProductBusiness.getByCode\n', error);
            let param = {
                query: {code: productCode},
                populate: populateInfoCommon(),
            };
            product = this.productRepository.findOne(param);
        }
        return product && new Product(product);
    }

    async getByCodes(codes: number[]): Promise<Product[]> {
        let products = <any>[];
        try {
            // products = await DataCachingHelper.productService.getByCodes(codes);
            products = await CachingHelper.get(`/product/codes?codes=${codes.join(',')}`);

            if (!products.length) {
                let param = {
                    query: {code: {$in: codes}},
                    populate: populateInfoCommon()
                };
                products = await this.productRepository.find(param, {type: 1, code: 1});
            }
        }
        catch (error) {
            console.log('ProductBusiness.getByCodes\n', error);
            let param = {
                query: {code: {$in: codes}},
                populate: populateInfoCommon()
            };
            products = await this.productRepository.findAll(param, {type: 1, code: 1});
        }
        return Product.parseArray(products);
    }

    async checkAndCreateDataCaching(countProductsCached: number): Promise<boolean> {
        let param: any = {
            query: {
                $or: [{deleteAt: {$exists: false}}, {deleteAt: null}],
                isCompleted: true
            }
        };
        let countProducts = await this.productRepository.getCount(param);

        if (countProducts !== countProductsCached) {
            param.populate = populateInfoCommon();
            let products = await this.productRepository.findAll(param, {type: 1, code: 1});
            CachingHelper.post(`/product/multiple`, Product.parseArray(products));
            return true;
        }
        return false;
    }

    async deleteInCaching(_id: string): Promise<boolean> {
        if (!_id)
            return false;

        CachingHelper.delete(`/product/${_id}`);
        return true;
    }

    get(): any {}
    create(): any {}
    update(): any {}
    delete(): any {}
}

function populateInfoCommon() {
    return [{
        path: 'logo',
        select: 'url'
    }];
}

Object.seal(ProductBusiness);
export default ProductBusiness;
