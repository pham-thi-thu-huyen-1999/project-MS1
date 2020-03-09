import IBaseBusiness from './base/IBaseBusiness';
import Accounting from 'justdone-system-package/dest/app/model/accounting/Accounting';
import AccountingCreate from 'justdone-system-package/dest/app/model/accounting/AccountingCreate'; // eslint-disable-line
import AccountingUpdate from 'justdone-system-package/dest/app/model/accounting/AccountingUpdate'; // eslint-disable-line
import AccountingHtml from 'justdone-system-package/dest/app/model/accounting/AccountingHtml'; // eslint-disable-line
import MonthlyAccountItem from 'justdone-system-package/dest/app/model/accounting/MonthlyAccountItem'; // eslint-disable-line
import BasQuarterAccountItem from 'justdone-system-package/dest/app/model/accounting/BasQuarterAccountItem'; // eslint-disable-line
import AccountingItem from 'justdone-system-package/dest/app/model/accounting/AccountingItem'; // eslint-disable-line
import File from 'justdone-system-package/dest/app/model/file/File'; // eslint-disable-line
import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate'; // eslint-disable-line

interface IAccountingBusiness extends IBaseBusiness<Accounting> {
    getAll: () => Promise<Accounting[]>;
    getAccountingByUser: (_id: string, beginYear: number, endYear: number) => Promise<Accounting | null>;
    getList: (page: number, limit: number) => Promise<Accounting[]>;
    getCount: () => Promise<number>;
    create: (data: AccountingCreate) => Promise<Accounting>;

    update: (_id: string, data: AccountingUpdate) => Promise<Accounting | null>;
    updateByFinanceYear: (userId: string, beginYear: number, endYear: number, data: AccountingUpdate) => Promise<Accounting | null>

    updateMonthlyAccountStatus: (_id: string, data: MonthlyAccountItem) => Promise<boolean>;
    updateAccounting: (_id: string, type: string, data: AccountingItem) => Promise<boolean>;

    uploadAccounting: (_id: string, type: string, productCode: number, file: FileCreate) => Promise<File | null>;
    uploadSignature: (_id: string, type: string, productCode: number, file: FileCreate, month?: number) => Promise<string | null>;
    submitSignature: (data: AccountingHtml, productCode: number) => Promise<string | null>;
    uploadMonthlyAccounting: (_id: string, month: number, productCode: number, file: FileCreate) => Promise<File | null>;
}

export default IAccountingBusiness;
