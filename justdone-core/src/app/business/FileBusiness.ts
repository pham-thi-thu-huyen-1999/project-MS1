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
import moment = require('moment');

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

    async createMagicLink(userId:string, folderId:string, expiredDate: string, name: string, emailTo: string, subject: string, content: string, system: string):Promise<boolean> {
        const expiredAt:any = new Date(expiredDate);
        if (isNaN(expiredAt.getTime()))
            throw new Error('Expired date not match with fomat ISO');

        const folderParent = folderId ? await this.fileRepository.get(folderId) : await this.createOrGetRootFolder(userId);
        if (!folderParent)
            throw new ErrorCommon(102, 'Parent Folder');
        const magicLinkModel = await this.magicLinkRepository.create({userId: folderParent.userId, folderId: folderParent._id, productCode: folderParent.productCode, expiredAt: new Date(expiredAt), system, name, emailTo});
        const magicLink = magicLinkModel && new Magiclink(magicLinkModel);;
        const product = await BusinessLoader.productBusiness.getByCode(folderParent.productCode);
        if (!product) {
            throw new Error('product is not exist!');
        }
        const user = await BusinessLoader.userBusiness.get(folderParent.userId);
        if (!user) {
            throw new Error('user is not exist!');
        }

        const linkMagic = `${Project.SERVER.CORE.PROTOTYPE}://${product.config.domain}/magic-link/${magicLink._id}`;

        let nameProduct = '';
        if (magicLink.system === 'MPP')
            nameProduct = 'MY PAPERWORK PEOPLE'
        else if (magicLink.system === 'YBA')
            nameProduct = 'YOUR BUSINESS ANGELS'
        else
            nameProduct = 'FAST RABBIT'

        let toEmail = emailTo.trim().toLowerCase();
        let toData = {};
        toData[toEmail] = name || toEmail;

        let contentMail = `
            <div style="width:100%; height: 100%; background-color: #f9f9f9;min-height:900px; padding: 70px 0">
                <div style="padding: 30px;background-color: #ffffff;margin:0px auto;width: 495px;">
                    <h1 style="color: #1c5df4;font-size: 25px;font-weight: 700;line-height: 28px;">Request upload file management system.</h1>
                    <h2 style="color: #4a4a4a;font-size: 20px;font-weight: 700;margin-top: 25px;margin-bottom: 0px">Hi ${name},</h2>
                    <p style="color: #ababab;font-size: 15px;line-height: 26px;margin-bottom: 20px;max-width:480px;margin-top: 10px">${content}</p>
                    <div style="background-color: #3470fb;width: 464px;border-radius: 5px; padding: 15px; text-align: center;">
                        <p style="color: #ffffff;font-size: 15px;font-weight: 500;">Click to the button to upload your files</p>
                        <a style="margin:10px;display: inline-block;text-decoration: none;padding: 12px; min-width: 225px; background-color: #ffffff;border-radius: 23px;box-shadow: 0 1px 8px rgba(0, 0, 0, 0.09);" href="${linkMagic}">Click here</a>
                        <p style="font-size: 15px;color: rgba(255, 255, 255, 0.52);"> The links will be expired in <span style="color: #00cfad;">${moment(String(expiredAt)).format('HH:mm DD/MM/YYYY')}</span></p>
                    </div>
                    <p style="margin-top: 25px; color: #000000;opacity: 0.47;font-size: 11px;text-align: center">© ${(new Date()).getFullYear()} ${nameProduct}. All Rights Reserved.</p>
                </div>
            </div>
                    `;

        try {
            let fromData = {
                email: "",
                name: ""
            };
            if (magicLink.system === 'MPP') {
                fromData.email = 'shaz@ihatepaperwork.com.au';
                fromData.name = 'MPP ADMIN'
            }
            else if (magicLink.system === 'YBA') {
                fromData.email = 'angel1@yourbusinessangels.com.au';
                fromData.name = 'YBA ADMIN'
            }
            else {
                fromData.email = 'matthew@fastrabbit.com.au';
                fromData.name = 'FR ADMIN'
            }

            await MailHelper.sendMailAdvanced(fromData, toData, subject, contentMail);
        }
        catch (e) {
            throw new ErrorCommon(101, 'Request');
        }
        return true;
    }

    async getMagicLink(_id:string):Promise<Magiclink | null> {
        const magicLink = await this.magicLinkRepository.get(_id);

        if (!magicLink)
            throw new ErrorCommon(102, 'Magic Link');
        // if (new Date() > new Date(magicLink.expiredAt))
        //     throw new ErrorCommon(104, 'Expired Time');
        const folderParent = await this.fileRepository.findOne({query: {_id: magicLink.folderId}});
        if (!folderParent)
            throw new ErrorCommon(102, 'Folder Parent');
        return magicLink && new Magiclink(magicLink);
    }

    async getMagicLinkByFolder(folderId: string): Promise<Magiclink[]> {
        let magicLinks = await this.magicLinkRepository.findAll({query: {$or: [{folderId}, {userId: folderId}]}})
        return Magiclink.parseArray(magicLinks);
    }

    async getMagicLinkByProductCode(productCode: number): Promise<Magiclink[]> {
        let magicLinks = await this.magicLinkRepository.findAll({query: {productCode: productCode}});
        return Magiclink.parseArray(magicLinks);
    }

    async getFileByProductCode(productCode: number): Promise<File[]> {
        let files = await this.fileRepository.findAll({query: {productCode: productCode}});
        return File.parseArray(files);
    }

    async searchFile(userId:string, folderId:string, magicLinkId:string, searchText: string, page: number, limit:number ):Promise<File[]> {
        if (!userId && !folderId)
            throw new ErrorCommon(101, 'Request');
        let query:any = {
            isFolder: false
        };
        if (folderId) {
            query.folderId = folderId;
        }
        if (userId) {
            query.userId = userId;
        }
        if (searchText) {
            query.name = {$regex: new RegExp('.*' + escapere(searchText) + '.*', 'i')};
        }
        if (magicLinkId) {
            query.magicLinkId = magicLinkId;
        }

        const params = {
            query: query
        };

        const files = await this.fileRepository.find(params, null, page, limit);
        return File.parseArray(files);
    }

    async totalSearchFile(userId:string, folderId:string, magicLinkId:string, searchText: string):Promise<number> {
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
        if (magicLinkId) {
            query.magicLinkId = magicLinkId;
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
        return rootFolder ? rootFolder : await this.createRootFolder(userId);
    }

    async getAllObjectInRoot(userId:string, page:number, limit: number): Promise<File[]> {
        const root = await this.createOrGetRootFolder(userId);
        if (!root)
            throw new Error('can not find data');
        return this.getFolderAndFileByParentId(root._id, page, limit);
    }

    async getAllObjectDeletedInRoot(userId:string, page:number, limit:number): Promise<File[]> {
        // const root = await this.createOrGetRootFolder(userId);
        // if (!root)
        //     return [];
        // return this.getFolderAndFileDeletedByUserId(root._id, page, limit);
        return this.getFolderAndFileDeletedByUserId(userId, page, limit);
    }

    async getTotalFileAndFolder(userId:string, folderId:string) :Promise<number> {
        const folderParent = folderId ? await this.fileRepository.get(folderId) : await this.createOrGetRootFolder(userId);
        if (!folderParent)
            throw new ErrorCommon(102, 'Parent Folder');
        return await this.fileRepository.getCount({
            query: {
                parentId: folderParent._id
            }
        });
    }

    async getTotalFileAndFolderDeleted(userId:string, folderId:string) :Promise<number> {
        // const folderParent = folderId ? await this.fileRepository.get(folderId) : await this.createOrGetRootFolder(userId);
        const folderParent = folderId ? await this.fileRepository.get(folderId) : null;
        // if (!folderParent)
        //     throw new ErrorCommon(102, 'Parent Folder');
        if (folderParent) {
            return await this.fileRepository.getCount({
                query: {
                    parentId: folderParent._id,
                    deletedAt: {
                        $ne: null
                    }
                }
            });
        }
        else {
            return await this.fileRepository.getCount({
                query: {
                    userId,
                    deletedAt: {
                        $ne: null
                    }
                }
            });
        }
    }

    async createFile(fileCreate:FileCreate, folderId: string, userId?:string, magicLinkId?:string) {
        if (!folderId && !userId)
            throw new ErrorCommon(101, 'Request');
        const parentFolder = folderId ? await this.fileRepository.get(folderId) : (userId ? await this.createOrGetRootFolder(userId) : null);
        if (!parentFolder)
            throw new ErrorCommon(102, 'Parent Folder');
        
        let nameRegexUpload = `${fileCreate.name.replace(/[^A-Z0-9]/ig, "")}.${fileCreate.extension}`;

        let localFile = `${Project.UPLOAD.TMP_PATH}/${fileCreate.url}`;
        fileCreate.parentId = parentFolder._id;
        fileCreate.prefix = parentFolder.prefix;
        fileCreate.name = `${fileCreate.name.replace(/\s/g, "_")}.${fileCreate.extension}`;
        fileCreate.productCode = parentFolder.productCode;
        fileCreate.userId = parentFolder.userId;
        let fullPath = `${parentFolder.prefix}${fileCreate.name}`;
        const fileOld = await this.fileRepository.findOne({query: {name: nameRegexUpload, parentId: parentFolder._id, prefix: fileCreate.prefix, userId: fileCreate.userId, productCode: fileCreate.productCode}});
        if (fileOld) {
            FileHelper.removeFile(localFile);
            throw new ErrorCommon(104, 'File Name');
        }
        await GoogleStorageHelper.deleteFile(fullPath, Project.GOOGLE_STORAGE.BUCKET_NAME);

        let url = await GoogleStorageHelper.uploadFile(localFile, fileCreate.prefix!, nameRegexUpload, Project.GOOGLE_STORAGE.BUCKET_NAME);
        if (!url)
            throw new ErrorCommon(104, 'File Url');

        FileHelper.removeFile(localFile);
        fileCreate.url = url;
        fileCreate.magicLinkId = magicLinkId;
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
        
        let namePrefix = name.replace(/[^A-Z0-9]/ig, "");

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
            throw new ErrorCommon(102, 'Parent Folder');
        const folder = await this.fileRepository.findOne(params);
        if (folder)
            throw new ErrorCommon(104, 'Name Folder');
        const newFolder = await this.fileRepository.create(
            {
                userId: parentFolder.userId, isFolder: true,
                name,
                productCode: parentFolder.productCode,
                parentId: parentFolder._id,
                prefix: `${parentFolder.prefix}${namePrefix}/`
            }
        );
        return newFolder && new File(newFolder);
    }

    async createFolderInRoot(userId: string, name:string) {
        const root = await this.createOrGetRootFolder(userId);
        if (!root)
            throw new ErrorCommon(102, 'Root Folder');
        let namePrefix = name.replace(/[^A-Z0-9]/ig, "");
        const params = {
            query: {
                parentId: root._id,
                name
            }
        };

        const folder = await this.fileRepository.findOne(params);
        if (folder)
            throw new ErrorCommon(104, 'Name Folder');
        const newFolder = await this.fileRepository.create({
            userId: root.userId,
            isFolder: true,
            name,
            productCode: root.productCode,
            parentId: root._id,
            prefix: `${root.prefix}${namePrefix}/`
        });
        return newFolder && new File(newFolder);
    }

    async uploadFileInRoot(userId: string, name:string) {
        const root = await this.createOrGetRootFolder(userId);
        if (!root)
            throw new ErrorCommon(102, 'Root Folder');
        let namePrefix = name.replace(/[^A-Z0-9]/ig, "");
        const params = {
            query: {
                parentId: root._id,
                name
            }
        };

        const folder = await this.fileRepository.findOne(params);
        if (folder)
            throw new ErrorCommon(104, 'Name Folder');
        const newFolder = await this.fileRepository.create({
            userId: root.userId,
            isFolder: true,
            name,
            productCode: root.productCode,
            parentId: root._id,
            prefix: `${root.prefix}/${namePrefix}`
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

    async getFolderAndFileDeletedByUserId(userId: string, page:number, limit:number): Promise<File[]> {
        const params = {
            query: {
                userId,
                deletedAt: {
                    $ne: null
                }
            }
        };
        const files = await this.fileRepository.find(params, null, page, limit);
        return File.parseArray(files);
    }

    async getFolderAndFileDeletedByParentId(parentId: string, page:number, limit:number): Promise<File[]> {
        const params = {
            query: {
                parentId,
                deletedAt: {
                    $ne: null
                }
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

    async updateNameFolder(_id: string, name: string, isFolder: boolean): Promise<any> {
        if (!_id)
            throw new ErrorCommon(101, 'ID');

        if (!isFolder)
            throw new ErrorCommon(101, 'Folder');
        
        let dateUpdate = {
            name: name
        }

        let folderUpdate = await this.update(_id, dateUpdate)

        if (!folderUpdate)
            throw new ErrorCommon(104, 'folder update');

        return folderUpdate;
    }

    async updateNameFile(_id: string, name: string, isFolder: boolean): Promise<any> {
        if (!_id)
            throw new ErrorCommon(101, 'ID');

        if (isFolder !== false)
            throw new ErrorCommon(101, 'Folder');
        
        let dataUpdate = {
            name: name
        }

        let fileUpdate = await this.update(_id, dataUpdate)

        if (!fileUpdate)
            throw new ErrorCommon(104, 'file update');

        return fileUpdate;
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

    async unDeleteFile(_id:string): Promise<boolean> {
        return await this.fileRepository.update(_id, {deletedAt: null});
    }

    async moveProduction(userId: string, productCode: number): Promise<boolean> {
        const updateFie = await this.fileRepository.findAndUpdateAll({userId}, {productCode});
        const updateMagicLink = await this.magicLinkRepository.findAndUpdateAll({userId}, {productCode});
        return true;
    }

    async moveFileAndFolder(_id: string, newId: string): Promise<any> {
        if (!_id)
            throw new ErrorCommon(105, '_id');
        // if have parentId should change
        let currentFileOrFolder = await this.get(_id);

        if (!currentFileOrFolder)
            throw new ErrorCommon(112, 'Folder or File');
        
        let newFileOrFolder = await this.get(newId);

        if (!newFileOrFolder)
            throw new ErrorCommon(112, 'Folder');

        currentFileOrFolder.parentId = newFileOrFolder._id;

        let result = await this.update(currentFileOrFolder._id, currentFileOrFolder);
        
        if (!result)
            throw new ErrorCommon(113, "Move file");

        return true;
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

    async moveClientAndProductMagicLink(userId: string, productCode: number): Promise<any> {
        if (!userId || !productCode)
            throw new ErrorCommon(105, "UserId And ProductCode");
        const params = {
            query: {
                userId: DataHelper.toObjectId(userId)
            }
        };
        let magicLinks = await this.magicLinkRepository.findAll(params);
        if (magicLinks && magicLinks.length) {
            for (let i = 0; i < magicLinks.length; i++) {
                let dataUpdate = {
                    productCode: productCode
                }
                await this.magicLinkRepository.updateDataByFields(magicLinks[i]._id, dataUpdate);
            }
        };

        let results = await this.magicLinkRepository.findAll(params);
        return results;
    }

    async deleteMagicLinks(data: Magiclink[]): Promise<boolean> {
        if (!data) {
            return false;
        }
        for (let i = 0; i < data.length; i++) {
            await this.magicLinkRepository.delete(data[i]._id, true);
        }
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
