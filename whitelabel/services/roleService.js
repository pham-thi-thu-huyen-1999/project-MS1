export default class RoleService {
    constructor(axios) {
        this.axios = axios;
    }

    getRoles(productCode, roleCodes) {
        return this.axios.get(`/api/role?productCodes=${productCode || ''}&roleCodes=${roleCodes && Array.isArray(roleCodes) ? roleCodes.join(',') : ''}`);
    }
};
