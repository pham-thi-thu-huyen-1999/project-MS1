import {Config} from '../config';
import * as gsc from '@google-cloud/storage';

export default class GoogleStorageHelper {
    private static gscClient() {
        return gsc({
            projectId: Config.PROJECT.GOOGLE_STORAGE.PROJECT_ID,
            keyFilename: Config.PROJECT.GOOGLE_STORAGE.KEY_FILENAME
        });
    }
    // prefix struct: foder1/folder2/
    // filename struct: document.text

    public static uploadFile(localFile: string, prefix: string, fileName: string, bucketName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let gscClient = this.gscClient();
            gscClient.bucket(bucketName)
                .upload(localFile, {destination: `${prefix}${fileName}`, public: true})
                .then(() => {
                    let url = `/${bucketName}${prefix}${fileName}`;
                    resolve(url);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    public static uploadCrunch(localFile: string, prefix: string, fileName: string, bucketName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let gscClient = this.gscClient();
            gscClient.bucket(bucketName)
                .upload(localFile, {destination: `${fileName}`, public: true}) // ${prefix}
                .then((result) => {
                    let url = result[0].metadata.mediaLink;
                    resolve(url);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    public static moveFile(sourceFile: string, newPath: string, bucketName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let gscClient = this.gscClient();
            gscClient
                .bucket(bucketName)
                .file(sourceFile)
                .move(newPath)
                .then(() => {
                    let url = `/${bucketName}${newPath}`;
                    resolve(url);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    public static deleteFile(filePath: string, bucketName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let gscClient = this.gscClient();
            gscClient
                .bucket(bucketName)
                .file(filePath)
                .delete()
                .then(() => {
                    resolve(true);
                })
                .catch(err => {
                    resolve(false);
                });
        });
    }

    public static getListFile(prefix: string, bucketName: string) {
        return new Promise<any>((resolve, reject) => {
            const options = {
                prefix: prefix,
            };
            gsc.bucket(bucketName)
                .getFiles(options)
                .then(results => {
                    const files = results[0];
                    resolve(files);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    // public static async syncFileToGoogleStorage(index: number, localFile: string, keyGoogleStorageAWS: string): Promise<void> {
    //     if (!Project.GoogleStorageBUCKET[index])
    //         return;

    //     try {
    //         await GoogleStorageHelper.uploadFileToGoogleStorage(localFile, keyGoogleStorageAWS, Project.GoogleStorageBUCKET[index]);
    //     }
    //     catch (error) {
    //         console.error(error);
    //     }
    //     await GoogleStorageHelper.syncFileToGoogleStorage(++index, localFile, keyGoogleStorageAWS);
    // }

    // public static async syncDirToGoogleStorage(index: number, localDir: string, prefixGoogleStorageAWS: string, s3BucketName: any) {
    //     if (!s3BucketName[index])
    //         return;

    //     try {
    //         await GoogleStorageHelper.uploadDirToGoogleStorage(localDir, prefixGoogleStorageAWS, s3BucketName[index]);
    //     }
    //     catch (error) {
    //         console.error(error);
    //     }
    //     await GoogleStorageHelper.syncDirToGoogleStorage(++index, localDir, prefixGoogleStorageAWS, s3BucketName);
    // }
    public static getProductPrefix(productId: string) {
        return `/product/${productId}/`;
    }
    public static getAccountingPrefix(ownerId: string, productCode: number, year: string) {
        return `/${ownerId}/${productCode}/${year}/accounting/`;
    }
    public static getProfilePrefix(ownerId: string, productCode: number) {
        return `/${ownerId}/${productCode}/profile/`;
    }

    public static getBillingPrefix(ownerId: string, productCode: number, year: string) {
        return `/${ownerId}/${productCode}/${year}/billing/`;
    }

    public static getTransactionPrefix(ownerId: string, productCode: number, year: string, type: string) {
        return `/${ownerId}/${productCode}/${year}/transaction/${type}/`;
    }

    public static getBalanceSheetPrefix(ownerId: string, productCode: number, year: string) {
        return `/${ownerId}/${productCode}/${year}/balance-sheet/`;
    }

    public static getReceiptPrefix(ownerId: string, productCode: number, year: string) {
        return `/${ownerId}/${productCode}/${year}/transaction/cash_reciept/`;
    }

    public static getEvidencedPrefix(ownerId: string, productCode: number, year: string, month: number) {
        return `/${ownerId}/${productCode}/${year}/${month}/general-journal/evidenced/`;
    }
};
