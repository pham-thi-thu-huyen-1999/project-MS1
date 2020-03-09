import BalanceSheetReport from 'justdone-system-package/dest/app/model/balanceSheetReport/BalanceSheetReport';

interface IBalanceSheetReportBusiness {
    getReportByFinalYear: (userId:string, beginYear: number) => Promise<BalanceSheetReport[]>;
    create: (userId:string, fileCreate:any, month: number, year: number) => Promise<BalanceSheetReport>;
    getReport(userId: string, month: number, year: number): Promise<BalanceSheetReport | null>;
    update(id:string, fileCreate:any): Promise<boolean>
}

export default IBalanceSheetReportBusiness;
