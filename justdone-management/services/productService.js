export default class ProductService {
    constructor(axios) {
        this.axios = axios;
    }

    lookup(productCodes = [], claims = []) {
        return this.axios.get(`/api/product/lookup?codes=${productCodes ? productCodes.join(',') : ''}&claims=${claims ? claims.join(',') : ''}`);
    }

    getProducts() {
        return this.axios.get(`/api/product/list`);
    }

    uploadLogo(productId, data, imageProductType) {
        return this.axios.post(`/api/product/logo?_id=${productId}&imageProductType=${imageProductType}`, data);
    }

    setup(data) {
        return this.axios.post(`/api/product/setup`, data, {timeout: 30000});
    }
};
