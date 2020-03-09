export default class FileManagementService {
    constructor(axios) {
        this.axios = axios;
    }

    getFileAndFolder(userId, folderId, page, limit) {
        return this.axios.get(`/api/file/folder?userId=${userId}&folderId=${folderId}&page=${page}&limit=${limit}`);
    }

    getTotalFileAndFolder(userId, folderId) {
        return this.axios.get(`/api/file/total-folder?userId=${userId}&folderId=${folderId}`);
    }

    getInforMagic(id) {
        return this.axios.get(`/api/file/magic-link/${id}`);
    }

    getFileByName(userId, folderId, keyword, page, limit) {
        return this.axios.get(`/api/file/search/${userId}?folderId=${folderId}&search=${keyword}&page=${page}&limit=${limit}`);
    }

    getCountFileByName(userId, folderId, keyword) {
        return this.axios.get(`/api/file/total-search/${userId}?folderId=${folderId}&search=${keyword}`);
    }

    createFolderInRoot(data) {
        return this.axios.post(`/api/file/root`, data);
    }

    createFolder(data) {
        return this.axios.post(`/api/file/folder`, data);
    }

    createMagicLink(data) {
        return this.axios.post(`/api/file/magic-link`, data);
    }

    archiveFolder(id) {
        return this.axios.delete(`/api/file/${id}`);
    }

    uploadFile(userId, folderId, data, onUploadProgress) {
        console.log('data', data);
        return this.axios.post(`/api/file/upload?userId=${userId}&folderId=${folderId}`, data, {
            timeout: 300000,
            onUploadProgress,
        });
    }
}
