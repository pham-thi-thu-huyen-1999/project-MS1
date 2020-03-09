declare class ProductConfig {
    domain: string;
    colorScheme: number;
    emailSupport: string;
    nameSupport: string;
    clientLimit: number;
    financialYear: {
        beginMonth: number;
        endMonth: number;
    };
    constructor(model: ProductConfig);
}
export default ProductConfig;
