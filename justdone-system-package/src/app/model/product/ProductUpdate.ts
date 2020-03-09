import IProduct from "./interfaces/IProduct"; // eslint-disable-line
import ProductConfig from './ProductConfig';
import {ProductType} from '../common/CommonType';
import DataHelper from '../../../helpers/DataHelper';

class ProductUpdate {
    name: string;
    type: ProductType;
    config: ProductConfig;

    constructor(model: IProduct) {
        if (!model)
            return;

        this.name = model.name;
        this.type = model.type;
        this.config = new ProductConfig(model.config);

        DataHelper.handleDataModelInput(this);
    }
}

Object.seal(ProductUpdate);
export default ProductUpdate;
