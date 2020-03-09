import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IProductBusiness from '../app/business/interfaces/IProductBusiness';
import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate';
import FileHelper from 'justdone-system-package/dest/helpers/FileHelper';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import UploadHelper from 'justdone-system-package/dest/helpers/UploadHelper';
import ProductUpdate from 'justdone-system-package/dest/app/model/product/ProductUpdate'; // eslint-disable-line
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';

const uploadProductLogo = {
    mimetype: ['image/jpg', 'image/jpeg', 'image/png', 'image/vnd.microsoft.icon'],
    single: 'productLogo'
};

class ProductController extends BaseController {
    private productBusiness: IProductBusiness = BusinessLoader.productBusiness;

    constructor() {
        super();

        this.get('/', Authenticator.isAuthenticated, this.getProduct.bind(this));
        this.get('/list', Authenticator.isAuthenticated, this.getProducts.bind(this));
        this.get('/lookup', Authenticator.isAuthenticated, this.getProductLookup.bind(this));
        this.get('/codes-by-types', Authenticator.isAuthenticated, this.geCodesByTypes.bind(this));
        this.get('/domain', this.getByDomain.bind(this));

        this.post('/setup', Authenticator.isAuthenticated, this.setupProduct.bind(this));
        this.post('/logo', Authenticator.isAuthenticated, UploadHelper.upload(uploadProductLogo), this.uploadLogo.bind(this));

        this.put('/:_id', Authenticator.isAuthenticated, this.updateProduct.bind(this));
        this.put('/:_id/complete', this.completed.bind(this));

        this.delete('/:_id/delete', this.deleteByHand.bind(this));
        this.delete('/real-delete/:_id/:isRealDelete', this.deleteProduct.bind(this));
        this.delete('/delete-product-and-populate/:_id', this.deleteProductAndUserPopulate.bind(this));
    }

    async getProduct(req): Promise<any> {
        return await this.productBusiness.get(req.query.productId);
    }

    async getProducts(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        return await this.productBusiness.getProducts(req[Authenticator.userKey]._id, req.query.productCodes);
    }

    async getProductLookup(req): Promise<any> {
        req.query.codes = req.query.codes ? req.query.codes.split(',').map(productCode => Number(productCode)) : [];
        req.query.claims = req.query.claims ? req.query.claims.split(',').map(claim => Number(claim)) : [];
        return await this.productBusiness.getProductLookup(req[Authenticator.userKey]._id, req.query.codes, req.query.claims);
    }

    async geCodesByTypes(req): Promise<any> {
        req.query.types = req.query.types ? req.query.types.split(',').map(type => Number(type)) : [];
        return await this.productBusiness.getCodesByTypes(req.query.types);
    }

    async getByDomain(req): Promise<any> {
        return await this.productBusiness.getByDomain(req.query.domain);
    }

    async setupProduct(req): Promise<any> {
        return await this.productBusiness.setupProduct(req[Authenticator.userKey]._id, req.body.product, req.body.user, req.body.removeClaims);
    }

    async updateProduct(req): Promise<any> {
        return await this.productBusiness.update(req.params._id, new ProductUpdate(req.body));
    }

    async completed(req): Promise<any> {
        return await this.productBusiness.completed(req.params._id, req.query.key);
    }

    async uploadLogo(req): Promise<any> {
        if (req.file) {
            let fileCreate = new FileCreate(<any>{
                name: req.file.originalNameWithoutExtension,
                size: req.file.size,
                type: FileHelper.getFileTypeByExtension(req.file.extension),
                extension: req.file.extension,
                url: req.file.filename,
                userId: req[Authenticator.userKey]._id
            });
            return await this.productBusiness.uploadLogo(req[Authenticator.userKey]._id, req.query._id, Number(req.query.imageProductType), fileCreate);
        }
        throw new ErrorCommon(101, 'Product logo');
    }

    async deleteByHand(req): Promise<any> {
        return await this.productBusiness.deleteByHand(req.params._id, req.query.key);
    }

    async deleteProduct(req): Promise<any> {
        return await this.productBusiness.delete(req.params._id, req.params.isRealDelete);
    }

    async deleteProductAndUserPopulate(req): Promise<any> {
        return await this.productBusiness.deleteProductAndUserPopulate(req.params._id);
    }
}

Object.seal(ProductController);
export default ProductController;
