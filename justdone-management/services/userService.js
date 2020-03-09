export default class UserService {
    constructor(axios) {
        this.axios = axios;
    }

    getCountClientInfo() {
        return this.axios.get(`/api/manager/count-client-info`);
    }

    getCountAllUser() {
        return this.axios.get('/api/manager/count-all-user');
    }

    getCountNewUser() {
        return this.axios.get(`/api/manager/count-new-user`);
    }

    getCountAllCacel() {
        return this.axios.get('/api/manager/count-all-cancel');
    }

    getCountCancelUser(productCode = '') {
        return this.axios.get(`/api/manager/count-cancel-user?productCode=${productCode}`);
    }

    getPermission(token = '') {
        return this.axios.get(`/api/user/permissions?token=${token}`);
    }

    validateEmail(email = '') {
        return this.axios.get(`/api/user/check-email?email=${email}`);
    }

    getManagersForAssign(productCode, targetId, roleCodes, keyword, page, limit) {
        return this.axios.get(`/api/manager/managers-for-assign?productCode=${productCode}&targetId=${targetId}&roleCodes=${roleCodes}&keyword=${keyword}&page=${page}&limit=${limit}`);
    }

    // getCountManagersForAssign(productCode, userId, roleCodes, keyword) {
    //     return this.axios.get(`/api/manager/count-managers-for-assign?productCode=${productCode}&userId=${userId}&roleCodes=${roleCodes}&keyword=${keyword}`);
    // }

    getClientsByProduct(productCode = '', page, limit, keyword = '') {
        return this.axios.get(`api/manager/clients-lookup?productCode=${productCode}&keyword=${keyword}&page=${page}&limit=${limit}`);
    }

    getCountClientsByProduct(productCode = '', keyword = '') {
        return this.axios.get(`api/manager/count-clients-lookup?productCode=${productCode}&keyword=${keyword}`);
    }

    getClientsByProductAndCoa(productCode = '', coaId = '', keyword = '', page, limit) {
        return this.axios.get(`/api/manager/clients-by-coa?productCode=${productCode}&coaId=${coaId}&keyword=${keyword}&page=${page}&limit=${limit}`);
    }

    getCountClientsByProductAndCoa(productCode = '', coaId = '', keyword = '') {
        return this.axios.get(`/api/manager/count-clients-by-coa?productCode=${productCode}&coaId=${coaId}&keyword=${keyword}`);
    }

    getAssignedClientsChartAccount(productCode = '', coaId = '', keyword = '', page, limit) {
        return this.axios.get(`/api/manager/assigned-client?productCode=${productCode}&coaId=${coaId}&keyword=${keyword}&page=${page}&limit=${limit}`);
    }

    getCountAssignedClientsChartAccount(productCode = '', coaId = '', keyword = '') {
        return this.axios.get(`/api/manager/count-assigned-client?productCode=${productCode}&coaId=${coaId}&keyword=${keyword}`);
    }

    getUserAuthorization(productCode, roleCode) {
        return this.axios.get(`/api/manager/user-authoriation?productCode=${productCode || 0}&roleCode=${roleCode || 0}`);
    }

    getManagers(productCodes = [], roleCodes = [], keyword = '', isDeleted = false, page, limit) {
        return this.axios.get(`/api/manager/managers?productCodes=${productCodes ? productCodes.join(',') : ''}&roleCodes=${roleCodes ? roleCodes.join(',') : ''}&keyword=${keyword}&isDeleted=${isDeleted}&page=${page}&limit=${limit}`);
    }

    getCountManagers(productCodes = [], roleCodes = [], keyword = '', isDeleted = false) {
        return this.axios.get(`/api/manager/count-managers?productCodes=${productCodes.join(',')}&roleCodes=${roleCodes.join(',')}&keyword=${keyword}&isDeleted=${isDeleted}`);
    }

    getManagersAssignment(productCodes = [], roleCodes = [], productCodeAssignments = [], keyword = '', isDeleted = false, page, limit) {
        return this.axios.get(`/api/manager/managers-assignment?productCodes=${productCodes ? productCodes.join(',') : ''}&roleCodes=${roleCodes ? roleCodes.join(',') : ''}&productCodeAssignments=${productCodeAssignments ? productCodeAssignments.join(',') : ''}&keyword=${keyword}&isDeleted=${isDeleted}&page=${page}&limit=${limit}`);
    }

    getCountManagersAssignment(productCodes = [], roleCodes = [], productCodeAssignments = [], keyword = '', isDeleted = false) {
        return this.axios.get(`/api/manager/count-managers-assignment?productCodes=${productCodes.join(',')}&roleCodes=${roleCodes.join(',')}&productCodeAssignments=${productCodeAssignments ? productCodeAssignments.join(',') : ''}&keyword=${keyword}&isDeleted=${isDeleted}`);
    }

    getClientByDate(productCodes = [], roleCodes = [], keyword = '', isDeleted = false, page, limit) {
        return this.axios.get(`/api/manager/client-by-date?productCodes=${productCodes.join(',')}&roleCodes=${roleCodes.join(',')}&keyword=${keyword}&isDeleted=${isDeleted}&page=${page}&limit=${limit}`);
    }

    getClients(productCodes = [], roleCodes = [], keyword = '', isDeleted = false, page, limit) {
        return this.axios.get(`/api/manager/clients?productCodes=${productCodes.join(',')}&roleCodes=${roleCodes.join(',')}&keyword=${keyword}&isDeleted=${isDeleted}&page=${page}&limit=${limit}`);
    }

    getCountClients(productCodes = [], keyword = '', isDeleted = false) {
        return this.axios.get(`/api/manager/count-clients?productCodes=${productCodes.join(',')}&keyword=${keyword}&isDeleted=${isDeleted}`);
    }

    getClientsByManager(productCodes = [], managerId = '', keyword = '', isDeleted = false, page, limit) {
        return this.axios.get(`/api/manager/clients-by-manager?productCodes=${productCodes.join(',')}&managerId=${managerId}&keyword=${keyword}&isDeleted=${isDeleted}&page=${page}&limit=${limit}`);
    }

    getCountClientsByManager(productCodes = [], managerId = '', keyword = '', isDeleted = false) {
        return this.axios.get(`/api/manager/count-clients-by-manager?productCodes=${productCodes.join(',')}&managerId=${managerId}&keyword=${keyword}&isDeleted=${isDeleted}`);
    }

    getClientInfo(clientId) {
        return this.axios.get(`/api/manager/client-info/${clientId}`);
    }

    getUserChartAccountOpeningBalance(clientId) {
        return this.axios.get(`/api/user/chart-account-opening-balance/${clientId}`);
    }

    createAndUpdateChartAccountOpeningBalance(clientId, data) {
        return this.axios.put(`/api/user/create-and-update-chart-account-opening-balance/${clientId}`, data);
    }

    getUserById(userId) {
        if (!userId)
            return false;
        return this.axios.get(`api/user/get-by-id/${userId}`);
    }

    getAddressAutoComplete(keyword = '', limit) {
        return this.axios.get(`/api/user/address?keyword=${keyword}&limit=${limit}`);
    }

    getConnectedBanksByUserLogin() {
        return this.axios.get('/api/user/connected-banks');
    }

    getUserProfile(_id) {
        return this.axios.get(`/api/manager/profile/${_id}`);
    }

    getCountClientsByManagers(productCode = '', managerIds = []) {
        return this.axios.post(`/api/manager/count-clients-by-managers`, {
            productCode,
            managerIds
        });
    }

    getManagersByUsers(productCodes = [], roleCodes = [], clientIds = []) {
        return this.axios.post(`/api/manager/managers-by-users`, {
            productCodes,
            roleCodes,
            clientIds
        });
    }

    getCountManagersByUsers(productCodes = [], roleCodes = [], clientIds = []) {
        return this.axios.post(`/api/manager/count-managers-by-users`, {
            productCodes,
            roleCodes,
            clientIds
        });
    }

    getCrunchStatus(data) {
        return this.axios.post('/api/crunch/status', {userIds: data});
    }

    getUserByEmail(email) {
        return this.axios.post('/api/user/get-user-by-email', {email});
    }

    updateFinancialYear(newYear, userId) {
        return this.axios.put('api/user/update-financial/', {newYear, userId});
    }

    getUserPersonalInfo(_id) {
        return this.axios.get(`/api/manager/personal-info/${_id}`);
    }

    getUserBusinessInfo(_id) {
        return this.axios.get(`/api/manager/business-info/${_id}`);
    }

    getProfile() {
        return this.axios.get('/api/user/profile');
    }

    getPersonalInfo() {
        return this.axios.get('/api/user/personal-info');
    }

    getBusinessInfo() {
        return this.axios.get('/api/user/business-info');
    }

    sendEmail(data) {
        return this.axios.post(`/api/manager/send-email`, data);
    }

    signin(productCode, email, password) {
        return this.axios.post(`/api/user/signin?productCode=${productCode}`, {email, password});
    }

    signout() {
        return this.axios.post('/api/user/signout');
    }

    uploadAvatar(_id, data) {
        return this.axios.post(`/api/manager/avatar/${_id}`, data, {timeout: 20000});
    }

    uploadMyAvatar(data) {
        return this.axios.post('/api/user/avatar', data, {timeout: 20000});
    }

    uploadAvatarBusiness(_id, data) {
        return this.axios.post(`/api/manager/business-logo/${_id}`, data, {timeout: 20000});
    }

    updateUserProfile(_id, data) {
        return this.axios.put(`/api/manager/profile/${_id}`, data);
    }

    updateProfile(data) {
        return this.axios.put('/api/user/profile', data);
    }

    changePassword(data) {
        return this.axios.put('/api/user/change-password', data);
    }

    changePrivate(data) {
        return this.axios.put(`/api/manager/business-type`, data);
    }

    forgotPassword(email, productcode) {
        return this.axios.get(`/api/user/forgot-key?email=${email}&productcode=${productcode}`);
    }

    resetPassword(data) {
        return this.axios.put(`/api/user/reset-password`, data);
    }

    createManager(productCode, roleCode, data) {
        return this.axios.post(`/api/manager?productCode=${productCode}&roleCode=${roleCode}`, data);
    }

    createClient(productCode, data) {
        return this.axios.post(`/api/manager/create-client?productCode=${productCode}`, data);
    }

    updateBusinessInfo(data) {
        return this.axios.put('/api/user/business-info', data);
    }

    deleteManualAccount(_id) {
        return this.axios.delete(`/api/connect-bank/manual/${_id}`);
    }

    deleteUser(_id) {
        return this.axios.delete(`/api/manager/${_id}`);
    }

    restoreUser(_id) {
        return this.axios.put(`/api/manager/restore/${_id}`);
    }

    assignManager(originId, managerIds) {
        return this.axios.put('/api/manager/assign', {_id: originId, managerIds: managerIds});
    }

    unassignManager(originId, managerIds) {
        return this.axios.put('/api/manager/unassign', {_id: originId, managerIds: managerIds});
    }

    getConnectedBanksByUserId(userId) {
        if (!userId)
            return;
        return this.axios.get(`/api/manager/connected-bank/${userId}`);
    }

    reconnectBank(data) {
        return this.axios.put('/api/manager/reconnect-bank', data);
    }
};
