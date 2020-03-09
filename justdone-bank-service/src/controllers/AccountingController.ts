import BusinessLoader from '../system/BusinessLoader';
import IAccountingBusiness from '../app/business/interfaces/IAccountingBusiness';
import BaseController from './base/BaseController';
import AccountingPdf from 'justdone-system-package/dest/app/model/accounting/AccountingPdf'; // eslint-disable-line
import AccountingHtml from 'justdone-system-package/dest/app/model/accounting/AccountingHtml'; // eslint-disable-line

class AccountingController extends BaseController {
    private accountingBusiness: IAccountingBusiness = BusinessLoader.accountingBusiness;

    constructor() {
        super();

        this.put('/convert-pdf', this.convertPdfToImage.bind(this));
        this.put('/generate-pdf', this.convertHtmlToPdf.bind(this));
    }

    async convertPdfToImage(req): Promise<any> {
        // return this.accountingBusiness.convertPdfToImage(new AccountingPdf(req.body));
    }

    async convertHtmlToPdf(req): Promise<any> {
        // return this.accountingBusiness.convertHtmlToPdf(new AccountingHtml(req.body));
    }
}

Object.seal(AccountingController);
export default AccountingController;
