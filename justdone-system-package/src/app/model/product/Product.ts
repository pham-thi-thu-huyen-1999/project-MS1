import IProduct from './interfaces/IProduct'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';
import ProductConfig from './ProductConfig';
import {ProductType} from '../common/CommonType';

class Product {
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

    constructor(model: IProduct) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.code = model.code;
        this.name = model.name;
        this.type = model.type;
        this.logo = DataHelper.handleFileDataModel(model.logo);
        this.favicon = DataHelper.handleFileDataModel(model.favicon);
        this.isCompleted = model.isCompleted;
        this.config = new ProductConfig(model.config);

        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IProduct[]): Product[] {
        return list && Array.isArray(list) ? list.map(item => new Product(item)) : [];
    }
}

Object.seal(Product);
export default Product;
