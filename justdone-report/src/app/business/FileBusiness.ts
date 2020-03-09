import * as request from 'request-promise';
import File from 'justdone-system-package/dest/app/model/file/File';
import Magiclink from 'justdone-system-package/dest/app/model/magiclink/Magiclink'; // eslint - disable - line;
import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate'; // eslint-disable-line
import FileUpdate from 'justdone-system-package/dest/app/model/file/FileUpdate'; // eslint-disable-line
import * as escapere from 'escape-regexp';
import IFileBusiness from './interfaces/IFileBusiness'; // eslint-disable-line
import AccountingPdf from 'justdone-system-package/dest/app/model/accounting/AccountingPdf'; // eslint-disable-line
import AccountingHtml from 'justdone-system-package/dest/app/model/accounting/AccountingHtml'; // eslint-disable-line
import FileRepository from 'justdone-system-package/dest/app/repository/FileRepository';
import MagicLinkRepository from 'justdone-system-package/dest/app/repository/MagicLinkRepository';
import FileHelper from 'justdone-system-package/dest/helpers/FileHelper';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import GoogleStorageHelper from 'justdone-system-package/dest/helpers/GoogleStorageHelper';
import {ErrorSystem, ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import Project from '../../config/Project';
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';
import MailHelper from 'justdone-system-package/dest/helpers/MailHelper';
import BusinessLoader from '../../system/BusinessLoader';
import {RoleCode} from 'justdone-system-package/dest/app/model/common/CommonType';

class FileBusiness implements IFileBusiness {
    private fileRepository: FileRepository;
    private magicLinkRepository: MagicLinkRepository;

    constructor() {
        this.fileRepository = new FileRepository();
        this.magicLinkRepository = new MagicLinkRepository();
    }

    async convertImageToPdf(data: AccountingPdf): Promise<any> {
        try {
            return await request({
                uri: `${Project.SERVER.INTEGRATION.PROTOTYPE}://${Project.SERVER.INTEGRATION.DOMAIN}/api/accounting/convert-pdf`,
                headers: {'Content-Type': 'application/json'},
                method: 'PUT',
                body: data,
                json: true
            });
        }
        catch (error) {
            throw new ErrorSystem('Cannot convert Pdf to Images!');
        }
    }

    async convertHtmlToPdf(data: AccountingHtml): Promise<any> {
        try {
            return await request({
                uri: `${Project.SERVER.INTEGRATION.PROTOTYPE}://${Project.SERVER.INTEGRATION.DOMAIN}/api/accounting/generate-pdf`,
                headers: {'Content-Type': 'application/json'},
                method: 'PUT',
                body: data,
                json: true
            });
        }
        catch (error) {
            throw new ErrorSystem('Cannot convert Html to Pdf!');
        }
    }

    async createMagicLink(userId:string, folderId:string, expiredDate: string, emailTo: string, system: string):Promise<boolean> {
        const expiredAt:any = new Date(expiredDate);
        if (isNaN(expiredAt.getTime()))
            throw new Error('Expired date not match with fomat ISO');

        const folderParent = folderId ? await this.fileRepository.get(folderId) : await this.createOrGetRootFolder(userId);
        if (!folderParent)
            throw new Error('can not find parent folder!');
        const magicLinkModel = await this.magicLinkRepository.create({userId: folderParent.userId, folderId: folderParent._id, productCode: folderParent.productCode, expiredAt: new Date(expiredAt), system, name, emailTo});
        const magicLink = magicLinkModel && new Magiclink(magicLinkModel);
        const product = await BusinessLoader.productBusiness.getByCode(folderParent.productCode);
        if (!product) {
            throw new Error('product is not exist!');
        }
        const user = await BusinessLoader.userBusiness.get(folderParent.userId);
        if (!user) {
            throw new Error('user is not exist!');
        }
        const linkMagic = `${Project.SERVER.CORE.PROTOTYPE}://${product.config.domain}/magic-link/${magicLink._id}`;
        // let fromData = {
        //     email: emailTo,
        //     name: user.fullName
        // };
        let fullName = user.firstName + ' ' + user.lastName;
        let toEmail = emailTo.trim().toLowerCase();
        let toData = {};
        toData[toEmail] = fullName;

        let content = `<p>Hi ${fullName},</p>`
                    + ` My name is: ${user.fullName}, here is the <a href="${linkMagic}"> link </a> can you upload file.<br>`
                    + `Thank you and warm regards,<br/>`
                    + `<p>${user.fullName}</p><br/>`;

        try {
            await MailHelper.sendMailAdvanced(null, toData, 'Cruncher Report', content);
        }
        catch (e) {
            throw new ErrorCommon(101, 'Request');
        }
        return true;
    }

    async getMagicLink(_id:string):Promise<Magiclink | null> {
        const magicLink = await this.magicLinkRepository.get(_id);
        return magicLink && new Magiclink(magicLink);
    }

    async searchFile(userId:string, folderId:string, searchText: string, page: number, limit:number ):Promise<File[]> {
        if (!userId && !folderId)
            throw new ErrorCommon(101, 'Request');
        let query:any = {
            isFolder: false
        };
        if (folderId) {
            query.folderId = folderId;
        }
        else {
            query.userId = userId;
        }
        if (searchText) {
            query.name = {$regex: new RegExp('.*' + escapere(searchText) + '.*', 'i')};
        }
        const params = {
            query: query
        };
        const files = await this.fileRepository.find(params, null, page, limit);
        return File.parseArray(files);
    }

    async totalSearchFile(userId:string, folderId:string, searchText: string):Promise<number> {
        if (!userId && !folderId)
            throw new ErrorCommon(101, 'Request');
        let query:any = {
            isFolder: false
        };
        if (folderId) {
            query.folderId = folderId;
        }
        else {
            query.userId = userId;
        }
        if (searchText) {
            query.name = {$regex: new RegExp('.*' + escapere(searchText) + '.*', 'i')};
        }
        const params = {
            query: query
        };
        return await this.fileRepository.getCount(params);
    }

    async createOrGetRootFolder(userId: string):Promise<File | null> {
        let param = {
            query: <any>{
                userId,
                parentId: null,
                isFolder: true
            }
        };
        const rootFolder = await this.fileRepository.findOne(param);
        console.log(rootFolder);
        return rootFolder ? rootFolder : await this.createRootFolder(userId);
    }

    async getAllObjectInRoot(userId:string, page:number, limit: number): Promise<File[]> {
        const root = await this.createOrGetRootFolder(userId);
        if (!root)
            throw new Error('can not find data');
        return this.getFolderAndFileByParentId(root._id, page, limit);
    }

    async getTotalFileAndFolder(userId:string, folderId:string) :Promise<number> {
        const folderParent = folderId ? await this.fileRepository.get(folderId) : await this.createOrGetRootFolder(userId);
        if (!folderParent)
            throw new Error('can not find parent folder!');
        return await this.fileRepository.getCount({
            query: {
                parentId: folderParent._id
            }
        });
    }

    async createFile(fileCreate:FileCreate, folderId: string, userId?:string) {
        if (!folderId && !userId)
            throw new ErrorCommon(101, 'Request');
        const parentFolder = folderId ? await this.fileRepository.get(folderId) : (userId ? await this.createOrGetRootFolder(userId) : null);
        if (!parentFolder)
            throw new Error('can not find parent folder');
        let localFile = `${Project.UPLOAD.TMP_PATH}/${fileCreate.url}`;
        fileCreate.parentId = parentFolder._id;
        fileCreate.prefix = parentFolder.prefix;
        fileCreate.name = `${fileCreate.name.replace(/\s/g, '_')}.${fileCreate.extension}`;
        fileCreate.productCode = parentFolder.productCode;
        fileCreate.userId = parentFolder.userId;
        let fullPath = `${parentFolder.prefix}${fileCreate.name}`;
        await GoogleStorageHelper.deleteFile(fullPath, Project.GOOGLE_STORAGE.BUCKET_NAME);

        let url = await GoogleStorageHelper.uploadFile(localFile, fileCreate.prefix!, fileCreate.name, Project.GOOGLE_STORAGE.BUCKET_NAME);
        if (!url)
            throw new ErrorCommon(104, 'File Url');

        FileHelper.removeFile(localFile);
        fileCreate.url = url;

        let file = await this.fileRepository.create(fileCreate);
        return file && new File(file);
    }

    async createRootFolder(userId: string): Promise<File> {
        const user = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new Error('can not find user');

        const productId = user.permission ? user.permission.product : null;
        if (!productId)
            throw new Error('can not find product');
        const product = await BusinessLoader.productBusiness.get(productId);
        if (!product)
            throw new Error('can not find product');
        const prefix = `/users/${userId}/`;
        const folder = await this.fileRepository.create({userId, isFolder: true, name: 'root', productCode: product.code, prefix});
        return folder && new File(folder);
    }

    async createFolderInParent(parentId: string | null, name: string, userId?:string): Promise<File> {
        if (!name)
            throw new ErrorCommon(101, 'Request');
        if (!parentId) {
            if (!userId)
                throw new ErrorCommon(101, 'Request');
            else
                return await this.createFolderInRoot(userId, name);
        }
        const params = {
            query: {
                parentId,
                name
            }
        };
        const parentFolder = await this.fileRepository.get(parentId);
        if (!parentFolder)
            throw new Error('Parent Folder is not exist!');
        const folder = await this.fileRepository.findOne(params);
        if (folder)
            throw new Error('Name Folder is exist');
        const newFolder = await this.fileRepository.create(
            {
                userId: parentFolder.userId, isFolder: true,
                name,
                productCode: parentFolder.productCode,
                parentId: parentFolder._id,
                prefix: `${parentFolder.prefix}${name}/`
            }
        );
        return newFolder && new File(newFolder);
    }

    async createFolderInRoot(userId: string, name:string) {
        const root = await this.createOrGetRootFolder(userId);
        if (!root)
            throw new Error('can not find root folder');
        const params = {
            query: {
                parentId: root._id,
                name
            }
        };

        const folder = await this.fileRepository.findOne(params);
        if (folder)
            throw new Error('Name Folder is exist');
        const newFolder = await this.fileRepository.create({
            userId: root.userId,
            isFolder: true,
            name,
            productCode: root.productCode,
            parentId: root._id,
            prefix: `${root.prefix}${name}/`
        });
        return newFolder && new File(newFolder);
    }

    async uploadFileInRoot(userId: string, name:string) {
        const root = await this.createOrGetRootFolder(userId);
        if (!root)
            throw new Error('can not find root folder');
        const params = {
            query: {
                parentId: root._id,
                name
            }
        };

        const folder = await this.fileRepository.findOne(params);
        if (folder)
            throw new Error('Name Folder is exist');
        const newFolder = await this.fileRepository.create({
            userId: root.userId,
            isFolder: true,
            name,
            productCode: root.productCode,
            parentId: root._id,
            prefix: `${root.prefix}/${name}`
        });
        return newFolder && new File(newFolder);
    }

    async getFolderAndFileByParentId(parentId: string, page:number, limit:number): Promise<File[]> {
        const params = {
            query: {
                parentId
            }
        };
        const files = await this.fileRepository.find(params, null, page, limit);
        return File.parseArray(files);
    }

    async deleteFolderOrFile(_id:string): Promise<boolean> {
        return await this.fileRepository.delete(_id);
    }

    async getByName(name: string): Promise<File | null> {
        if (!name)
            return null;

        let param = {
            query: <any>{
                name
            }
        };
        return await this.fileRepository.findOne(param);
    }

    async getByUserId(userId: string, fileType: number): Promise<any> {
        let params = <any>{
            query: {
                userId: DataHelper.toObjectId(userId),
            }
        };
        if (fileType) {
            params.query.type = fileType;
        };
        return await this.fileRepository.find(params);
    }

    async getList(page: number, limit: number): Promise<File[]> {
        let files = await this.fileRepository.find(null, null, page, limit);
        return File.parseArray(files);
    }
    async getAll(): Promise<File[]> {
        let files = await this.fileRepository.findAll();
        return File.parseArray(files);
    }
    async getCount(): Promise<number> {
        return await this.fileRepository.getCount();
    }

    async getByIds(ids: string[]): Promise<File[]> {
        if (!ids || ids.length === 0)
            return [];
        let idArray: any = [];
        for (let i = 0; i < ids.length; i++) {
            idArray.push(DataHelper.toObjectId(ids[i]));
        }
        return await this.findListIds(idArray);
    }

    async get(_id: string): Promise<File | null> {
        if (!_id)
            return null;

        let file = await this.fileRepository.get(_id);
        console.log(file);
        return file && new File(file);
    }

    async create(data: FileCreate, newName?: string): Promise<File> {
        if (!validateFields(data))
            throw new ErrorCommon(101, 'File data');

        let localFile = `${Project.UPLOAD.TMP_PATH}/${data.url}`;

        data.name = `${data.name.replace(/\s/g, '_')}.${data.extension}`;
        if (newName)
            data.name = FileHelper.updateFileNameFromUrl(data.name, newName);

        let fullPath = `${data.prefix}${data.name}`;

        await GoogleStorageHelper.deleteFile(fullPath, Project.GOOGLE_STORAGE.BUCKET_NAME);

        let url = await GoogleStorageHelper.uploadFile(localFile, data.prefix!, data.name, Project.GOOGLE_STORAGE.BUCKET_NAME);
        if (!url)
            throw new ErrorCommon(104, 'File Url');

        FileHelper.removeFile(localFile);
        data.url = url;

        let file = await this.fileRepository.create(data);
        return file && new File(file);
    }

    async update(_id: string, data: FileUpdate): Promise<File | null> {
        await this.fileRepository.update(_id, data);
        return await this.get(_id);
    }

    async delete(_id: string, shouldDeleteStorage: boolean = true): Promise<boolean> {
        if (shouldDeleteStorage) {
            let file = await this.get(_id);

            if (file) {
                let fullPath = `${file.prefix}${file.name}`;
                await GoogleStorageHelper.deleteFile(fullPath, Project.GOOGLE_STORAGE.BUCKET_NAME);
            }
        }
        return await this.fileRepository.delete(_id);
    }

    async deleteMultiple(data: File[]): Promise<boolean> {
        if (data.length === 0)
            return true;

        data.forEach(item => {
            let path = `${Project.UPLOAD.TMP_PATH}${item.userId}/${item.url}`;
            FileHelper.removeFile(path);
            this.delete(item._id);
        });

        return true;
    }

    async deleteAllByUser(originId: string, clientId: string): Promise<boolean> {
        if (!originId)
            return false;

        let manager = await AuthorizationHelper.userService.get(originId);
        let roleSuperAdmin = await BusinessLoader.roleBusiness.getByCode(RoleCode.SuperAdmin);
        if (!manager || !manager.permission || !manager.permission.role || !roleSuperAdmin || manager.permission.role.toString() !== roleSuperAdmin._id)
            return false;

        let results = await this.fileRepository.findAll({query: {userId: DataHelper.toObjectId(clientId)}});
        for (let i = 0; i < results.length; i++) {
            await this.fileRepository.delete(results[i]._id, true);
        }
        return false;
    }

    private async findListIds(ids: string[]):Promise<any[]> {
        let params = <any>{
            query: {
                _id: {$in: ids}
            },
            select: '_id name url extension type updatedAt'
        };
        return await this.fileRepository.find(params);
    }
}

function validateFields(data: any) {
    if (!data)
        return false;

    if (!data.url || !data.name || !data.extension || !data.prefix)
        return false;

    return true;
}

Object.seal(FileBusiness);
export default FileBusiness;
