import IProduct from '../model/product/interfaces/IProduct';
import BaseRepository from './base/BaseRepository';
declare class ProductRepository extends BaseRepository<IProduct> {
    constructor();
}
export default ProductRepository;
