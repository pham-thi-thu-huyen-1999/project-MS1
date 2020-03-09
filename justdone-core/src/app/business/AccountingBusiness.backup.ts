// import BusinessLoader from '../../system/BusinessLoader';
// import IAccountingBusiness from './interfaces/IAccountingBusiness'; // eslint-disable-line
// import AccountingRepository from 'justdone-system-package/dest/app/repository/AccountingRepository';
// import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
// import GoogleStorageHelper from 'justdone-system-package/dest/helpers/GoogleStorageHelper';
// import {ErrorCommon, ErrorSystem} from 'justdone-system-package/dest/app/model/common/Error';
// import Accounting from 'justdone-system-package/dest/app/model/accounting/Accounting';
// import AccountingCreate from 'justdone-system-package/dest/app/model/accounting/AccountingCreate'; // eslint-disable-line
// import AccountingUpdate from 'justdone-system-package/dest/app/model/accounting/AccountingUpdate'; // eslint-disable-line
// import AccountingHtml from 'justdone-system-package/dest/app/model/accounting/AccountingHtml'; // eslint-disable-line
// import MonthlyAccountItem from 'justdone-system-package/dest/app/model/accounting/MonthlyAccountItem'; // eslint-disable-line
// import AccountingItem from 'justdone-system-package/dest/app/model/accounting/AccountingItem'; // eslint-disable-line
// import BasQuarterAccountItem from 'justdone-system-package/dest/app/model/accounting/BasQuarterAccountItem'; // eslint-disable-line
// import File from 'justdone-system-package/dest/app/model/file/File'; // eslint-disable-line
// import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate'; // eslint-disable-line
// import Project from '../../config/Project';

// class AccountingBusiness implements IAccountingBusiness {
//     private accountingRepository: AccountingRepository;

//     constructor() {
//         this.accountingRepository = new AccountingRepository();
//     }

//     async getAccountingByUser(userId: string, beginYear: number, endYear: number): Promise<any | null> {
//         let accounting = await this.accountingRepository.findOne({
//             query: {
//                 userId: DataHelper.toObjectId(userId),
//                 beginYear: beginYear,
//                 endYear: endYear
//             }
//         });
//         let originIds: any[] = [];
//         let destinyIds: any[] = [];

//         if (!accounting)
//             return null;

//         let objectKey = Object.keys(new Accounting(accounting));

//         for (let i = 0; i < accounting['monthlyAccounts'].length; i++) {
//             if (accounting['monthlyAccounts'][i].originFileId)
//                 originIds.push(accounting['monthlyAccounts'][i].originFileId);
//         }

//         for (let i = 0; i < objectKey.length; i++) {
//             if (objectKey[i] !== 'monthlyAccounts' && accounting[objectKey[i]].originFileId)
//                 originIds.push(accounting[objectKey[i]].originFileId);
//         }

//         for (let i = 0; i < accounting['monthlyAccounts'].length; i++) {
//             if (accounting['monthlyAccounts'][i].destinyFileId)
//                 destinyIds.push(accounting['monthlyAccounts'][i].destinyFileId);
//         }

//         for (let i = 0; i < objectKey.length; i++) {
//             if (objectKey[i] !== 'monthlyAccounts' && accounting[objectKey[i]].destinyFileId)
//                 destinyIds.push(accounting[objectKey[i]].destinyFileId);
//         }

//         if (originIds.length > 0) {
//             let originFiles = await BusinessLoader.fileBusiness.getByIds(originIds);

//             for (let i = 0; i < accounting.monthlyAccounts.length; i++) {
//                 originFiles.forEach(element => {
//                     if (element._id && accounting && accounting.monthlyAccounts[i].originFileId)
//                         if (element._id.toString() === accounting.monthlyAccounts[i].originFileId.toString()) {
//                             accounting.monthlyAccounts[i].originFileId = element;
//                         }
//                 });
//             }
//             for (let i = 0; i < objectKey.length; i++) {
//                 originFiles.forEach(element => {
//                     if (element._id && accounting && accounting[objectKey[i]].originFileId)
//                         if (element._id.toString() === accounting[objectKey[i]].originFileId.toString()) {
//                             accounting[objectKey[i]].originFileId = element;
//                         }
//                 });
//             }
//         }

//         if (destinyIds.length > 0) {
//             let destinyFiles = await BusinessLoader.fileBusiness.getByIds(destinyIds);

