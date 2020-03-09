import IBaseBusiness from './base/IBaseBusiness';
import File from 'justdone-system-package/dest/app/model/file/File';
import Magiclink from 'justdone-system-package/dest/app/model/magiclink/Magiclink';
import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate'; // eslint-disable-line
import FileUpdate from 'justdone-system-package/dest/app/model/file/FileUpdate'; // eslint-disable-line
import AccountingPdf from 'justdone-system-package/dest/app/model/accounting/AccountingPdf'; // eslint-disable-line
import AccountingHtml from 'justdone-system-package/dest/app/model/accounting/AccountingHtml'; // eslint-disable-line

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
    searchFile(userId:string, folderId:string, searchText: string, page: number, limit:number ):Promise<File[]>;
    totalSearchFile(userId:string, folderId:string, searchText: string):Promise<number>;
    getFolderAndFileByParentId(parentId: string, page:number, limit:number): Promise<File[]>;
    getTotalFileAndFolder(userId:string, folderId:string) :Promise<number>;
    getAllObjectInRoot(userId:string, page:number, limit:number): Promise<File[]>;
    createMagicLink(userId:string, folderId:string, expiredDate: string, emailTo: string, system: string):Promise<boolean>
    createFolderInParent(parentId: string | null, name: string, userId?:string): Promise<File>
    create: (data: FileCreate, newName?: string) => Promise<File>;
    createFile: (fileCreate:any, folderId: string, userId?:string) => Promise<File>;
    update: (_id: string, data: FileUpdate) => Promise<File | null>;
    delete: (_id: string, shouldDeleteStorage?: boolean) => Promise<boolean>;
    deleteMultiple: (data: File[]) => Promise<boolean>;
    deleteAllByUser(originId: string, clientId: string): Promise<boolean>;
}

export default IFileBusiness;
