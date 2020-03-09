import IBaseBusiness from './base/IBaseBusiness';
import Product from 'justdone-system-package/dest/app/model/product/Product'; // eslint-disable-line
import ProductLookup from 'justdone-system-package/dest/app/model/product/ProductLookup'; // eslint-disable-line
import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate'; // eslint-disable-line

interface IProductBusiness extends IBaseBusiness<Product> {
    getAll: () => Promise<Product[]>;
    getProducts: (originId: string, productCodes?: number[]) => Promise<Product[]>;
    getProductLookup: (originId: string, productCodes?: number[], claims?: number[]) => Promise<ProductLookup[]>;
    getCodesByTypes: (types: number[]) => Promise<number[]>;
    getByTypes: (originId: string, productCodes: number[], types: number[]) => Promise<Product[]>;
    getByCode: (code: number) => Promise<Product | null>;
    getByCodes: (codes: number[]) => Promise<Product[]>;
    getByDomain: (domain: string) => Promise<Product | null>;
    create: (data: any) => Promise<Product>;
    setupProduct: (originId: string, productCreate: any, userCreate: any, removeClaims: number[]) => Promise<Product | null>;
    uploadLogo: (originId: string, _id: string, imageProductType: number, logo: FileCreate) => Promise<string | null>;
    update: (_id: string, data: any) => Promise<Product | null>;
    completed: (_id: string, key: string) => Promise<boolean>;
    deleteByHand: (_id: string, key: string) => Promise<boolean>;
    deleteProduct: (originId: string, ProductId: string, isRealDelete?: boolean) => Promise<boolean>;
    delete: (_id: string, isRealDelete?: boolean) => Promise<boolean>;
    deleteProductAndUserPopulate: (productId: string) => Promise<any>;
}

export default IProductBusiness;
