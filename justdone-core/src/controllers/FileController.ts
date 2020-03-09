import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import Authenticator from 'justdone-system-package/dest/system/Authenticator'; // eslint-disable-line
import IFileBusiness from '../app/business/interfaces/IFileBusiness';
import FileUpdate from 'justdone-system-package/dest/app/model/file/FileUpdate';
import FileHelper from 'justdone-system-package/dest/helpers/FileHelper';
import UploadHelper from 'justdone-system-package/dest/helpers/UploadHelper';
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import File from 'justdone-system-package/dest/app/model/file/File';// eslint-disable-line
const uploadDriverOpt = {
    mimetype: ['image/jpg', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'],
    single: 'fileobject'
};
class FileController extends BaseController {
    private fileBusiness: IFileBusiness = BusinessLoader.fileBusiness;

    constructor() {
        super();

        this.get('/list-by-user-id/:userId', this.getFilesByUserId.bind(this));
        this.get('/list', this.validatePagination(), this.getFiles.bind(this));
        this.get('/list/count', this.getCountFiles.bind(this));
        this.get('/:_id', this.getFileById.bind(this));
        this.get('/folder', this.getFileAndFolder.bind(this));
        this.get('/total-folder', this.getTotalFileAndFolder.bind(this));
        this.get('/folder-deleted', this.getFileAndFolderDeleted.bind(this));
        this.get('/total-deleted', this.getTotalFileAndFolderDeleted.bind(this));
        this.get('/magic-link/:_id', this.getMagicLink.bind(this));
        this.get('/search/:userId', this.searchFile.bind(this));
        this.get('/total-search/:userId', this.totalSearchFile.bind(this));
        this.get('/get-magic-link-by-folder/:folderId', this.getMagicLinkByFolder.bind(this));

        this.post('/root', this.createFolderInRoot.bind(this));
        this.post('/magic-link', this.createMagicLink.bind(this));
        this.post('/folder', this.createFolderInParent.bind(this));
        this.post('/upload', UploadHelper.upload(uploadDriverOpt), this.uploadFileToFolder.bind(this));
        this.put('/update-name-folder/:_id', this.updateNameFolder.bind(this));
        this.put('/update-name-file/:_id', this.updateNameFile.bind(this));
        this.put('/undelete/:_id', this.unDeleteFile.bind(this));
        this.put('/move-file/:_id/:newId', this.moveFileAndFolder.bind(this));
        this.delete('/:_id', this.deleteFile.bind(this));
        this.delete('/delete-multi', this.deleteFiles.bind(this));
    }

    async getFilesByUserId(req): Promise<any> {
        if (!req.params.userId) {
            return;
        }
        return await this.fileBusiness.getByUserId(req.params.userId, req.query.type);
    }

    async moveFileAndFolder(req): Promise<any> {
        return await this.fileBusiness.moveFileAndFolder(req.params._id, req.params.newId);
    }

    async getMagicLinkByFolder(req): Promise<any> {
        return await this.fileBusiness.getMagicLinkByFolder(req.params.folderId);
    }

    async searchFile(req): Promise<any> {
        return await this.fileBusiness.searchFile(req.params.userId, req.query.folderId, req.query.magicLinkId, req.query.search, Number(req.query.page), Number(req.query.limit));
    }

    async totalSearchFile(req): Promise<any> {
        return await this.fileBusiness.totalSearchFile(req.params.userId, req.query.folderId, req.query.magicLinkId, req.query.search);
    }

    async uploadFileToFolder(req): Promise<any> {
        if (!req.query.folderId && !req.query.userId) {
            return;
        }

        const fileCreate = {
            name: req.file.originalNameWithoutExtension,
            size: req.file.size,
            type: FileHelper.getFileTypeByExtension(req.file.extension),
            extension: req.file.extension,
            url: req.file.filename
        };

        return await this.fileBusiness.createFile(fileCreate, req.query.folderId, req.query.userId, req.body.magicLinkId);
    }

    async getFileAndFolder(req): Promise<File[]> {
        if (!req.query.folderId && !req.query.userId) {
            throw new ErrorCommon(101, 'Request');
        }
        if (req.query.folderId)
            return await this.fileBusiness.getFolderAndFileByParentId(req.query.folderId, Number(req.query.page), Number(req.query.limit));
        return this.fileBusiness.getAllObjectInRoot(req.query.userId, Number(req.query.page), Number(req.query.limit));
    }

    async getFileAndFolderDeleted(req): Promise<File[]> {
        if (!req.query.folderId && !req.query.userId) {
            throw new ErrorCommon(101, 'Request');
        }
        if (req.query.folderId)
            return await this.fileBusiness.getFolderAndFileDeletedByParentId(req.query.folderId, Number(req.query.page), Number(req.query.limit));
        return this.fileBusiness.getAllObjectDeletedInRoot(req.query.userId, Number(req.query.page), Number(req.query.limit));
    }

    async getMagicLink(req): Promise<any> {
        if (!req.params._id) {
            throw new ErrorCommon(101, 'Request');
        }

        return this.fileBusiness.getMagicLink(req.params._id);
    }

    async getTotalFileAndFolder(req): Promise<number> {
        if (!req.query.folderId && !req.query.userId) {
            throw new ErrorCommon(101, 'Request');
        }

        return this.fileBusiness.getTotalFileAndFolder(req.query.userId, req.query.folderId);
    }

    async getTotalFileAndFolderDeleted(req): Promise<number> {
        if (!req.query.folderId && !req.query.userId) {
            throw new ErrorCommon(101, 'Request');
        }

        return this.fileBusiness.getTotalFileAndFolderDeleted(req.query.userId, req.query.folderId);
    }

    async getFiles(req): Promise<any> {
        return await this.fileBusiness.getList(Number(req.query.page), Number(req.query.limit));
    }

    async getCountFiles(req): Promise<any> {
        return await this.fileBusiness.getCount();
    }

    async getFileById(req): Promise<any> {
        return await this.fileBusiness.get(req.params._id);
    }

    async createFolderInRoot(req): Promise<any> {
        return await this.fileBusiness.createFolderInParent(null, req.body.nameFolder, req.body.userId);
    }

    async createMagicLink(req): Promise<any> {
        return await this.fileBusiness.createMagicLink(req.body.userId, req.body.folderId, req.body.expiredDate, req.body.name, req.body.emailTo, req.body.subject, req.body.content, req.body.system);
    }

    async createFolderInParent(req): Promise<any> {
        return await this.fileBusiness.createFolderInParent(req.body.parentId, req.body.nameFolder);
    }

    async updateFile(req): Promise<any> {
        return await this.fileBusiness.update(req.params._id, new FileUpdate(req.body));
    }

    async updateNameFolder(req): Promise<any> {
        return await this.fileBusiness.updateNameFolder(req.params._id, req.body.name, req.body.isFolder);
    }

    async updateNameFile(req): Promise<any> {
        return await this.fileBusiness.updateNameFile(req.params._id, req.body.name, req.body.isFolder);
    }

    async unDeleteFile(req): Promise<any> {
        return await this.fileBusiness.unDeleteFile(req.params._id);
    }

    async deleteFile(req): Promise<any> {
        return await this.fileBusiness.delete(req.params._id);
    }

    async deleteFiles(req): Promise<any> {
        return await this.fileBusiness.deleteMultiple(req.body.data);
    }
}

Object.seal(FileController);
export default FileController;
