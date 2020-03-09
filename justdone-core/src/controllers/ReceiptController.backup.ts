import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IReceiptBusiness from '../app/business/interfaces/IReceiptBusiness';
import Receipt from 'justdone-system-package/dest/app/model/receipt/Receipt'; // eslint-disable-line
import ReceiptCreate from 'justdone-system-package/dest/app/model/receipt/ReceiptCreate'; // eslint-disable-line
import ReceiptUpdate from 'justdone-system-package/dest/app/model/receipt/ReceiptUpdate'; // eslint-disable-line
import UploadHelper from 'justdone-system-package/dest/helpers/UploadHelper';
import FileHelper from 'justdone-system-package/dest/helpers/FileHelper';
import UserAuthentication from 'justdone-system-package/dest/app/model/user/UserAuthentication'; // eslint-disable-line
import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';

const uploadOpts = {
    mimetype: ['image/jpg', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'],
    fields: [{
        name: 'receipts',
        maxCount: 10
    }]
};

class ReceiptController extends BaseController {
    private receiptBusiness: IReceiptBusiness = BusinessLoader.receiptBusiness;

    constructor() {
        super();

        this.get('/list', this.validateData({field: 'month', type: 'M'}, {field: 'year', type: 'Y'} ), this.validatePagination(), this.getByMonth.bind(this));
        this.get('/count', this.validateData({field: 'month', type: 'M'}, {field: 'year', type: 'Y'} ), this.getCountByMonthAndYearFinance.bind(this));
        this.get('/list-total-by-date', this.validateData({field: 'month', type: 'M'}, {field: 'year', type: 'Y'} ), this.getTotalCashReceipts.bind(this));
        this.get('/list/count', this.getCountReceipts.bind(this));
        this.get('/list-by-clientId', this.validateData({field: 'beginYear', type: 'Y'}, {field: 'endYear', type: 'Y'}, {field: 'beginMonth', type: 'M'}, {field: 'endMonth', type: 'M'}), this.validatePagination(), this.getReceiptsByClientId.bind(this));
        this.get('/:_id', this.getReceiptById.bind(this));

        this.post('/', UploadHelper.upload(uploadOpts), this.createReceipt.bind(this));
        this.put('/:_id', this.updateReceipt.bind(this));
        this.delete('/:_id', this.deleteReceipt.bind(this));
    }

    async getByMonth(req): Promise<any> {
        let location = '';
        let managerId = '';
        return await this.receiptBusiness.getListByMonthAndYearFinance(req[Authenticator.userKey]._id, managerId, location, req.query.month, req.query.year, req.query.page, req.query.limit);
    }

    async getCountByMonthAndYearFinance(req): Promise<any> {
        return await this.receiptBusiness.getCountByMonthAndYearFinance(req[Authenticator.userKey]._id, req.query.month, req.query.year);
    }

    async getTotalCashReceipts(req): Promise<any> {
        return await this.receiptBusiness.getTotalCashReceipts(req.query.month, req.query.year);
    }

    async getReceiptsByClientId(req): Promise<any> {
        let location = '';
        let beginMonth = 7; // Project.FINANCE_YEAR[location].BEGIN_MONTH;
        let endMonth = 6; // Project.FINANCE_YEAR[location].END_MONTH;
        let clientId = req.query.clientId;

        let userLogin: UserAuthentication = req[Authenticator.userKey];
        let managerId = userLogin._id;

        return await this.receiptBusiness.getList(clientId, managerId, location, req.query.beginYear, req.query.endYear, beginMonth, endMonth, req.query.page, req.query.limit);
    }

    async getCountReceipts(req): Promise<any> {
        return await this.receiptBusiness.getCount();
    }

    async getReceiptById(req): Promise<any> {
        return await this.receiptBusiness.get(req.params._id);
    }

    async createReceipt(req): Promise<any> {
        if (req.files) {
            let files = req.files.receipts;
            let data: any = [];
            await Promise.all(files.map(async (file) => {
                let fileCreate = new FileCreate(<any>{
                    name: file.originalNameWithoutExtension,
                    size: file.size,
                    type: FileHelper.getFileTypeByExtension(file.extension),
                    extension: file.extension,
                    url: file.filename,
                    userId: req[Authenticator.userKey]._id
                });
                let fileInfo = await this.receiptBusiness.uploadFile(fileCreate, req[Authenticator.userKey].permission.product.code);
                if (!fileInfo)
                    return false;
                data.push(fileInfo);
            }));
            return data;
        }
        return false;
    }

    async updateReceipt(req): Promise<any> {
        return await this.receiptBusiness.update(req.params._id, new ReceiptUpdate(req.body));
    }

    async deleteReceipt(req): Promise<any> {
        return await this.receiptBusiness.delete(req.params._id);
    }
}

Object.seal(ReceiptController);
export default ReceiptController;