//             for (let i = 0; i < objectKey.length; i++) {
//                 destinyFiles.forEach(element => {
//                     if (element._id && accounting && accounting[objectKey[i]].destinyFileId)
//                         if (element._id.toString() === accounting[objectKey[i]].destinyFileId.toString()) {
//                             accounting[objectKey[i]].destinyFileId = element;
//                         }
//                 });
//             }
//             for (let i = 0; i < accounting.monthlyAccounts.length; i++) {
//                 destinyFiles.forEach(element => {
//                     if (element._id && accounting && accounting.monthlyAccounts[i].destinyFileId)
//                         if (element._id.toString() === accounting.monthlyAccounts[i].destinyFileId.toString()) {
//                             accounting.monthlyAccounts[i].destinyFileId = element;
//                         }
//                 });
//             }
//         }
//         return accounting;
//     }

//     async getList(page: number, limit: number): Promise<Accounting[]> {
//         let accountings = await this.accountingRepository.find(null, null, page, limit);
//         return Accounting.parseArray(accountings);
//     }

//     async getAll(): Promise<Accounting[]> {
//         let account = await this.accountingRepository.findAll();
//         return Accounting.parseArray(account);
//     }

//     async getCount(): Promise<number> {
//         return await this.accountingRepository.getCount();
//     }

//     async get(_id: string): Promise<Accounting | null> {
//         if (!_id)
//             return null;

//         let accounting = await this.accountingRepository.get(_id);
//         return accounting && new Accounting(accounting);
//     }

//     async getByUserId(userId: string): Promise<Accounting[]> {
//         if (!userId)
//             return [];

//         let accountings = await this.accountingRepository.find({userId: DataHelper.toObjectId(userId)});
//         return accountings && Accounting.parseArray(accountings);
//     }

//     async create(data: AccountingCreate): Promise<Accounting> {
//         let accounting;
//         if (data.userId && data.beginYear && data.endYear)
//             accounting = await this.accountingRepository.create(data);

//         return accounting && new Accounting(accounting);
//     }

//     async update(_id: string, data: AccountingUpdate): Promise<Accounting | null> {
//         await this.accountingRepository.update(_id, data);
//         return await this.get(_id);
//     }

//     async delete(_id: string): Promise<boolean> {
//         return await this.accountingRepository.delete(_id);
//     }

//     async updateByFinanceYear(userId: string, beginYear: number, endYear: number, data: AccountingUpdate): Promise<Accounting | null> {
//         if (!userId || !beginYear || !endYear)
//             throw new ErrorCommon(101, 'Request');

//         let params = {
//             userId: DataHelper.toObjectId(userId),
//             beginYear: beginYear,
//             endYear: endYear
//         };

//         let accounting = await this.accountingRepository.findOne(params);
//         if (!accounting)
//             throw new ErrorCommon(102, 'Data');

//         let updateAccounting = await this.accountingRepository.update(accounting._id, data);
//         if (!updateAccounting)
//             throw new ErrorCommon(103, 'Data');

//         return await this.get(accounting._id);
//     }

//     async uploadAccounting(_id: string, type: string, productCode: number, data: FileCreate): Promise<any | null> {
//         let user = await BusinessLoader.userBusiness.get(data.userId);
//         if (!user) {
//             throw new ErrorSystem('user not exits');
//         }
//         let prefix = GoogleStorageHelper.getAccountingPrefix(data.userId, productCode, new Date().getFullYear().toString());
//         data.prefix = prefix;

//         let file = await BusinessLoader.fileBusiness.create(data);
//         if (file) {
//             await this.accountingRepository.updateDataByFields(_id, {originFileId: DataHelper.toObjectId(file._id)}, type);
//             // result = await this.accountingRepository.updateFields(_id, type, {originFileId: DataHelper.toObjectId(file._id)});
//         }
//         let accounting = await this.accountingRepository.findOne({query: {_id: DataHelper.toObjectId(_id)}});

//         // Call API to convert file into images
//         if (accounting) {
//             let accoungtingPdfData = {
//                 userId: accounting.userId,
//                 productCode: productCode,
//                 accountingType: type,
//                 beginYear: accounting.beginYear,
//                 endYear: accounting.endYear,
//                 month: null,
//                 originFilePath: `${Project.GOOGLE_STORAGE.BASE_URL}${file.url}`,
//             };
//             BusinessLoader.fileBusiness.convertImageToPdf(accoungtingPdfData);
//         }

//         let fileData = {
//             _id: file._id,
//             name: file.name,
//             url: file.url,
//             extension: file.extension,
//             type: file.type
//         };

//         return fileData;
//     }

