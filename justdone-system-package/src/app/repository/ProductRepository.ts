import IProduct from '../model/product/interfaces/IProduct'; // eslint-disable-line
import ProductSchema from '../dataAccess/schemas/ProductSchema';
import BaseRepository from './base/BaseRepository';
import ProductCreate from '../model/product/ProductCreate'; // eslint-disable-line
import ProductUpdate from '../model/product/ProductUpdate'; // eslint-disable-line

class ProductRepository extends BaseRepository<IProduct> {
    constructor() {
        super(ProductSchema);
    }
}

Object.seal(ProductRepository);
export default ProductRepository;
