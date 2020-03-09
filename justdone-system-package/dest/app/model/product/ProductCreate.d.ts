import IProduct from "./interfaces/IProduct";
import ProductConfig from './ProductConfig';
import { ProductType } from '../common/CommonType';
declare class ProductCreate {
    code: number;
    name: string;
    type: ProductType;
    isCompleted?: boolean;
    config: ProductConfig;
    constructor(model: IProduct);
}
export default ProductCreate;
