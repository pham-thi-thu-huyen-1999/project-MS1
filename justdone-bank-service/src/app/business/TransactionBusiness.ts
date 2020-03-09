import Transaction from 'justdone-system-package/dest/app/model/transaction/Transaction';
import TransactionUpdate from 'justdone-system-package/dest/app/model/transaction/TransactionUpdate';// eslint-disable-line
import TransactionCreate from 'justdone-system-package/dest/app/model/transaction/TransactionCreate'; // eslint-disable-line
import ITransactionBusiness from './interfaces/ITransactionBusiness'; // eslint-disable-line
import TransactionRepository from 'justdone-system-package/dest/app/repository/TransactionRepository';
import ExtendFilterRepository from 'justdone-system-package/dest/app/repository/ExtendFilterRepository';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import {BankType, CrunchType} from 'justdone-system-package/dest/app/model/common/CommonType'; // eslint-disable-line

class TransactionBusiness implements ITransactionBusiness {
    private transactionRepository: TransactionRepository;
    private extendFilterRepository: ExtendFilterRepository;

    constructor() {
        this.transactionRepository = new TransactionRepository();
        this.extendFilterRepository = new ExtendFilterRepository();
    }

    async getList(page: number, limit: number): Promise<Transaction[]> {
        let transactions = await this.transactionRepository.find(null, null, page, limit);
        return Transaction.parseArray(transactions);
    }

    async get(_id: string): Promise<Transaction | null> {
        if (!_id)
            return null;

        let statement = await this.transactionRepository.get(_id);
        return statement && new Transaction(statement);
    }

    async create(data: TransactionCreate): Promise<Transaction> {
        let statement;
        statement = await this.transactionRepository.create(data);

        return statement && new Transaction(statement);
    }

    async createTransactions(data: TransactionCreate[]): Promise<Transaction[]> {
        let result: any = [];
        let index: number = 0;
        do {
            let transaction = await this.transactionRepository.create(data[index]);
            if (transaction)
                result.push(transaction);
            index += 1;
        } while (index < data.length);

        return result;
    }

    async update(_id: string, data: TransactionUpdate): Promise<boolean> {
        return await this.transactionRepository.update(_id, data);
    }

