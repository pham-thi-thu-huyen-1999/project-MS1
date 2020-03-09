import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IProductBusiness from '../app/business/interfaces/IProductBusiness';

class ProductController extends BaseController {
    private productBusiness: IProductBusiness = BusinessLoader.productBusiness;

    constructor() {
        super();

        this.get('/all', this.getAll.bind(this));
        this.get('/code', this.getProductByCode.bind(this));
        this.get('/codes', this.getProductsByCodes.bind(this));

        this.post('/check-real-data-with-cached', this.checkAndCreateDataCaching.bind(this));

        this.delete('/:_id', this.deleteInCaching.bind(this));
    }

    async getAll(req): Promise<any> {
        return await this.productBusiness.getAll();
    }

    async getProductByCode(req): Promise<any> {
        return await this.productBusiness.getByCode(Number(req.query.code));
    }

    async getProductsByCodes(req): Promise<any> {
        req.query.codes = req.query.codes ? req.query.codes.split(',').map(item => Number(item)) : [];
        return await this.productBusiness.getByCodes(req.query.codes);
    }

    async checkAndCreateDataCaching(req): Promise<any> {
        return await this.productBusiness.checkAndCreateDataCaching(req.body.count);
    }

    async deleteInCaching(req): Promise<any> {
        return await this.productBusiness.deleteInCaching(req.params._id);
    }
}

Object.seal(ProductController);
export default ProductController;