//     async uploadMonthlyAccounting(_id: string, month: number, productCode : number, data: FileCreate): Promise<any | null> {
//         let user = await BusinessLoader.userBusiness.get(data.userId);
//         if (!user) {
//             throw new ErrorSystem('user not exits');
//         }
//         let prefix = GoogleStorageHelper.getAccountingPrefix(data.userId, productCode, new Date().getFullYear().toString());
//         data.prefix = prefix;

//         let file = await BusinessLoader.fileBusiness.create(data);
//         if (file) {
//             let fileId = DataHelper.toObjectId(file._id);
//             await this.updateMonthlyUpload(_id, month, fileId);
//         }

//         let accounting = await this.accountingRepository.findOne({query: {_id: DataHelper.toObjectId(_id)}});

//         // Call API to convert file into images
//         if (accounting) {
//             let accoungtingPdfData = {
//                 userId: accounting.userId,
//                 productCode: productCode,
//                 accountingType: 'monthlyAccounts',
//                 beginYear: accounting.beginYear,
//                 endYear: accounting.endYear,
//                 month: month,
//                 originFilePath: `${Project.GOOGLE_STORAGE.BASE_URL}${file.url}`,
//             };
//             BusinessLoader.fileBusiness.convertImageToPdf(accoungtingPdfData);
//         }

//         let fileData = {
//             _id: file._id,
//             name: file.name,
//             url: file.url,
//             extension: file.extension,
//             type: file.type
//         };

//         return fileData;
//     }

//     async uploadSignature(_id: string, type: string, productCode: number, data: FileCreate, month?: number): Promise<string | null> {
//         let user = await BusinessLoader.userBusiness.get(data.userId);
//         if (!user) {
//             throw new ErrorSystem('user not exits');
//         }
//         let localFile = `${Project.UPLOAD.TMP_PATH}/${data.url}`;
//         let prefix = GoogleStorageHelper.getAccountingPrefix(data.userId, productCode, new Date().getFullYear().toString());

//         let fileName = data.url.replace('accounting_', 'accounting_signature_image_');
//         await GoogleStorageHelper.uploadFile(localFile, prefix, fileName, Project.GOOGLE_STORAGE.BUCKET_NAME);

//         let fullPath = `${Project.GOOGLE_STORAGE.BASE_URL}/${Project.GOOGLE_STORAGE.BUCKET_NAME}${prefix}${fileName}`;
//         let accounting = await this.accountingRepository.findOne({query: {_id: DataHelper.toObjectId(_id)}});

//         if (!accounting)
//             throw new ErrorSystem('Accounting is not exists!');

//         if (type === 'monthlyAccounts' && month) {
//             // console.log('(<any>accounting[type]): ', (<any>accounting[type]));
//             let position;
//             for (let i = 0; i < (<any>accounting['monthlyAccounts']).length; i++) {
//                 if (parseInt((<any>accounting['monthlyAccounts'])[i].month) === (month)) {
//                     position = i;
//                     break;
//                 }
//             }
//             if (position) {
//                 // Remove the old signature
//                 (<any>accounting[type])[position].pageImages = (<any>accounting[type])[position].pageImages.filter(item => {
//                     return item.indexOf('/accounting_signature_image_') < 0;
//                 });
//                 // Add the signature as an image in pageImages
//                 (<any>accounting[type])[position].pageImages.push(fullPath);
//             }
//         }
//         else {
//             // Remove the old signature
//             accounting[type].pageImages = accounting[type].pageImages.filter(item => {
//                 return item.indexOf('/accounting_signature_image_') < 0;
//             });
//             // Add the signature as an image in pageImages
//             accounting[type].pageImages.push(fullPath);
//         }

//         await this.accountingRepository.update(accounting._id, accounting);

//         return fullPath;
//     }

//     async submitSignature(data: AccountingHtml, productCode: number): Promise<any | null> {
//         let param: any = {
//             query: {
//                 userId: DataHelper.toObjectId(data.userId),
//                 beginYear: data.beginYear,
//                 endYear: data.endYear
//             }
//         };
//         let accounting = await this.accountingRepository.findOne(param);
//         // !accounting[data.accountingType].originFileId
//         if (!accounting || !accounting[data.accountingType])
//             throw new ErrorSystem('Invalid request!');
//         let fileUrl = (await BusinessLoader.fileBusiness.convertHtmlToPdf(data)).data;

