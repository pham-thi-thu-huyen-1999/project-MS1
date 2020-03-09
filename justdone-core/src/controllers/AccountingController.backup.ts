import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import UploadHelper from 'justdone-system-package/dest/helpers/UploadHelper';
import FileHelper from 'justdone-system-package/dest/helpers/FileHelper';
import IAccountingBusiness from '../app/business/interfaces/IAccountingBusiness';
import AccountingCreate from 'justdone-system-package/dest/app/model/accounting/AccountingCreate';
import AccountingHtml from 'justdone-system-package/dest/app/model/accounting/AccountingHtml';
import AccountingUpdate from 'justdone-system-package/dest/app/model/accounting/AccountingUpdate';
import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';

const uploadAccounting = {
    mimetype: ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf'],
    single: 'accounting'
};

class AccountingController extends BaseController {
    private accountingBusiness: IAccountingBusiness = BusinessLoader.accountingBusiness;

    constructor() {
        super();

        this.get('/list', this.validatePagination(), this.getList.bind(this));
        this.get('/list/count', this.getCountAccountings.bind(this));
        this.get('/:beginYear/:endYear', this.validateData({field: 'beginYear', type: 'Y'}, {field: 'endYear', type: 'Y'}), this.getAccounting.bind(this));
        this.get('/:_id/:beginYear/:endYear', this.validateData({field: 'beginYear', type: 'Y'}, {field: 'endYear', type: 'Y'}), this.getAccountingByUserId.bind(this));

        this.post('/', this.createAccounting.bind(this));
        this.post('/:_id', UploadHelper.upload(uploadAccounting), this.uploadAccounting.bind(this));
        this.post('/monthly-account/:_id', UploadHelper.upload(uploadAccounting), this.uploadMonthlyAccounting.bind(this));
        this.post('/signature/:_id', UploadHelper.upload(uploadAccounting), this.uploadSignature.bind(this));
        this.post('/submit-signature', this.submitSignature.bind(this));

        this.put('/:_id', this.updateAccounting.bind(this));
        this.put('/:_id/monthly-accounts', this.updateMonthlyAccount.bind(this));
        this.put('/:userId/:beginYear/:endYear', this.validateData({field: 'beginYear', type: 'Y'}, {field: 'endYear', type: 'Y'}), this.updateByUserAccounting.bind(this));

        this.delete('/:_id', this.deleteAccounting.bind(this));
    }

    async getList(req): Promise<any> {
        return await this.accountingBusiness.getList(req.query.page, req.query.limit);
    }

    async getCountAccountings(req): Promise<any> {
        return await this.accountingBusiness.getCount();
    }

    async getAccounting(req): Promise<any> {
        return await this.accountingBusiness.getAccountingByUser(req[Authenticator.userKey]._id, req.params.beginYear, req.params.endYear);
    }

    async getAccountingByUserId(req): Promise<any> {
        return await this.accountingBusiness.getAccountingByUser(req.params._id, req.params.beginYear, req.params.endYear);
    }

    async uploadMonthlyAccounting(req): Promise<any> {
        if (req.file) {
            let fileCreate = new FileCreate(<any>{
                name: req.file.originalNameWithoutExtension,
                size: req.file.size,
                type: FileHelper.getFileTypeByExtension(req.file.extension),
                extension: req.file.extension,
                url: req.file.filename,
                userId: req[Authenticator.userKey]._id
            });
            return await this.accountingBusiness.uploadMonthlyAccounting(req.params._id, req.query.month, req[Authenticator.userKey].permission.product.code, fileCreate);
        }
        return null;
    }

    async uploadAccounting(req): Promise<any> {
        if (req.file) {
            let fileCreate = new FileCreate(<any>{
                name: req.file.originalNameWithoutExtension,
                size: req.file.size,
                type: FileHelper.getFileTypeByExtension(req.file.extension),
                extension: req.file.extension,
                url: req.file.filename,
                userId: req[Authenticator.userKey]._id
            });

            return await this.accountingBusiness.uploadAccounting(req.params._id, req.query.type, req[Authenticator.userKey].permission.product.code, fileCreate);
        }
        return null;
    }

    async uploadSignature(req): Promise<any> {
        if (req.file) {
            let fileCreate = new FileCreate(<any>{
                name: req.file.originalNameWithoutExtension,
                size: req.file.size,
                type: FileHelper.getFileTypeByExtension(req.file.extension),
                extension: req.file.extension,
                url: req.file.filename,
                userId: req[Authenticator.userKey]._id
            });

            return await this.accountingBusiness.uploadSignature(req.params._id, req.query.type, req[Authenticator.userKey].permission.product.code, fileCreate, parseInt(req.query.month));
        }
        return null;
    }

    async submitSignature(req): Promise<any> {
        req.body.userId = req[Authenticator.userKey]._id;
        return await this.accountingBusiness.submitSignature(new AccountingHtml(req.body), req[Authenticator.userKey].permission.product.code);
    }

    async createAccounting(req): Promise<any> {
        return await this.accountingBusiness.create(new AccountingCreate(req.body));
    }

    async updateMonthlyAccount(req): Promise<boolean> {
        return await this.accountingBusiness.updateMonthlyAccountStatus(req.params._id, req.body);
    }

    async updateAccounting(req): Promise<any> {
        return await this.accountingBusiness.updateAccounting(req.params._id, req.query.type, req.body);
    }

    async updateByUserAccounting(req): Promise<any> {
        return await this.accountingBusiness.updateByFinanceYear(req.params.userId, req.params.beginYear, req.params.endYear, new AccountingUpdate(req.body));
    }

    async deleteAccounting(req): Promise<any> {
        return await this.accountingBusiness.delete(req.params._id);
    }
}

Object.seal(AccountingController);
export default AccountingController;
