import IProduct from "./interfaces/IProduct"; // eslint-disable-line
import ProductConfig from './ProductConfig';
import {ProductType} from '../common/CommonType';

class ProductCreate {
    code: number;
    name: string;
    type: ProductType;
    isCompleted?: boolean;
    config: ProductConfig;

    constructor(model: IProduct) {
        if (!model)
            return;

        this.code = model.code;
        this.name = model.name;
        this.type = model.type;
        this.isCompleted = false;
        this.config = new ProductConfig(model.config);
    }
}

Object.seal(ProductCreate);
export default ProductCreate;
