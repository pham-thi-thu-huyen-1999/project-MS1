import IProduct from './interfaces/IProduct';
import ProductConfig from './ProductConfig';
import { ProductType } from '../common/CommonType';
declare class Product {
    _id: string;
    code: number;
    name: string;
    type: ProductType;
    logo?: any;
    favicon?: any;
    isCompleted?: boolean;
    config: ProductConfig;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(model: IProduct);
    static parseArray(list: IProduct[]): Product[];
}
export default Product;
