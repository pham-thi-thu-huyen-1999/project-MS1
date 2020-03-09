import Transaction from 'justdone-system-package/dest/app/model/transaction/Transaction'; // eslint-disable-line
import ChartAccount from 'justdone-system-package/dest/app/model/chartAccount/ChartAccount'; // eslint-disable-line

interface ITransactionBusiness {
    getBalanceSheetPdfReport(userId: string, originId: string, month: number, year: number): Promise<any>;
    /**
     * get balancesheet exportCsv
     * @param userId 
     * @param originId
     * @param month 
     * @param year 
     */
    getBalanceSheetCsvExport(userId: string, originId: string, month: number, year: number): Promise<any>;
    getPreviewBalanceSheetReportPdf(userId: string, originId: string, month: number, year: number);
    getFinancialProfitAndLostPDF(userId : string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string>;
    getFinancialProfitAndLostCsv(userId : string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string>;
    getFinancialTrialBalancePDF(userId : string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<Transaction>;
    getFinancialGstPdf(userId : string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<Transaction>;
    getFinancialTrialBalanceCSV(userId : string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<Transaction>;
    getFinancialGstDetailPdf(userId : string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<Transaction>;
    getFinancialGstCsv(userId : string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<any>;
    getFinancialGstDetailCsv(userId : string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number):Promise<any>
    createCruncherPdfReport: (originId: string, clientId: string, accountId: string, productCode: number, type: number, year: number, month: number) => Promise<any>;
    createCruncherPdfReportYear: (originId: string, clientId: string, accountId: string, productCode: number, type: number, year: number) => Promise<any>;
    createCruncherCsvReport: (originId: string, clientId: string, accountId: string, productCode: number, type: number, year: number, month: number) => Promise<string>;
    createCruncherYearCsvReport: (originId: string, clientId: string, accountId: string, productCode: number, type: number, year: number) => Promise<string>;
    exportDataReportPDF: (originId: string, productCode: number, managerId: string, clientId: any[], types: any[], beginYear: number, beginMonth: number, endYear: number, endMonth: number, productSelect: number) => Promise<string>;
    exportDataReportCSV: (originId: string, productCode: number, managerId: string, clientId: any[], types: any[], beginYear: number, beginMonth: number, endYear: number, endMonth: number, productSelect: number) => Promise<string>;
    exportCrunchReportAllClient: (originId: string, type: number, beginYear: number, beginMonth: number, endYear: number, endMonth: number, productSelect: number)=> Promise<any>;
    getFinancialProfitAndLostPdfForMultibank(userId : string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string>;
    getPreviewFinancialProfitAndLostPdfForMultibank(userId : string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string>;
    getFinancialProfitAndLostCsvForMultibank(userId : string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string>;
    getFinancialTrialBalanceCSVForMultibank(managerId: string, userId : string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string>;
    getFinancialTrialBalancePDFForMultibank(managerId: string, userId : string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string>;
    getPreviewFinancialTrialBalancePdfForMultibank(managerId: string, userId : string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string>;
    getFinancialGstPdfForMultibank(userId : string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string>;
    /**
     * preview GST
     * @param userId 
     * @param beginMonth 
     * @param beginYear 
     * @param endMonth 
     * @param endYear 
     */
    getPreviewFinancialGstPdfMultibank(userId : string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string>;
    getFinancialGstCsvForMultibank(userId : string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string>;
    getFinancialGstDetailPdfForMultiBank(userId : string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string>;
    /**
     * get preview detail GST
     * @param userId
     * @param beginMonth 
     * @param beginYear 
     * @param endMonth 
     * @param endYear 
     */
    getPreviewFinancialGstDetailPdfForMultiBank(userId : string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string>;
    getFinancialGstDetailCsvForMultiBank(userId : string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<string>;
}
export default ITransactionBusiness;
