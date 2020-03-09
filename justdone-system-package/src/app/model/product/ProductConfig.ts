import IProduct from './interfaces/IProduct'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class ProductConfig {
    domain: string;
    colorScheme: number;
    emailSupport: string;
    nameSupport: string;
    clientLimit: number;
    financialYear: {beginMonth: number, endMonth: number};

    constructor(model: ProductConfig) {
        if (!model)
            return;

        this.domain = model.domain;
        this.colorScheme = model.colorScheme;
        this.emailSupport = model.emailSupport;
        this.nameSupport = model.nameSupport;
        this.financialYear = model.financialYear;
        this.clientLimit = model.clientLimit;

        DataHelper.handleDataModelInput(this);
    }
}

Object.seal(ProductConfig);
export default ProductConfig;
