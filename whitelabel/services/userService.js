// import Users from '~/assets/datajson/users.json';

export default class UserService {
    constructor(axios) {
        this.axios = axios;
    }

    getCountClientInfo() {
        return this.axios.get(`/api/manager/count-client-info`);
    }

    getClientInfo(clientId) {
        return this.axios.get(`/api/manager/client-info/${clientId}`);
    }

    getPersonalInfo(clientId) {
        return this.axios.get(`/api/manager/personal-info/${clientId}`);
    }

    getBusinessInfo(clientId) {
        return this.axios.get(`/api/manager/business-info/${clientId}`);
    }

    getManagers(productCodes, roleCodes, keyword = '', isDeleted = false, page, limit) {
        return this.axios.get(`/api/manager/managers?productCodes=${productCodes.join(',')}&roleCodes=${roleCodes.join(',')}&keyword=${keyword}&isDeleted=${isDeleted}&page=${page}&limit=${limit}`);
    }

    getCountManagers(productCodes, roleCodes, keyword = '', isDeleted = false) {
        return this.axios.get(`/api/manager/count-managers?productCodes=${productCodes.join(',')}&roleCodes=${roleCodes.join(',')}&keyword=${keyword}&isDeleted=${isDeleted}`);
    }

    getClientByDate(productCodes = [], roleCodes = [], keyword = '', isDeleted = false, page, limit) {
        return this.axios.get(`/api/manager/client-by-date?productCodes=${productCodes.join(',')}&roleCodes=${roleCodes.join(',')}&keyword=${keyword}&isDeleted=${isDeleted}&page=${page}&limit=${limit}`);
    }

    getClients(productCode, keyword = '', isDeleted = false, page, limit) {
        return this.axios.get(`/api/manager/clients?productCodes=${productCode}&keyword=${keyword}&isDeleted=${isDeleted}&page=${page}&limit=${limit}`);
    }

    getCountClients(productCode, keyword = '', isDeleted = false) {
        return this.axios.get(`/api/manager/count-clients?productCode=${productCode}&keyword=${keyword}&isDeleted=${isDeleted}`);
    }

    getClientsByManager(productCodes = [], managerId = '', keyword = '', isDeleted = false, page, limit) {
        return this.axios.get(`/api/manager/clients-by-manager?productCodes=${productCodes.join(',')}&managerId=${managerId}&keyword=${keyword}&isDeleted=${isDeleted}&page=${page}&limit=${limit}`);
    }

    getCountClientsByManager(productCodes = [], managerId = '', keyword = '', isDeleted = false) {
        return this.axios.get(`/api/manager/count-clients-by-manager?productCodes=${productCodes.join(',')}&managerId=${managerId}&keyword=${keyword}&isDeleted=${isDeleted}`);
    }

    getUserProfile() {
        return this.axios.get('/api/user/profile');
    }

    getUserPersonalInfo() {
        return this.axios.get('/api/user/personal-info');
    }

    getUserBusinessInfo() {
        return this.axios.get('/api/user/business-info');
    }

    getPermission(token = '') {
        return this.axios.get(`/api/user/permissions?token=${token}`);
    }

    getAddressAutoComplete(keyword = '', limit) {
        return this.axios.get(`/api/user/address?keyword=${keyword}&limit=${limit}`);
    }

    getConnectedBanksByUserLogin() {
        return this.axios.get('/api/user/connected-banks');
    }

    getConnectedBanksByUserId(userId) {
        if (!userId)
            return;
        return this.axios.get(`/api/manager/connected-bank/${userId}`);
    }

    getManagersByClients(productCodes, roleCodes, clientIds) {
        return this.axios.post(`/api/manager/managers-by-users`, {
            productCodes,
            roleCodes,
            clientIds
        });
    }

    getCountClientsByManagers(productCode, managerIds) {
        return this.axios.post(`/api/manager/count-clients-by-managers`, {
            productCode,
            managerIds
        });
    }

    getClientInviteds(productCode, keyword = '', page, limit) {
        return this.axios.get(`/api/manager/inviteds?productCodes=${productCode}&keyword=${keyword}&page=${page}&limit=${limit}`);
    }

    getCountClientInviteds(productCode, keyword = '') {
        return this.axios.get(`/api/manager/count-inviteds?productCodes=${productCode}&keyword=${keyword}`);
    }

    getProduct(productId) {
        return this.axios.get(`/api/product?productId=${productId}`);
    }

    verifyInvitation(token) {
        return this.axios.get(`/api/manager/verify-invitation?token=${token}`);
    }

    getLogoProduct(_id) {
        return this.axios.get(`/api/file/${_id}`);
    }

    getStatusInvited(data) {
        return this.axios.post('/api/manager/status-invitation', data);
    }

    getCrunchStatus(data) {
        return this.axios.post('/api/crunch/status', {userIds: data});
    }

    signup(productCode, data, inviteToken) {
        return this.axios.post(`/api/user/signup?productCode=${productCode}&inviteToken=${inviteToken}`, data);
    }

    signin(productCode, email, password) {
        return this.axios.post(`/api/user/signin?productCode=${productCode}`, {email, password});
    }

    signout() {
        return this.axios.post('/api/user/signout');
    }

    createProductManager(productCode, roleCode, data) {
        return this.axios.post(`/api/manager?productCode=${productCode}&roleCode=${roleCode}`, data);
    }

    sendInvitation(data) {
        return this.axios.post(`/api/manager/invitation-client`, data);
    }

    uploadAvatar(data) {
        return this.axios.post('/api/user/avatar', data, {timeout: 20000});
    }

    uploadAvatarBusiness(data) {
        return this.axios.post('/api/user/business-logo', data, {timeout: 20000});
    }

    uploadLogoOrFaviconProduct(_id, data, imageProductType) {
        return this.axios.post(`/api/product/logo?_id=${_id}&imageProductType=${imageProductType}`, data, {timeout: 20000});
    }

    updateUserProfile(data) {
        return this.axios.put('/api/user/profile', data);
    }

    updateBusinessInfo(data) {
        return this.axios.put('/api/user/business-info', data);
    }

    updateProduct(_id, data) {
        return this.axios.put(`/api/product/${_id}`, data);
    }

    // updateTheme(_id, data) {
    //     return this.axios.patch(`/api/product/${_id}`, data);
    // }

    changePassword(data) {
        return this.axios.put('/api/user/change-password', data);
    }

    forgotPassword(email, productcode) {
        return this.axios.get(`/api/user/forgot-key?email=${email}&productcode=${productcode}`);
    }

    resetPassword(data) {
        return this.axios.put(`/api/user/reset-password`, data);
    }

    reInvitation(inviteId) {
        return this.axios.put(`/api/manager/re-invitation-client?inviteId=${inviteId}`);
    }

    assignManager(_id, managerIds) {
        return this.axios.put('/api/manager/assign', {
            _id: _id,
            managerIds
        });
    }

    unassignManager(_id, managerIds) {
        return this.axios.put('api/manager/unassign', {
            _id: _id,
            managerIds
        });
    }

    restoreUser(_id) {
        return this.axios.put(`/api/manager/restore/${_id}`);
    }

    deleteInvitation(inviteId) {
        return this.axios.delete(`/api/manager/invitation?inviteId=${inviteId}`);
    }

    deleteInvitationByToken(email, token) {
        return this.axios.delete(`/api/manager/invitation-by-token?email=${email}&token=${token}`);
    }

    deleteUser(_id) {
        return this.axios.delete(`/api/manager/${_id}`);
    }

    updateUserConnectBank(data) {
        return this.axios.put('/api/user/connected-banks', data);
    }
};
