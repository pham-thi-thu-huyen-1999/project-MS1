import Accounting from 'justdone-system-package/dest/app/model/accounting/Accounting'; // eslint-disable-line
import AccountingHtml from 'justdone-system-package/dest/app/model/accounting/AccountingHtml'; // eslint-disable-line
import AccountingCreate from 'justdone-system-package/dest/app/model/accounting/AccountingCreate'; // eslint-disable-line
import AccountingUpdate from 'justdone-system-package/dest/app/model/accounting/AccountingUpdate'; // eslint-disable-line
import IAccountingBusiness from './interfaces/IAccountingBusiness'; // eslint-disable-line
import AccounntingPdf from 'justdone-system-package/dest/app/model/accounting/AccountingPdf'; // eslint-disable-line
import TemplateAccountingPdf from '../../resources/templates/documents/TemplateAccountingPdf'; // eslint-disable-line
import AccountingRepository from 'justdone-system-package/dest/app/repository/AccountingRepository'; // eslint-disable-line
import GoogleStorageHelper from 'justdone-system-package/dest/helpers/GoogleStorageHelper'; // eslint-disable-line
import FileHelper from 'justdone-system-package/dest/helpers/FileHelper'; // eslint-disable-line
import PdfHelper from 'justdone-system-package/dest/helpers/PdfHelper'; // eslint-disable-line
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper'; // eslint-disable-line
import Project from '../../config/Project'; // eslint-disable-line
import {PDFImage} from 'pdf-image'; // eslint-disable-line

class AccountingBusiness implements IAccountingBusiness {
    private accountingRepository: AccountingRepository;
    private acceptedExtensions: any = ['pdf', 'png', 'jpg', 'jpeg'];

    constructor() {
        this.accountingRepository = new AccountingRepository();
    }

    // async convertPdfToImage(data: AccounntingPdf): Promise<any> {
    //     if (!data || !data.userId || !data.beginYear || !data.endYear || !data.productType || !data.accountingType)
    //         throw new Error('Invalid Request!');

    //     let extension = data.originFilePath.substr(data.originFilePath.lastIndexOf('.') + 1, data.originFilePath.length);
    //     let pageImages: any[] = [];

    //     if (this.acceptedExtensions.indexOf(extension) < 0)
    //         throw new Error('Invalid File Extension!');
    //     if (extension === 'pdf') {
    //         let fileName = data.originFilePath.substr(data.originFilePath.lastIndexOf('/') + 1, data.originFilePath.length);
    //         let accountingPrefix = GoogleStorageHelper.getAccountingPath(data.userId, data.productType, data.beginYear.toString()) + data.accountingType;

    //         let localPath = 'tmp' + accountingPrefix;
    //         await FileHelper.createDirPath(localPath);

    //         let localFilePath = localPath + '/' + fileName;
    //         await FileHelper.downloadFile(data.originFilePath, localFilePath);

    //         let pdfImageEngine = new PDFImage(localFilePath);
    //         let imagePath: string = '';
    //         let page: number = 0;

    //         do {
    //             try {
    //                 imagePath = await pdfImageEngine.convertPage(page++);
    //                 console.log('imagePath: ', imagePath);
    //                 let destinationFile = imagePath.replace('tmp/', '');
    //                 console.log('cloudPath: ', destinationFile);
    //                 await GoogleStorageHelper.uploadFile(imagePath, destinationFile, Project.GOOGLE_STORAGE.BUCKET_NAME);
    //                 let fullPath = `${Project.GOOGLE_STORAGE.BASE_URL}/${Project.GOOGLE_STORAGE.BUCKET_NAME}/${destinationFile}`;
    //                 pageImages.push(fullPath);
    //             }
    //             catch (err) {
    //                 imagePath = '';
    //                 console.log('catch while first', err);
    //             }
    //         } while (imagePath);
    //     }
    //     else
    //         pageImages.push(data.originFilePath);

