"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProfitLossTemplate {
    constructor() {
        this.template = {
            name: 'Profit & Loss',
            type: 2,
            items: [
                {
                    code: 1000,
                    name: 'Income'
                }, {
                    code: 2000,
                    name: 'Cost of Sales'
                },
                {
                    code: 3000,
                    name: 'Expenses',
                    items: [
                        {
                            code: 3101,
                            name: 'General & Admin Expenses'
                        }, {
                            code: 3102,
                            name: 'Operating Expenses'
                        },
                        {
                            code: 3103,
                            name: 'Utility Expenses'
                        }, {
                            code: 3104,
                            name: 'Home Office Expenses'
                        }, {
                            code: 3105,
                            name: 'Motor Vehicle Expenses'
                        }, {
                            code: 3106,
                            name: 'Travel Expenses'
                        }, {
                            code: 3107,
                            name: 'Office/Factory Expenses'
                        }, {
                            code: 3108,
                            name: 'Employment Expenses'
                        }
                    ]
                }, {
                    code: 4000,
                    name: 'Other Income'
                }, {
                    code: 5000,
                    name: 'Other Expenses'
                }
            ]
        };
    }
    getTemplate() {
        return this.template;
    }
}
exports.default = ProfitLossTemplate;
