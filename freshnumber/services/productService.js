export default class ProductService {
    constructor(axios) {
        this.axios = axios;
    }

    lookup(productCodes = [], claims = []) {
        return this.axios.get(`/api/product/lookup?codes=${productCodes ? productCodes.join(',') : ''}&claims=${claims ? claims.join(',') : ''}`);
    }

    getProductByDomain(domain) {
        return this.axios.get(`/api/product/domain?domain=${domain}`);
    }
}
