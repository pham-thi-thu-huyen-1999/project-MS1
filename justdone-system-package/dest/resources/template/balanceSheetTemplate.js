"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const balanceSheetTemplate = {
    name: 'balance sheet',
    type: 1,
    items: [
        {
            code: 1000,
            name: 'Asset',
            items: [
                {
                    code: 1100,
                    name: 'Current Asset'
                },
                {
                    code: 1200,
                    name: 'Non Current Asset',
                    items: [
                        {
                            code: 1201,
                            name: 'Pooled Asset'
                        }, {
                            code: 1202,
                            name: 'Mercedes-Benz'
                        },
                        {
                            code: 1203,
                            name: 'Borrowing Cost'
                        }
                    ]
                }
            ]
        }, {
            code: 2000,
            name: 'Liabilities',
            items: [
                {
                    code: 2100,
                    name: 'Current Liabilities',
                    items: [
                        {
                            code: 2101,
                            name: 'Credit Cards'
                        }, {
                            code: 2102,
                            name: 'GST Liabilities'
                        }, {
                            code: 2103,
                            name: 'Payroll Liabilities'
                        }, {
                            code: 2104,
                            name: 'ATO RBA'
                        }
                    ]
                },
                {
                    code: 2200,
                    name: 'Non Current Liabilities',
                    items: [{
                            code: 2201,
                            name: 'Other Loan'
                        },
                        {
                            code: 2202,
                            name: 'MB Financial - Mercedes Benz'
                        }
                    ]
                }
            ]
        }, {
            code: 2300,
            name: 'Equity'
        }
    ]
};
exports.default = balanceSheetTemplate;
