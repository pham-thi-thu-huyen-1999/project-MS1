import BusinessLoader from '../../system/BusinessLoader';
import Receipt from 'justdone-system-package/dest/app/model/receipt/Receipt'; // eslint-disable-line
import ReceiptCreate from 'justdone-system-package/dest/app/model/receipt/ReceiptCreate'; // eslint-disable-line
import ReceiptUpdate from 'justdone-system-package/dest/app/model/receipt/ReceiptUpdate'; // eslint-disable-line
import IReceiptBusiness from './interfaces/IReceiptBusiness'; // eslint-disable-line
import ReceiptRepository from 'justdone-system-package/dest/app/repository/ReceiptRepository';
import Project from '../../config/Project';
import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate'; // eslint-disable-line
import FileUpdate from 'justdone-system-package/dest/app/model/file/FileUpdate'; // eslint-disable-line

import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import GoogleStorageHelper from 'justdone-system-package/dest/helpers/GoogleStorageHelper';
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';

class ReceiptBusiness implements IReceiptBusiness {
    private receiptRepository: ReceiptRepository;

    constructor() {
        this.receiptRepository = new ReceiptRepository();
    }

    async getList(userId: string, managerId: string, location: string, beginYear: number, endYear: number, beginMonth: number, endMonth: number, page: number, limit: number): Promise<Receipt[]> {
        let param = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                $or: [{
                    month: {
                        $gte: Number(beginMonth)
                    },
                    year: {
                        $gte: Number(beginYear)
                    }
                }, {
                    month: {
                        $lte: Number(endMonth)
                    },
                    year: {
                        $lte: Number(endYear)
                    }
                }]
            },
            populate: [{path: 'fileId', select: 'userId type name url'},
                {path: 'userId', select: 'permission.managers', match: {'permission.managers': managerId && DataHelper.toObjectId(managerId)}}]
        };
        let order = {
            year: -1,
            month: -1
        };

        let receipts = await this.receiptRepository.find(param, order, Number(page), Number(limit));
        let list = Receipt.parseArray(receipts);

        list.forEach(item => {
            item.fileId = {
                _id: item.fileId._id,
                name: item.fileId.name,
                url: item.fileId.url
            };
        });

        return list;
    }

    async getListByMonthAndYearFinance(userId: string, managerId: string, location: string, month: number, year: number, page: number, limit: number): Promise<any> {
        let param = {
            query: <any>{
                userId: userId,
                $and: [{
                    month: month,
                    year: year
                }]
            },
            populate: [
                {path: 'fileId', select: 'type name url'},
                {path: 'userId', select: 'permission.managers'}
            ]
        };
        let order = {
            month: -1,
            createdAt: -1
        };

        let receipts = await this.receiptRepository.find(param, order, page, limit);
        if (managerId) {
            receipts = receipts.filter(receipt => {
                return receipt.userId.permission.managers.include(managerId.toString());
            });
        };

        let list = Receipt.parseArray(receipts);
        let result = {
            data: {}
        };
        result.data = list;
        return result;
    }

    async getCountByMonthAndYearFinance(userId: string, month: number, year: number): Promise<number> {
        let param = {
            query: {
                userId: userId,
                $and: [{
                    month: month,
                    year: year
                }]
            }
        };
        let countRecords = await this.receiptRepository.getCount(param);
        if (!countRecords)
            return 0;
        return countRecords;
    }

    async getTotalCashReceipts(month: number, year: number) {
        let aggregate = [
            {$match: {month: month, year: year}},
            {$group: {_id: {month: '$month', year: '$year'}, total: {$sum: '$total'}}}
        ];
        return await this.receiptRepository.aggregate(aggregate);
    }

    async getCount(): Promise<number> {
        return await this.receiptRepository.getCount();
    }

    async get(_id: string, populate: any = null): Promise<Receipt | null> {
        if (!_id)
            return null;

        let receipt = await this.receiptRepository.get(_id, populate);
        return receipt && new Receipt(receipt);
    }

    async create(data: ReceiptCreate): Promise<Receipt> {
        let receipt = await this.receiptRepository.create(data);
        return receipt && new Receipt(receipt);
    }

    async uploadFile(data: FileCreate, productCode: number): Promise<any> {
        let user = await BusinessLoader.userBusiness.get(data.userId);
        if (!user) {
            throw new ErrorCommon(102, 'User');
        };

        let prefix = await GoogleStorageHelper.getTransactionPrefix(data.userId, productCode, new Date().getFullYear().toString(), 'cash_reciept');
        data.prefix = prefix;

        let file = await BusinessLoader.fileBusiness.create(data);
        if (file) {
            let receiptCreate = new ReceiptCreate(<any>{
                fileId: file._id,
                userId: file.userId,
            });

            let result = await this.create(receiptCreate);
            if (!result)
                return null;

            result.fileId = {
                _id: result._id,
                name: file.name,
                url: data.url
            };
            return result;
        }
        return null;
    }

    async update(_id: string, data: ReceiptUpdate): Promise<Receipt | null> {
        if (!data || Number(data.year) > (new Date()).getFullYear() + 1 || Number(data.year) < (new Date()).getFullYear() - 1)
            throw new ErrorCommon(101, 'Date');
        let populate = [{
            path: 'userId',
            select: '_id fullName'
        }, {
            path: 'fileId',
            select: '_id url name'
        }];
        let receipt: any = await this.get(_id, populate);
        let year = receipt.year;
        let newYear = data.year;
        // TODO:Update to googlestore
        if (year !== newYear && receipt && receipt.file && receipt.file.url) {
            let sourcePath = receipt.fileId.url;
            let destinationPath = sourcePath.replace(`/${year}/`, `/${newYear}/`);
            destinationPath = destinationPath.replace(`/${Project.GOOGLE_STORAGE.BUCKET_NAME}/`, '');
            destinationPath = destinationPath.replace(`/${receipt.fileId.name}`, `/data.fileId.name`);
            // change s3Bucket => google
            await GoogleStorageHelper.moveFile(sourcePath.replace(`/${Project.GOOGLE_STORAGE.BUCKET_NAME}`, ''), destinationPath, Project.GOOGLE_STORAGE.BUCKET_NAME);
            BusinessLoader.fileBusiness.update(receipt.fileId._id, <FileUpdate>{url: receipt.fileId.url.replace(`/${year}/`, `/${newYear}/`)});
        }

        let result: any = await this.receiptRepository.update(_id, data);
        if (result.error)
            throw new ErrorCommon(103, 'Receipt');

        let populate2 = {
            path: 'fileId',
            select: '_id url name'
        };
        let newReceipt: any = await this.get(_id, populate2);

        return newReceipt;
    }

    async delete(_id: string): Promise<boolean> {
        return await this.receiptRepository.delete(_id);
    }
}

Object.seal(ReceiptBusiness);
export default ReceiptBusiness;
