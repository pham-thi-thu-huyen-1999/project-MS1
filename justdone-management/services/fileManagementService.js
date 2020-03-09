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

    getFileByName(userId, folderId, keyword, magicLinkId = '', page, limit) {
        return this.axios.get(`/api/file/search/${userId}?folderId=${folderId}&search=${keyword}&magicLinkId=${magicLinkId}&page=${page}&limit=${limit}`);
    }

    getCountFileByName(userId, folderId, keyword, magicLinkId = '') {
        return this.axios.get(`/api/file/total-search/${userId}?folderId=${folderId}&search=${keyword}&magicLinkId=${magicLinkId}`);
    }

    getFileAndFolderDeleted(userId, folderId, page, limit) {
        return this.axios.get(`/api/file/folder-deleted?userId=${userId}&folderId=${folderId}&page=${page}&limit=${limit}`);
    }

    getTotalFileAndFolderDeleted(userId, folderId) {
        return this.axios.get(`/api/file/total-deleted?userId=${userId}&folderId=${folderId}`);
    }

    restoreFileAndFolder(id) {
        return this.axios.put(`/api/file/undelete/${id}`);
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
        return this.axios.post(`/api/file/upload?userId=${userId}&folderId=${folderId}`, data, {
            timeout: 300000,
            onUploadProgress,
        });
    }

    rename(fileOrFolderId, isFolder, newName) {
        if (isFolder) {
            return this.renameFolder(fileOrFolderId, newName);
        }
        return this.renameFile(fileOrFolderId, newName);
    }

    renameFile(fileId, newName) {
        return this.axios.put(`/api/file/update-name-file/${fileId}`, {
            name: newName,
            isFolder: false
        });
    }

    renameFolder(folderId, newName) {
        return this.axios.put(`/api/file/update-name-folder/${folderId}`, {
            name: newName,
            isFolder: true
        });
    }

    listMagicLinks(folderId) {
        return this.axios.get(`/api/file/get-magic-link-by-folder/${folderId}`);
    }
}
