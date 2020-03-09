import IBaseBusiness from './base/IBaseBusiness';
import Product from 'justdone-system-package/dest/app/model/product/Product'; // eslint-disable-line

interface IProductBusiness extends IBaseBusiness<Product> {
    getAll: () => Promise<Product[]>;
    getByCode:(code: number) => Promise<Product | null>;
    getByCodes: (codes: number[]) => Promise<Product[]>;
}

export default IProductBusiness;
