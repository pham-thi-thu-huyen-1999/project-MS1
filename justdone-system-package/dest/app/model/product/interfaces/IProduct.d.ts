import IBaseModel from '../../common/interfaces/IBaseModel';
import ProductConfig from '../ProductConfig';
import { ProductType } from '../../common/CommonType';
interface IProduct extends IBaseModel {
    code: number;
    name: string;
    type: ProductType;
    logo?: any;
    favicon?: any;
    isCompleted?: boolean;
    config: ProductConfig;
}
export default IProduct;
