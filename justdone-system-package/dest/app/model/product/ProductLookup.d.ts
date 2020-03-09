import IProduct from './interfaces/IProduct';
import ProductConfig from './ProductConfig';
declare class Product {
    _id: string;
    code: number;
    type: number;
    name: string;
    logo: any;
    favicon: any;
    config: ProductConfig;
    constructor(model: IProduct);
    static parseArray(list: IProduct[]): Product[];
}
export default Product;
