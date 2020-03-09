import IProduct from "./interfaces/IProduct";
import ProductConfig from './ProductConfig';
import { ProductType } from '../common/CommonType';
declare class ProductUpdate {
    name: string;
    type: ProductType;
    config: ProductConfig;
    constructor(model: IProduct);
}
export default ProductUpdate;