//         let originFileId;
//         if (data && data.accountingType === 'monthlyAccounts' && data.month && accounting && accounting[data.accountingType]) {
//             let monthly = (<any>accounting[data.accountingType]).find((key) => {
//                 return key.month === data.month;
//             });
//             if (monthly)
//                 originFileId = monthly.originFileId;
//         }
//         else {
//             originFileId = accounting[data.accountingType].originFileId;
//         }
//         let originFile = await BusinessLoader.fileBusiness.get(originFileId);
//         if (!originFile)
//             throw new ErrorSystem('Accounting file not exists!');

//         let fileCreate = {
//             userId: originFile.userId,
//             name: originFile.name + '-signed',
//             size: originFile.size,
//             url: fileUrl.replace(Project.GOOGLE_STORAGE.BASE_URL, ''),
//             type: originFile.type,
//             extension: 'pdf',
//             productCode: productCode,
//         };

//         let file = await BusinessLoader.fileBusiness.create(fileCreate);
//         if (data && data.accountingType === 'monthlyAccounts' && data.month) {
//             await this.updateMonthlyAccount(accounting._id, data.month, DataHelper.toObjectId(file._id));
//         }
//         else
//             await this.accountingRepository.updateDataByFields(accounting._id, {destinyFileId: DataHelper.toObjectId(file._id)}, data.accountingType);

//         let destinyFileData = {
//             _id: file._id,
//             name: file.name,
//             url: file.url,
//             extension: file.extension,
//             type: file.type
//         };
//         return destinyFileData;
//     }

//     async updateMonthlyAccountStatus(_id: string, data: MonthlyAccountItem): Promise<boolean> {
//         let isExistFinaceYear = await this.accountingRepository.findOne({query: {_id: DataHelper.toObjectId(_id)}});
//         if (!data || !data.status || !data.month || typeof (data.status) !== 'number' || !isExistFinaceYear || !isExistFinaceYear.monthlyAccounts)
//             throw new ErrorSystem('Not exist');

//         let isExistMonthly = isExistFinaceYear.monthlyAccounts.find(element => {
//             return element.month === data.month;
//         });
//         if (!isExistMonthly)
//             throw new ErrorSystem('Not exist');

//         let result = await this.accountingRepository.findOneAndUpdate({
//             _id: DataHelper.toObjectId(_id),
//             monthlyAccounts: {
//                 $elemMatch: {
//                     month: data.month
//                 }
//             }
//         }, {
//             $set: {
//                 'monthlyAccounts.$.originFileId': data.status
//             }
//         });
//         return result ? true : false;
//     }

//     async updateAccounting(_id: string, type: string, data: AccountingItem): Promise<boolean> {
//         let isExistFinaceYear = await this.accountingRepository.findOne({query: {_id: DataHelper.toObjectId(_id)}});

//         if (!data || !isExistFinaceYear)
//             throw new ErrorSystem('Not exist');

//         if (data.status && typeof (data.status) !== 'number')
//             throw new ErrorSystem('Not exist 1');
//         if (data.displayable && typeof (data.displayable) !== 'boolean')
//             throw new ErrorSystem('Not exist 2');

//         if (type === 'basQuarter')
//             await this.accountingRepository.updateDataByFields(_id, data, '');
//         else if (type === 'annualReportCheckBox')
//             await this.accountingRepository.updateDataByFields(_id, data, 'annualReport');
//         else
//             await this.accountingRepository.updateDataByFields(_id, data, type);

//         return true;
//     }

//     private async getAccounting(_id: string): Promise<Accounting | null> {
//         let param = {
//             query: {
//                 _id: DataHelper.toObjectId(_id)
//             }
//         };
//         return await this.accountingRepository.findOne(param);
//     }

//     private async updateMonthlyUpload(_id: string, month: number, fileId: any): Promise<boolean> {
//         let result = await this.accountingRepository.findOneAndUpdate({
//             _id: DataHelper.toObjectId(_id),
//             monthlyAccounts: {
//                 $elemMatch: {
//                     month: month
//                 }
//             }
//         }, {
//             $set: {
//                 'monthlyAccounts.$.originFileId': fileId
//             }
//         });
//         return result ? true : false;
//     }

//     private async updateMonthlyAccount(_id: string, month: number, data: any): Promise<boolean> {
//         let result = await this.accountingRepository.findOneAndUpdate({
//             _id: DataHelper.toObjectId(_id),
//             monthlyAccounts: {
//                 $elemMatch: {
//                     month: month
//                 }
//             }
//         }, {
//             $set: {
//                 'monthlyAccounts.$.destinyFileId': data
//             }
//         });
//         return result ? true : false;
//     }
// }

// Object.seal(AccountingBusiness);
// export default AccountingBusiness;