    //     let params = {
    //         query: <any>{
    //             userId: DataHelper.toObjectId(data.userId),
    //             beginYear: Number(data.beginYear),
    //             endYear: Number(data.endYear)
    //         }
    //     };

    //     let accounting = await this.accountingRepository.findOne(params);

    //     if (!accounting)
    //         throw new Error('Accounting is not exists!');

    //     if (data.accountingType === 'monthlyAccounts' && data.month) {
    //         for (let i = 0; i < accounting.monthlyAccounts.length; i++) {
    //             if (Number(accounting.monthlyAccounts[i].month) === Number(data.month)) {
    //                 accounting.monthlyAccounts[i].pageImages = pageImages;
    //                 break;
    //             }
    //         }
    //         await this.accountingRepository.update(accounting._id, accounting);
    //     }
    //     else {
    //         accounting[data.accountingType].pageImages = pageImages;
    //         await this.accountingRepository.update(accounting._id, accounting);
    //     }
    //     return pageImages;
    // }

    // async convertHtmlToPdf(data: AccountingHtml): Promise<any> {
    //     if (!data || !data.userId || !data.beginYear || !data.endYear || !data.productType || !data.accountingType)
    //         throw new Error('Invalid Request!');

    //     let params = {
    //         query: <any>{
    //             userId: DataHelper.toObjectId(data.userId),
    //             beginYear: Number(data.beginYear),
    //             endYear: Number(data.endYear)
    //         }
    //     };

    //     let accounting = await this.accountingRepository.findOne(params);

    //     if (!accounting)
    //         throw new Error('Accounting is not exists!');

    //     // Create tmp folder
    //     let localPath = 'tmp' + GoogleStorageHelper.getAccountingPath(data.userId, data.productType, data.beginYear.toString()) + data.accountingType;
    //     await FileHelper.createDirPath(localPath);

    //     let fileName = FileHelper.getFileNameFromUrlWithoutExtension(data.originFilePath);
    //     let localFilePath = `${localPath}/${fileName}-${Math.floor(Math.random() * 1000)}-signed.pdf`;
    //     let pageImages;
    //     if (data && data.accountingType === 'monthlyAccounts' && data.month && accounting && accounting[data.accountingType]) {
    //         let monthly = (<any>accounting[data.accountingType]).find((key) => {
    //             return key.month === data.month;
    //         });
    //         if (monthly)
    //             pageImages = monthly.pageImages;
    //     }
    //     else {
    //         pageImages = accounting[data.accountingType].pageImages;
    //     }
    //     try {
    //         let page = 0;
    //         do {
    //             if (data.htmlString.indexOf(pageImages[page]) > -1) {
    //                 let dataUri = await FileHelper.toDataURL(pageImages[page]);
    //                 console.log('Convert image: ', pageImages[page]);
    //                 data.htmlString = data.htmlString.replace(pageImages[page], dataUri);
    //             }
    //             ++page;
    //         } while (page < pageImages.length);
    //     }
    //     catch (err) {
    //         throw new Error(err);
    //     }

    //     let templatePdf = new TemplateAccountingPdf(data.htmlString);

    //     let options = {
    //         format: 'A4', border: '0',
    //         footer: {
    //             height: '0mm',
    //         },
    //     };

    //     await PdfHelper.createPdf(templatePdf.getTemplate(), options, localFilePath);
    //     let destFilePath = `${Project.GOOGLE_STORAGE.BASE_URL}/${Project.GOOGLE_STORAGE.BUCKET_NAME}${localFilePath.replace('tmp/', '/')}`;
    //     await GoogleStorageHelper.uploadFile(localFilePath, localFilePath.replace('tmp/', '/'), Project.GOOGLE_STORAGE.BUCKET_NAME);

    //     console.log('===> OK DONE: ', destFilePath);

    //     return destFilePath;
    // }
}

Object.seal(AccountingBusiness);
export default AccountingBusiness;
