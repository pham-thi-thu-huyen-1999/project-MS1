import BalanceSheetReportRepository from 'justdone-system-package/dest/app/repository/BalanceSheetReportRepository';
import BalanceSheetReport from 'justdone-system-package/dest/app/model/balanceSheetReport/BalanceSheetReport'; // eslint-disable-line
import GoogleStorageHelper from 'justdone-system-package/dest/helpers/GoogleStorageHelper';
import IBalanceSheetReportBusiness from './interfaces/IBalanceSheetReportBusiness';// eslint-disable-line
import BusinessLoader from '../../system/BusinessLoader';
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';

class BalanceSheetReportBusiness implements IBalanceSheetReportBusiness {
    private balanceSheetReportRepository : BalanceSheetReportRepository;
    constructor() {
        this.balanceSheetReportRepository = new BalanceSheetReportRepository();
    }

    async getReportByFinalYear(userId:string, beginYear: number): Promise<BalanceSheetReport[]> {
        const user = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            throw new ErrorCommon(102, 'User');
        const startMonth = 7;
        const endMonth = 6;
        const query = {
            userId,
            $or: [
                {
                    month: {$lte: endMonth},
                    year: beginYear + 1
                }, {
                    month: {$gte: startMonth},
                    year: beginYear
                }
            ]
        };
        const params = {
            query: query,
            populate: [{
                path: 'csv',
                select: 'url'
            }]
        };

        let balanceSheetReports = await this.balanceSheetReportRepository.findAll(params);
        return BalanceSheetReport.parseArray(balanceSheetReports);
    }
    async create(userId:string, fileCreate:any, month: number, year: number): Promise<BalanceSheetReport> {
        const user = await BusinessLoader.userBusiness.get(userId);
        if (!user || !user.permission || !user.permission.product)
            throw new ErrorCommon(102, 'User');
        const productId = user.permission.product;
        const product = await BusinessLoader.productBusiness.get(productId);
        if (!product)
            throw new ErrorCommon(102, 'User');
        let crunchPrefix = GoogleStorageHelper.getBalanceSheetPrefix(user._id, product.code, year.toString());
        fileCreate.prefix = crunchPrefix;
        fileCreate.productCode = product.code,
        fileCreate.userId = userId;
        const newFileName = `balance-sheet_${month}_${year}`;
        const file = await BusinessLoader.fileBusiness.create(fileCreate, newFileName);
        if (!file)
            throw new ErrorCommon(102, 'File');
        const balanceSheetReport = await this.balanceSheetReportRepository.findOne({query: {
            userId: userId,
            month: month,
            year: year
        }});
        if (balanceSheetReport)
            throw new Error('Balance Sheet is Exist');

        const balanceSheet = await this.balanceSheetReportRepository.create({userId, month, year, csv: file._id});
        return balanceSheet && new BalanceSheetReport(balanceSheet);
    }

    async update(id:string, fileCreate:any): Promise<boolean> {
        const populate = [{
            path: 'csv',
            select: 'url'
        }];
        const balanceSheetReport = await this.balanceSheetReportRepository.get(id, populate);
        if (!balanceSheetReport)
            throw new Error('Balance Sheet is Not Exist');
        const userId = balanceSheetReport.userId;
        const month = balanceSheetReport.month;
        const year = balanceSheetReport.year;
        const user = await BusinessLoader.userBusiness.get(userId);
        if (!user || !user.permission || !user.permission.product)
            throw new ErrorCommon(102, 'User');
        const productId = user.permission.product;
        const product = await BusinessLoader.productBusiness.get(productId);
        if (!product)
            throw new ErrorCommon(102, 'User');
        let crunchPrefix = GoogleStorageHelper.getBalanceSheetPrefix(user._id, product.code, year.toString());
        fileCreate.prefix = crunchPrefix;
        fileCreate.productCode = product.code,
        fileCreate.userId = userId;
        const newFileName = `balance-sheet_${month}_${year}`;
        const file = await BusinessLoader.fileBusiness.create(fileCreate, newFileName);
        if (!file)
            throw new ErrorCommon(102, 'File');

        return await this.balanceSheetReportRepository.update(balanceSheetReport._id, {csv: file._id});
    }

    async getReport(userId: string, month: number, year: number): Promise<BalanceSheetReport | null> {
        const query = {
            userId,
            month,
            year
        };
        const populate = [{
            path: 'csv',
            select: 'url'
        }];

        const report = await this.balanceSheetReportRepository.findOne({query, populate});
        return report && new BalanceSheetReport(report);
    }
}

Object.seal(BalanceSheetReportBusiness);
export default BalanceSheetReportBusiness;
