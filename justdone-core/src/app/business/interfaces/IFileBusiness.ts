import IBaseBusiness from './base/IBaseBusiness';
import File from 'justdone-system-package/dest/app/model/file/File';
import Magiclink from 'justdone-system-package/dest/app/model/magiclink/Magiclink';
import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate'; // eslint-disable-line
import FileUpdate from 'justdone-system-package/dest/app/model/file/FileUpdate'; // eslint-disable-line
import AccountingPdf from 'justdone-system-package/dest/app/model/accounting/AccountingPdf'; // eslint-disable-line
import AccountingHtml from 'justdone-system-package/dest/app/model/accounting/AccountingHtml'; // eslint-disable-line
import { ProductCode } from 'justdone-system-package/dest/app/model/common/CommonType';

interface IFileBusiness extends IBaseBusiness<File> {
    getAll: () => Promise<File[]>;
    getByName: (name: string) => Promise<File | null>;
    convertImageToPdf: (data: AccountingPdf) => Promise<any>;
    convertHtmlToPdf: (data: AccountingHtml) => Promise<any>;
    getByUserId: (userId: string, fileType: any) => Promise<any>;
    getList: (page: number, limit: number) => Promise<File[]>;
    getCount: () => Promise<number>;
    getByIds: (ids: string[]) => Promise<any>;
    getMagicLink(_id:string):Promise<Magiclink | null>;
    getMagicLinkByFolder(folderId: string): Promise<Magiclink[]>;
    searchFile(userId:string, folderId:string, magicLinkId:string, searchText: string, page: number, limit:number ):Promise<File[]>;
    totalSearchFile(userId:string, folderId:string, magicLinkId:string, searchText: string):Promise<number>;
    getFolderAndFileByParentId(parentId: string, page:number, limit:number): Promise<File[]>;
    getFolderAndFileDeletedByParentId(parentId: string, page:number, limit:number): Promise<File[]>;
    getTotalFileAndFolder(userId:string, folderId:string) :Promise<number>;
    getTotalFileAndFolderDeleted(userId:string, folderId:string) :Promise<number>;
    getAllObjectInRoot(userId:string, page:number, limit:number): Promise<File[]>;
    getAllObjectDeletedInRoot(userId:string, page:number, limit:number): Promise<File[]>;
    getMagicLinkByProductCode: (productCode: number) => Promise<Magiclink[]>;
    getFileByProductCode: (productCode: number) => Promise<File[]>;
    createMagicLink(userId:string, folderId:string, expiredDate: string, name: string, emailTo: string, subject: string, content: string, system: string):Promise<boolean>
    createFolderInParent(parentId: string | null, name: string, userId?:string): Promise<File>;
    moveClientAndProductMagicLink(userId: string, productCode: number): Promise<any>;
    moveFileAndFolder(_id: string, newId: string): Promise<any>;
    updateNameFolder: (_id: string, name: string, isFolder: boolean) => Promise<any>;
    updateNameFile: (_id: string, name: string, isFolder: boolean) => Promise<any>;
    create: (data: FileCreate, newName?: string) => Promise<File>;
    createFile: (fileCreate:any, folderId: string, userId?:string, magicLinkId?:string) => Promise<File>;
    update: (_id: string, data: FileUpdate) => Promise<File | null>;
    moveProduction(userId: string, productCode: number): Promise<boolean>;
    unDeleteFile(_id:string): Promise<boolean>;
    delete: (_id: string, shouldDeleteStorage?: boolean) => Promise<boolean>;
    deleteMultiple: (data: File[]) => Promise<boolean>;
    deleteAllByUser(originId: string, clientId: string): Promise<boolean>;
    deleteMagicLinks(data: Magiclink[]): Promise<boolean>;
}

export default IFileBusiness;
