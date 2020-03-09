import AccountingCreate from 'justdone-system-package/dest/app/model/accounting/AccountingCreate';

export default function getAccountings(): {isRequired: boolean, data: any}[] {
    return [
        {isRequired: true, data: <AccountingCreate>{
            userId: '',
            beginYear: 2017,
            endYear: 2018,
            monthlyAccounts: [
                {month: 8, status: 4},
                {month: 9, status: 1},
                {month: 7, status: 2},
                {month: 6, status: 2},
                {month: 5, status: 2},
                {month: 4, status: 2},
                {month: 3, status: 2},
                {month: 2, status: 2},
                {month: 1, status: 2},
                {month: 10, status: 2},
                {month: 11, status: 2},
                {month: 12, status: 2}
            ],
            profitLoss: {
                status: 6,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            balanceSheet: {
                status: 5,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            basQuarter: true,
            basQuarter1: {
                status: 7,
                beginMonth: 7,
                endMonth: 9,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            basQuarter2: {
                status: 1,
                beginMonth: 10,
                endMonth: 12,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            basQuarter3: {
                status: 8,
                beginMonth: 1,
                endMonth: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            basQuarter4: {
                status: 9,
                beginMonth: 4,
                endMonth: 6,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            taxReturn: {
                status: 12,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            annualReport: {
                status: 11,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        }},
    ];
}
