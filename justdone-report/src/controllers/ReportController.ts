import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IReportBusiness from '../app/business/interfaces/IReportBusiness';
import UploadHelper from 'justdone-system-package/dest/helpers/UploadHelper';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import FileHelper from 'justdone-system-package/dest/helpers/FileHelper';
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import { promises } from 'dns';

const uploadDriverOpt = {
    mimetype: ['text/csv'],
    single: 'csv'
};
class ReportController extends BaseController {
    private reportBusiness: IReportBusiness = BusinessLoader.reportBusiness;

    constructor() {
        super();

        this.get('/crunch-file', this.validateData({field: 'productCode', type: 'NUM'}, {field: 'type', type: 'NUM'}, {field: 'year', type: 'Y'}, {field: 'month', type: 'M'}), this.getCrunchFile.bind(this));
        this.get('/crunch-year', this.validateData({field: 'productCode', type: 'NUM'}, {field: 'type', type: 'NUM'}, {field: 'year', type: 'Y'}, {field: 'month', type: 'M'}), this.getCrunchYear.bind(this));
        this.get('/crunch-csv', this.validateData({field: 'productCode', type: 'NUM'}, {field: 'type', type: 'NUM'}, {field: 'year', type: 'Y'}, {field: 'month', type: 'M'}), this.getCrunchCSV.bind(this));
        this.get('/balance-sheet-pdf', this.getBalanceSheetReportPDF.bind(this));
        this.get('/balance-sheet-export-csv', this.getBalanSheetExportCsv.bind(this));
        this.get('/balance-sheet-preview', this.getPreviewBanlanceSheetPDF.bind(this));
        this.get('/balance-sheet-csv', this.validateData({field: 'beginYear', type: 'Y'}), this.getBalanceSheetCsv.bind(this));
        this.get('/crunchyear-csv', this.validateData({field: 'productCode', type: 'NUM'}, {field: 'type', type: 'NUM'}, {field: 'year', type: 'Y'}, {field: 'month', type: 'M'}), this.getCrunchYearCSV.bind(this));
        this.get('/export-financial', this.getFinancialPDF.bind(this));
        this.get('/export-financial-preview', this.getPreviewFinancialPDF.bind(this));
        this.get('/csv-financial', this.getFinancialCSV.bind(this));
        this.get('/report-available', this.getReportAvailable.bind(this));
        this.get('/crunch-completed', this.getCrunchCompleted.bind(this));
        this.get('/crunch-not-completed', this.getCrunchNotCompleted.bind(this))
        // export report data
        this.post('/export-crunch-all-client', this.exportCrunchReportAllClient.bind(this));
        this.post('/balance-sheet', UploadHelper.upload(uploadDriverOpt), this.createBalanceSheet.bind(this) );
        this.post('/data-report-pdf', this.validateData({field: 'productCode', type: 'NUM'}, {field: 'year', type: 'Y'}, {field: 'month', type: 'M'}), this.exportDataReportPDF.bind(this));
        this.post('/data-report-csv', this.validateData({field: 'productCode', type: 'NUM'}, {field: 'year', type: 'Y'}, {field: 'month', type: 'M'}), this.exportDataReportCSV.bind(this));
        this.put('/balance-sheet/:id', UploadHelper.upload(uploadDriverOpt), this.updateBalanceSheet.bind(this));
    }

