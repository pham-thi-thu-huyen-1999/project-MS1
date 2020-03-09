import IBaseBusiness from './base/IBaseBusiness';
import Receipt from 'justdone-system-package/dest/app/model/receipt/Receipt'; // eslint-disable-line
import ReceiptCreate from 'justdone-system-package/dest/app/model/receipt/ReceiptCreate'; // eslint-disable-line
import ReceiptUpdate from 'justdone-system-package/dest/app/model/receipt/ReceiptUpdate'; // eslint-disable-line
import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate'; // eslint-disable-line
import FileUpdate from 'justdone-system-package/dest/app/model/file/FileUpdate'; // eslint-disable-line

interface IReceiptBusiness extends IBaseBusiness<Receipt> {
    getList: (userId: string, managerId: string, location: string, beginYear: number, endYear: number, beginMonth: number, endMonth: number, page: number, limit: number) => Promise<Receipt[]>;
    getListByMonthAndYearFinance: (userId: string, managerId: string, location: string, month: number, year: number, page: number, limit: number) => Promise<any>;
    getCountByMonthAndYearFinance: (userId: string, month: number, year: number) => Promise<number>;
    getTotalCashReceipts: (month: number, year: number) => Promise<any>;
    getCount: () => Promise<number>;
    create: (data: ReceiptCreate) => Promise<Receipt>;
    update: (_id: string, data: ReceiptUpdate) => Promise<Receipt | null>;
    uploadFile: (data: FileCreate, productCode: number) => Promise<any>;
}

export default IReceiptBusiness;