    async getTransactionsByMonth(userId: string, accountId: string, type: BankType, month: number, year: number): Promise<Transaction[]> {
        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                month: month,
                year: year,
                type: type,
                accountId: accountId
            }};
        let transactions = await this.transactionRepository.findAll(params, {date: -1, index: -1});
        return Transaction.parseArray(transactions);
    }

    async getTransactionOldest(userId:string, type:BankType):Promise<Transaction | null> {
        console.log(userId);
        let params = {
            query: {
                userId: DataHelper.toObjectId(userId),
                type: type,
            }
        };
        let transaction = await this.extendFilterRepository.find(params, {year: 1, month: 1}, 1, 1);
        return transaction.length > 0 ? new Transaction(transaction[0]) : null;
    }

    async undeleteTransaction(transactionId: string) {
        console.log('undelete transactionId ====>', transactionId);
        await this.transactionRepository.findOneAndUpdate({transactionId: transactionId}, {deletedAt: null});
        return true;
    }

    async delete(_id: string): Promise<boolean> {
        return await this.transactionRepository.delete(_id);
    }

    async deleteByTransactionId(transactionId: string): Promise<boolean> {
        console.log('delete transaction with id : ', transactionId);
        await this.transactionRepository.findOneAndUpdate({transactionId: transactionId}, {deletedAt: new Date()});
        return true;
    }

    async markTransactionFixDuplicate(_id: string): Promise<boolean> {
        return this.transactionRepository.update(_id, {duplicateId: '1111', isWarningDuplicate: true});
    }

    async createTransactionFixData() {
        let test = {
            'id': 'eab9a073-a536-4908-b0b4-221da4879a21',
            'userId': '81a31fb6-72dd-4179-b5e3-f726ce7a552f',
            'date': 'May 2017',
            'type': 'bank',
            'default': [],
            'expenses': [
                {
                    'date': '2017-05-31T00:00:00.000Z',
                    'title': 'FEE ACCOUNT 083629 265531026  FEES',
                    'debit': 10,
                    'credit': 0,
                    'balance': 3960.99,
                    'transactionId': '544209020',
                    '_id': '5966b803cd7957001b6b9fc1',
                    'code': {
                        'priority': 8,
                        'name': 'Bank Fees & Charges',
                        'code': '6-1300',
                        'total': -10
                    },
                    'selectedCoaCode': {
                        'searchTerm': ''
                    }
                },
                {
                    'date': '2017-05-29T00:00:00.000Z',
                    'title': 'EFTPOS 29/05 16:56 W B HUNTER  EFTPOS DEBIT',
                    'debit': 121,
                    'credit': 0,
                    'balance': 3970.99,
                    'transactionId': '543494532',
                    '_id': '5966b803cd7957001b6b9fc2',
                    'code': {
                        'priority': 0,
                        'name': 'Material Supplies',
                        'code': '5-1000',
                        'total': -814.9300000000001
                    },
                    'selectedCoaCode': {
                        'searchTerm': ''
                    }
                },
                {
                    'date': '2017-05-26T00:00:00.000Z',
                    'title': '48319959 FRESH NUMBERS  AUTOMATIC DRAWING',
                    'debit': 192.5,
                    'credit': 0,
                    'balance': 4091.99,
                    'transactionId': '540363640',
                    '_id': '5966b803cd7957001b6b9fc3',
                    'code': {
                        'priority': 5,
                        'name': 'Accounting Fees',
                        'code': '6-1000',
                        'total': -577.5
                    },
                    'selectedCoaCode': {
                        'searchTerm': ''
                    }
                },
                {
                    'date': '2017-05-25T00:00:00.000Z',
                    'title': 'EFTPOS 25/05 16:42 W B HUNTER PTY LTD  EFTPOS DEBIT',
                    'debit': 85.5,
                    'credit': 0,
                    'balance': 4284.49,
                    'transactionId': '540363644',
                    '_id': '5966b803cd7957001b6b9fc4',
                    'code': {
                        'priority': 0,
                        'name': 'Material Supplies',
                        'code': '5-1000',
                        'total': -814.9300000000001
                    },
                    'selectedCoaCode': {
                        'searchTerm': ''
                    }
                },
                {
                    'date': '2017-05-23T00:00:00.000Z',
                    'title': 'EFTPOS 23/05 11:49 TIMBER BUILDING SUPP  EFTPOS DEBIT',
                    'debit': 96.23,
                    'credit': 0,
                    'balance': 4369.99,
                    'transactionId': '540363652',
                    '_id': '5966b803cd7957001b6b9fc5',
                    'code': {
                        'priority': 0,
                        'name': 'Material Supplies',
                        'code': '5-1000',
                        'total': -814.9300000000001
                    },
                    'selectedCoaCode': {
                        'searchTerm': ''
                    }
                },
                {
                    'date': '2017-05-23T00:00:00.000Z',
                    'title': 'EFTPOS 23/05 12:04 W B HUNTER PTY LTD  EFTPOS DEBIT',
                    'debit': 22,
                    'credit': 0,
                    'balance': 4466.22,
                    'transactionId': '540363648',
                    '_id': '5966b803cd7957001b6b9fc6',
                    'code': {
                        'priority': 0,
                        'name': 'Material Supplies',
                        'code': '5-1000',
                        'total': -814.9300000000001
                    },
                    'selectedCoaCode': {
                        'searchTerm': ''
                    }
                },
                {
                    'date': '2017-05-22T00:00:00.000Z',
                    'title': 'EFTPOS 22/05 10:44 W B HUNTER PTY LTD  EFTPOS DEBIT',
                    'debit': 135,
                    'credit': 0,
                    'balance': 4488.22,
                    'transactionId': '540363656',
                    '_id': '5966b803cd7957001b6b9fc7',
                    'code': {
                        'priority': 0,
                        'name': 'Material Supplies',
                        'code': '5-1000',
                        'total': -814.9300000000001
                    },
                    'selectedCoaCode': {
                        'searchTerm': ''
                    }
                },
                {
                    'date': '2017-05-19T00:00:00.000Z',
                    'title': '47653691 FRESH NUMBERS  AUTOMATIC DRAWING',
                    'debit': 192.5,
                    'credit': 0,
                    'balance': 4623.22,
                    'transactionId': '540363660',
                    '_id': '5966b803cd7957001b6b9fc8',
                    'code': {
                        'priority': 5,
                        'name': 'Accounting Fees',
                        'code': '6-1000',
                        'total': -577.5
                    },
                    'selectedCoaCode': {
                        'searchTerm': ''
                    }
                },
                {
                    'date': '2017-05-17T00:00:00.000Z',
                    'title': 'EFTPOS 17/05 10:36 W B HUNTER PTY LTD  EFTPOS DEBIT',
                    'debit': 139,
                    'credit': 0,
                    'balance': 4815.72,
                    'transactionId': '540363664',
                    '_id': '5966b803cd7957001b6b9fc9',
                    'code': {
                        'priority': 0,
                        'name': 'Material Supplies',
                        'code': '5-1000',
                        'total': -814.9300000000001
                    },
                    'selectedCoaCode': {
                        'searchTerm': ''
                    }
                },
                {
                    'date': '2017-05-15T00:00:00.000Z',
                    'title': 'EFTPOS 15/05 12:25 W B HUNTER PTY LTD  EFTPOS DEBIT',
                    'debit': 216.2,
                    'credit': 0,
                    'balance': 10551.3,
                    'transactionId': '540363668',
                    '_id': '5966b803cd7957001b6b9fcb',
                    'code': {
                        'priority': 0,
                        'name': 'Material Supplies',
                        'code': '5-1000',
                        'total': -814.9300000000001
                    },
                    'selectedCoaCode': {
                        'searchTerm': ''
                    }
                },
                {
                    'date': '2017-05-12T00:00:00.000Z',
                    'title': '46898010 FRESH NUMBERS  AUTOMATIC DRAWING',
                    'debit': 192.5,
                    'credit': 0,
                    'balance': 10767.5,
                    'transactionId': '540363684',
                    '_id': '5966b803cd7957001b6b9fcc',
                    'code': {
                        'priority': 5,
                        'name': 'Accounting Fees',
                        'code': '6-1000',
                        'total': -577.5
                    },
                    'selectedCoaCode': {
                        'searchTerm': ''
                    }
                }
            ],
            'drawings': [
                {
                    'date': '2017-05-15T00:00:00.000Z',
                    'title': 'MISCELLANEOUS DEBIT',
                    'debit': 5596.58,
                    'credit': 0,
                    'balance': 4954.72,
                    'transactionId': '540363672',
                    '_id': '5966b803cd7957001b6b9fca'
                }
            ],
            'income': [
                {
                    'date': '2017-05-12T00:00:00.000Z',
                    'title': 'EDWARDS  DEPOSIT  Ref. #0000001',
                    'debit': 0,
                    'credit': 3560,
                    'balance': 3560,
                    'transactionId': '540363680',
                    '_id': '5966b803cd7957001b6b9fcd'
                },
                {
                    'date': '2017-05-12T00:00:00.000Z',
                    'title': 'john mcgowan concr NIGEL VAN DER VE  INTER-BANK CREDIT',
                    'debit': 0,
                    'credit': 7400,
                    'balance': 10960,
                    'transactionId': '540363676',
                    '_id': '5966b803cd7957001b6b9fce'
                }
            ],
            'other': [],
            'url': 'invoicePDF/crunch-eab9a073-a536-4908-b0b4-221da4879a21.pdf',
            'openingBalance': 1778.2999999999945,
            'total': {
                'expenses': {
                    'total': -1402.43,
                    'code': [
                        {
                            'priority': 8,
                            'name': 'Bank Fees & Charges',
                            'code': '6-1300',
                            'total': -10
                        },
                        {
                            'priority': 0,
                            'name': 'Material Supplies',
                            'code': '5-1000',
                            'total': -814.9300000000001
                        },
                        {
                            'priority': 5,
                            'name': 'Accounting Fees',
                            'code': '6-1000',
                            'total': -577.5
                        }
                    ]
                },
                'drawings': {
                    'total': -5596.58,
                    'code': []
                },
                'income': {
                    'total': 10960,
                    'code': []
                },
                'other': {
                    'total': 0,
                    'code': []
                }
            }
        };
        let expenses:any = test.expenses;
        let drawings:any = test.drawings;
        let income:any = test.income;
        income = income.map(item => {
            let transaction = new TransactionCreate(<any>{
                amount: {
                    amount: item.credit ? item.credit : item.debit,
                    currency: 'AUD'
                },
                accountId: 11899283,
                baseType: item.debit ? 'DEBIT' : 'CREDIT',
                category: 'Uncategorized',
                categoryType: 'UNCATEGORIZE',
                categoryId: 24,
                categorySource: 'fixData',
                description: {
                    original: item.title
                },
                date: item.date,
                highLevelCategoryId: 100000000,
                isManual: false,
                postDate: item.date,
                runningBalance: {
                    currency: 'AUD',
                    amount: item.balance
                },
                status: 'POSTED',
                transactionId: item.transactionId,
                userId: '5a33385d02a57c2d5b5cbca4',
                type: 1,
                month: 5,
                year: 2017,
                typeCrunch: CrunchType.Income
            });
            return transaction;
        });
        drawings = drawings.map(item => {
            let transaction = new TransactionCreate(<any>{
                amount: {
                    amount: item.credit ? item.credit : item.debit,
                    currency: 'AUD'
                },
                accountId: 11899283,
                baseType: item.debit ? 'DEBIT' : 'CREDIT',
                category: 'Uncategorized',
                categoryType: 'UNCATEGORIZE',
                categoryId: 24,
                categorySource: 'fixData',
                description: {
                    original: item.title
                },
                date: item.date,
                highLevelCategoryId: 100000000,
                isManual: false,
                postDate: item.date,
                runningBalance: {
                    currency: 'AUD',
                    amount: item.balance
                },
                status: 'POSTED',
                transactionId: item.transactionId,
                userId: '5a33385d02a57c2d5b5cbca4',
                type: 1,
                month: 5,
                year: 2017,
                typeCrunch: CrunchType.Drawings
            });
            return transaction;
        });
        expenses = expenses.map(item => {
            let transaction = new TransactionCreate(<any>{
                amount: {
                    amount: item.credit ? item.credit : item.debit,
                    currency: 'AUD'
                },
                accountId: 11899283,
                baseType: item.debit ? 'DEBIT' : 'CREDIT',
                category: 'Uncategorized',
                categoryType: 'UNCATEGORIZE',
                categoryId: 24,
                categorySource: 'fixData',
                description: {
                    original: item.title
                },
                date: item.date,
                highLevelCategoryId: 100000000,
                isManual: false,
                postDate: item.date,
                runningBalance: {
                    currency: 'AUD',
                    amount: item.balance
                },
                status: 'POSTED',
                transactionId: item.transactionId,
                userId: '5a33385d02a57c2d5b5cbca4',
                type: 1,
                month: 5,
                year: 2017,
                typeCrunch: CrunchType.Expenses
            });
            return transaction;
        });
        await this.createList(expenses);
        await this.createList(income);
        await this.createList(drawings);
    }

    async createList(data: Transaction[]): Promise<void> {
        let index: number = 0;
        do {
            await this.transactionRepository.create(data[index]);
            index += 1;
        } while (index < data.length);
    }
}

Object.seal(TransactionBusiness);
export default TransactionBusiness;