    async getReportAvailable(req): Promise<any> {
        return await BusinessLoader.crunchBusiness.getReportAvailable(req.query.userId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
    }

    async getCrunchCompleted(req): Promise<any> {
        return await BusinessLoader.crunchBusiness.getCrunchCompleted(req[Authenticator.userKey]._id, req.query.userId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
    }

    async getCrunchNotCompleted(req): Promise<any> {
        return await BusinessLoader.crunchBusiness.getCrunchNotCompleted(req[Authenticator.userKey]._id, req.query.userId, Number(req.query.month), Number(req.query.year));
    }

    async getCrunchFile(req): Promise<any> {
        return await this.reportBusiness.createCruncherPdfReport(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, req.query.productCode, req.query.type, req.query.month, req.query.year);
    }

    async getCrunchYear(req): Promise<any> {
        return await this.reportBusiness.createCruncherPdfReportYear(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, req.query.productCode, req.query.type, req.query.year);
    }

    async getCrunchCSV(req): Promise<any> {
        return await this.reportBusiness.createCruncherCsvReport(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, req.query.productCode, req.query.type, req.query.month, req.query.year);
    }

    async getCrunchYearCSV(req): Promise<any> {
        return await this.reportBusiness.createCruncherYearCsvReport(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, req.query.productCode, req.query.type, req.query.year);
    }

    async exportDataReportPDF(req): Promise<any> {
        return await this.reportBusiness.exportDataReportPDF(req[Authenticator.userKey]._id, req[Authenticator.userKey].permission.product.code, req.body.managerId, req.body.userIds, req.body.types, req.body.beginYear, req.body.beginMonth, req.body.endYear, req.body.endMonth, req.body.productSelect);
    }

    async exportCrunchReportAllClient(req): Promise<any> {
        return await this.reportBusiness.exportCrunchReportAllClient(req[Authenticator.userKey]._id, req.body.type, req.body.beginYear, req.body.beginMonth, req.body.endYear, req.body.endMonth, req.body.productSelect);
    }

    async getBalanceSheetCsv(req): Promise<any> {
        return await BusinessLoader.balanceSheetBusiness.getReportByFinalYear(req.query.userId, req.query.beginYear);
    }

    async getBalanSheetExportCsv(req): Promise<any> {
        return await this.reportBusiness.getBalanceSheetCsvExport(req.query.userId, req.query.originId, req.query.month, req.query.year);
    }
    async getBalanceSheetReportPDF(req): Promise<any> {
        return await BusinessLoader.reportBusiness.getBalanceSheetPdfReport(req.query.userId, req.query.originId, req.query.month, req.query.year);
    }
    
    async getPreviewBanlanceSheetPDF(req): Promise<any> {
        return await this.reportBusiness.getPreviewBalanceSheetReportPdf(req.query.userId, req.query.originId, req.query.month, req.query.year);
    }
    async createBalanceSheet(req): Promise<any> {
        if (!req.query.month || !req.query.year || !req.query.userId)
            throw new ErrorCommon(101, 'Request');

        // const fileCreate = {
        //     name: req.file.originalNameWithoutExtension,
        //     size: req.file.size,
        //     type: FileHelper.getFileTypeByExtension(req.file.extension),
        //     extension: req.file.extension,
        //     url: req.file.filename
        // };

        const fileCreate = {
            name: req.file.originalNameWithoutExtension,
            size: req.file.size,
            type: FileHelper.getFileTypeByExtension('csv'),
            extension: 'csv',
            url: req.file.filename
        };

        return await BusinessLoader.balanceSheetBusiness.create(req.query.userId, fileCreate, req.query.month, req.query.year);
    }

    async updateBalanceSheet(req): Promise<any> {
        if (!req.params.id)
            throw new ErrorCommon(101, 'Request');
        const fileCreate = {
            name: req.file.originalNameWithoutExtension,
            size: req.file.size,
            type: FileHelper.getFileTypeByExtension('csv'),
            extension: 'csv',
            url: req.file.filename
        };

        return await BusinessLoader.balanceSheetBusiness.update(req.params.id, fileCreate);
    }

    async exportDataReportCSV(req): Promise<any> {
        return await this.reportBusiness.exportDataReportCSV(req[Authenticator.userKey]._id, req[Authenticator.userKey].permission.product.code, req.body.managerId, req.body.userIds, req.body.types, req.body.beginYear, req.body.beginMonth, req.body.endYear, req.body.endMonth, req.body.productSelect);
    }

    async getFinancialPDF(req): Promise<any> {
        const typeReport = Number(req.query.type);
        switch (typeReport) {
        case 1:
            return await this.reportBusiness.getFinancialProfitAndLostPdfForMultibank(req.query.userId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
            // return await this.reportBusiness.getFinancialProfitAndLostPDF(req.query.userId, '16998169', Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
        case 2:
            return await this.reportBusiness.getFinancialTrialBalancePDFForMultibank(req.query.managerId, req.query.userId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
            // return await this.reportBusiness.getFinancialTrialBalancePDF(req.query.userId, req.query.accountId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
        case 3:
            return await this.reportBusiness.getFinancialGstPdfForMultibank(req.query.userId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
            // return await this.reportBusiness.getFinancialGstPdf(req.query.userId, req.query.accountId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
        case 4:
            return await this.reportBusiness.getFinancialGstDetailPdfForMultiBank(req.query.userId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
            // return await this.reportBusiness.getFinancialGstDetailPdf(req.query.userId, req.query.accountId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
        default:
            break;
        }
    }

    async getPreviewFinancialPDF(req): Promise<any> {
        const typeReport = Number(req.query.type);
        switch (typeReport) {
            case 1:
                return await this.reportBusiness.getPreviewFinancialProfitAndLostPdfForMultibank(req.query.userId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
            case 2:
                return await this.reportBusiness.getPreviewFinancialTrialBalancePdfForMultibank(req.query.managerId, req.query.userId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
            case 3: 
                return await this.reportBusiness.getPreviewFinancialGstPdfMultibank(req.query.userId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
            case 4:
                return await this.reportBusiness.getPreviewFinancialGstDetailPdfForMultiBank(req.query.userId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
        }
    }

    async getFinancialCSV(req): Promise<any> {
        const typeReport = Number(req.query.type);
        switch (typeReport) {
        case 1:
            return await this.reportBusiness.getFinancialProfitAndLostCsvForMultibank(req.query.userId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
            // return await this.reportBusiness.getFinancialProfitAndLostCsv(req.query.userId, req.query.accountId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
        case 2:
            return await this.reportBusiness.getFinancialTrialBalanceCSVForMultibank(req.query.managerId, req.query.userId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
            // return await this.reportBusiness.getFinancialTrialBalanceCSV(req.query.userId, req.query.accountId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
        case 3:
            return await this.reportBusiness.getFinancialGstCsvForMultibank(req.query.userId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
            // return await this.reportBusiness.getFinancialGstCsv(req.query.userId, req.query.accountId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
        case 4:
            return await this.reportBusiness.getFinancialGstDetailCsvForMultiBank(req.query.userId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
            // return await this.reportBusiness.getFinancialGstDetailCsv(req.query.userId, req.query.accountId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
        default:
            break;
        }
    }
}

Object.seal(ReportController);
export default ReportController;
