import IProduct from './interfaces/IProduct'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';
import ProductConfig from './ProductConfig';

class Product {
    _id: string;
    code: number;
    type: number;
    name: string;
    logo: any;
    favicon: any;
    config: ProductConfig;

    constructor(model: IProduct) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.code = model.code;
        this.type = model.type;
        this.name = model.name;
        this.logo = DataHelper.handleFileDataModel(model.logo);
        this.favicon = DataHelper.handleFileDataModel(model.favicon);
        this.config = new ProductConfig(model.config);
    }

    static parseArray(list: IProduct[]): Product[] {
        return list && Array.isArray(list) ? list.map(item => new Product(item)) : [];
    }
}

Object.seal(Product);
export default Product;
