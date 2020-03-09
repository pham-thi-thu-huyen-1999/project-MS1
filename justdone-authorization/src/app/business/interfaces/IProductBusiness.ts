import IBaseBusiness from './base/IBaseBusiness';
import Product from 'justdone-system-package/dest/app/model/product/Product'; // eslint-disable-line
import ProductCreate from 'justdone-system-package/dest/app/model/product/ProductCreate'; // eslint-disable-line
import ProductUpdate from 'justdone-system-package/dest/app/model/product/ProductUpdate'; // eslint-disable-line

interface IProductBusiness extends IBaseBusiness<Product> {
    getAll: () => Promise<Product[]>;
    getByCode: (productCode: number) => Promise<Product | null>;
    getByCodes: (codes: number[]) => Promise<Product[]>;
    checkAndCreateDataCaching: (countProductsCached: number) => Promise<boolean>;
    deleteInCaching: (_id: string) => Promise<boolean>;
}

export default IProductBusiness;
