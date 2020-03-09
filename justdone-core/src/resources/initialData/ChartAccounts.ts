import ChartAccountCreate from 'justdone-system-package/dest/app/model/chartAccount/ChartAccountCreate';

export default function getChartAccounts(): {isRequired: boolean, data: ChartAccountCreate}[] {
    // let chartAccount:any = [{
    //     isRequired: true,
    //     data: {
    //         ...new ChartAccountCreate(<any>{
    //             groupId: '',
    //             userId: '5a16533fed0b673daf48ec09',
    //             code: '001',
    //             name: 'Test 1',
    //             searchTerm: '001-Test 1',
    //             description: 'description about coacode',
    //             country: 'VN',
    //             clients: [],
    //         })
    //     }
    // }];

    let chartAccounts = [{
        code: '1-0000',
        name: 'Assets',
        country: 'AU',
        searchTerm: '1-0000 assets'
    }, {
        code: '1-1000',
        name: 'Current Asset',
        country: 'AU',
        searchTerm: '1-1000 current asset'
    }, {
        code: '1-1100',
        name: 'Business Account',
        country: 'AU',
        searchTerm: '1-1100 business Account'
    }, {
        code: '1-1200',
        name: 'B Bank Account',
        country: 'AU',
        searchTerm: '1-1200 b bank account'
    }, {
        code: '1-1300',
        name: 'Payroll Cheque Account',
        country: 'AU',
        searchTerm: '1-1300 Payroll Cheque Account'
    }, {
        code: '1-2000',
        name: 'Non Current Asset',
        country: 'AU',
        searchTerm: '1-2000 non current asset'
    }, {
        code: '1-2100',
        name: 'Office Furniture - Equipment',
        country: 'AU',
        searchTerm: '1-2100 Office Furniture - Equipment'
    }, {
        code: '1-2110',
        name: 'Office Furniture - Equip Cost',
        country: 'AU',
        searchTerm: '1-2110 Office Furniture & Equip Cost'
    }, {
        code: '1-2120',
        name: 'Office Fur - Equip Accum Dpn',
        country: 'AU',
        searchTerm: '1-2120 Office Fur - Equip Accum Dpn'
    }, {
        code: '1-2200',
        name: 'Motor Vehicle',
        country: 'AU',
        searchTerm: '1-2200 Motor Vehicle'
    }, {
        code: '1-2210',
        name: 'MV cost',
        country: 'AU',
        searchTerm: '1-2210 MV cost'
    }, {
        code: '1-2220',
        name: 'MV Accum Dpn',
        country: 'AU',
        searchTerm: '1-2220 MV Accum Dpn'
    }, {
        code: '2-1000',
        name: 'Current Liabilities',
        country: 'AU',
        searchTerm: '2-1000 Current Liabilities'
    }, {
        code: '2-1100',
        name: 'Credit Card',
        country: 'AU',
        searchTerm: '2-1100 Credit Card'
    }, {
        code: '2-1110',
        name: 'Master Card',
        country: 'AU',
        searchTerm: '2-1110 Master Card'
    }, {
        code: '2-1120',
        name: 'VISA Card',
        country: 'AU',
        searchTerm: '2-1120 VISA Card'
    }, {
        code: '2-1200',
        name: 'GST Liabilities',
        country: 'AU',
        searchTerm: '2-1200 GST Liabilities'
    }, {
        code: '2-1210',
        name: 'GST Collected',
        country: 'AU',
        searchTerm: '2-1210 GST Collected'
    }, {
        code: '2-1230',
        name: 'GST Paid',
        country: 'AU',
        searchTerm: '2-1230 GST Paid'
    }, {
        code: '2-1300',
        name: 'Payroll Liabilities',
        country: 'AU',
        searchTerm: '2-1300 Payroll Liabilities'
    }, {
        code: '2-1310',
        name: 'PAYG Withholding Payable',
        country: 'AU',
        searchTerm: '2-1310 PAYG Withholding Payable'
    }, {
        code: '2-1320',
        name: 'Superannuation Payable',
        country: 'AU',
        searchTerm: '2-1320 Superannuation Payable'
    }, {
        code: '2-1330',
        name: 'PAYG Instalment',
        country: 'AU',
        searchTerm: '2-1330 PAYG Instalment'
    }, {
        code: '2-1400',
        name: 'ATO RBA',
        country: 'AU',
        searchTerm: '2-1400 ATO RBA'
    }, {
        code: '2-1410',
        name: 'ATO ITA',
        country: 'AU',
        searchTerm: '2-1410 ATO ITA'
    }, {
        code: '2-1420',
        name: 'ATO ICA',
        country: 'AU',
        searchTerm: '2-1420 ATO ICA'
    }, {
        code: '2-2000',
        name: 'Non Current Liabilities',
        country: 'AU',
        searchTerm: '2-2000 Non Current Liabilities'
    }, {
        code: '2-2100',
        name: 'Business Loan',
        country: 'AU',
        searchTerm: '2-2100 Business Loan'
    }, {
        code: '2-2200',
        name: 'Other Loan',
        country: 'AU',
        searchTerm: '2-2200 Other Loan'
    }, {
        code: '2-2300',
        name: 'HP/CM Repayment',
        country: 'AU',
        searchTerm: '2-2300 HP/CM Repayment'
    }, {
        code: '2-2310',
        name: 'HP/Chattle Repayment',
        country: 'AU',
        searchTerm: '2-2310 HP/Chattle Repayment'
    }, {
        code: '2-2320',
        name: 'Less Unexpired Interest',
        country: 'AU',
        searchTerm: '2-2320 Less Unexpired Interest'
    }, {
        code: '3-0000',
        name: 'Equity',
        country: 'AU',
        searchTerm: '3-0000 Equity'
    }, {
        code: '3-1100',
        name: 'Settled Sum',
        country: 'AU',
        searchTerm: '3-1100 Settled Sum'
    }, {
        code: '3-2000',
        name: 'Shareholders Equity',
        country: 'AU',
        searchTerm: '3-2000 Shareholders Equity'
    }, {
        code: '3-2100',
        name: 'Beneficiary 1 Drawings',
        country: 'AU',
        searchTerm: '3-2100 Beneficiary 1 Drawings'
    }, {
        code: '3-2200',
        name: 'Beneficiary 1 Profit Distrbution',
        country: 'AU',
        searchTerm: '3-2200 Beneficiary 1 Profit Distrbution'
    }, {
        code: '3-3000',
        name: 'Beneficiary 2',
        country: 'AU',
        searchTerm: '3-3000 Beneficiary 2'
    }, {
        code: '3-3100',
        name: 'Beneficiary 2 Drawings',
        country: 'AU',
        searchTerm: '3-3100 Beneficiary 2 Drawings'
    }, {
        code: '3-3200',
        name: 'Beneficiary 2 Profit Distribution',
        country: 'AU',
        searchTerm: '3-3200 Beneficiary 2 Profit Distribution'
    }, {
        code: '3-4000',
        name: 'Beneficiary 3',
        country: 'AU',
        searchTerm: '3-4000 Beneficiary 3'
    }, {
        code: '3-4100',
        name: 'Beneficiary 3 Drawings',
        country: 'AU',
        searchTerm: '3-4100 Beneficiary 3 Drawings'
    }, {
        code: '3-4200',
        name: 'Beneficiary 3 Profit Distribution',
        country: 'AU',
        searchTerm: '3-4200 Beneficiary 3 Profit Distribution'
    }, {
        code: '3-8000',
        name: 'Retained Earnings',
        country: 'AU',
        searchTerm: '3-8000 Retained Earnings'
    }, {
        code: '3-9000',
        name: 'Current Earnings',
        country: 'AU',
        searchTerm: '3-9000 Current Earnings'
    }, {
        code: '3-9999',
        name: 'Historical Balancing Accounts',
        country: 'AU',
        searchTerm: '3-9999 Historical Balancing Accounts'
    }, {
        code: '4-1000',
        name: 'Sales Income',
        country: 'AU',
        searchTerm: '4-1000 Sales Income'
    }, {
        code: '4-2000',
        name: 'Misc/Other Income',
        searchTerm: '4-2000 Misc/Other Income',
        country: 'AU'
    }, {
        code: '5-0000',
        name: 'Cost Of Sales',
        searchTerm: '5-0000 Cost Of Sales',
        country: 'AU'
    }, {
        code: '5-1000',
        name: 'Materials Supplies',
        searchTerm: '5-1000 Materials Supplies',
        country: 'AU'
    }, {
        code: '5-2000',
        name: 'Subcontractors with GST',
        searchTerm: '5-2000 Subcontractors with GST',
        country: 'AU'
    }, {
        code: '5-3000',
        name: 'Subcontractors with No GST',
        searchTerm: '5-3000 Subcontractors with No GST',
        country: 'AU'
    }, {
        code: '5-4000',
        name: 'Tools - Replacement',
        searchTerm: '5-4000 Tools - Replacement',
        country: 'AU'
    }, {
        code: '5-5000',
        name: 'Equiment Hire - Lease cost',
        searchTerm: '5-5000 Equiment Hire - Lease cost',
        country: 'AU'
    }, {
        code: '6-1000',
        name: 'General - Admin Expenses',
        searchTerm: '6-1000 General - Admin Expenses',
        country: 'AU'
    }, {
        code: '6-1100',
        name: 'Bank Fees',
        searchTerm: '6-1100 Bank Fees',
        country: 'AU'
    }, {
        code: '6-1110',
        name: 'Finance Charge',
        searchTerm: '6-1110 Finance Charge',
        country: 'AU'
    }, {
        code: '6-1120',
        name: 'Merchant Fees',
        searchTerm: '6-1120 Merchant Fees',
        country: 'AU'
    }, {
        code: '6-1200',
        name: 'Accounting Fees',
        searchTerm: '6-1200 Accounting Fees',
        country: 'AU'
    }, {
        code: '6-1300',
        name: 'Lawyers Fees',
        searchTerm: '6-1300 Lawyers Fees',
        country: 'AU'
    }, {
        code: '6-1400',
        name: 'Consulting Fees',
        searchTerm: '6-1400 Consulting Fees',
        country: 'AU'
    }, {
        code: '6-1410',
        name: 'Professional Fees',
        searchTerm: '6-1410 Professional Fees',
        country: 'AU'
    }, {
        code: '6-1450',
        name: 'Debt Collection Fees',
        searchTerm: '6-1450 Debt Collection Fees',
        country: 'AU'
    }, {
        code: '6-1500',
        name: 'Office Supplies',
        searchTerm: '6-1500 Office Supplies',
        country: 'AU'
    }, {
        code: '6-1600',
        name: 'Postage - Delivery Fees',
        searchTerm: '6-1600 Postage - Delivery Fees',
        country: 'AU'
    }, {
        code: '6-1700',
        name: 'Depreciation Expenses',
        searchTerm: '6-1700 Depreciation Expenses',
        country: 'AU'
    }, {
        code: '6-1800',
        name: 'Amortisation Expenses',
        searchTerm: '6-1800 Amortisation Expenses',
        country: 'AU'
    }, {
        code: '6-1900',
        name: 'Fine - Penalties',
        searchTerm: '6-1900 Fine - Penalties',
        country: 'AU'
    }, {
        code: '6-1910',
        name: 'License - Subscriptions Exp',
        searchTerm: '6-1910 License - Subscriptions Exp',
        country: 'AU'
    }, {
        code: '6-1920',
        name: 'ASIC Fees/Filing fees',
        searchTerm: '6-1920 ASIC Fees/Filing fees',
        country: 'AU'
    }, {
        code: '6-1990',
        name: 'Donation',
        searchTerm: '6-1990 Donation',
        country: 'AU'
    }, {
        code: '6-2000',
        name: 'Operating Expenses',
        searchTerm: '6-2000 Operating Expenses',
        country: 'AU'
    }, {
        code: '6-2100',
        name: 'Marketing - Advertising Expen',
        searchTerm: '6-2100 Marketing - Advertising Expen',
        country: 'AU'
    }, {
        code: '6-2200',
        name: 'Mobile Phone Expenses',
        searchTerm: '6-2200 Mobile Phone Expenses',
        country: 'AU'
    }, {
        code: '6-2300',
        name: 'Internet Expenses',
        searchTerm: '6-2300 Internet Expenses',
        country: 'AU'
    }, {
        code: '6-2400',
        name: 'Repairs - Maintenance Exp',
        searchTerm: '6-2400 Repairs - Maintenance Exp',
        country: 'AU'
    }, {
        code: '6-2500',
        name: 'Protective Clothings Exp',
        searchTerm: '6-2500 Protective Clothings Exp',
        country: 'AU'
    }, {
        code: '6-2600',
        name: 'Business Insurance',
        searchTerm: '6-2600 Business Insurance',
        country: 'AU'
    }, {
        code: '6-2700',
        name: 'Telephone (Land Line)',
        searchTerm: '6-2700 Telephone (Land Line)',
        country: 'AU'
    }, {
        code: '6-2800',
        name: 'Travel Expenses',
        searchTerm: '6-2800 Travel Expenses',
        country: 'AU'
    }, {
        code: '6-2900',
        name: 'Waste Removal Expenses',
        searchTerm: '6-2900 Waste Removal Expenses',
        country: 'AU'
    }, {
        code: '6-3000',
        name: 'Utility Expenses',
        searchTerm: '6-3000 Utility Expenses',
        country: 'AU'
    }, {
        code: '6-3100',
        name: 'Office or Factory Rental Fees',
        searchTerm: '6-3100 Office or Factory Rental Fees',
        country: 'AU'
    }, {
        code: '6-3200',
        name: 'Electricity - Gas Exp',
        searchTerm: '6-3200 Electricity - Gas Exp',
        country: 'AU'
    }, {
        code: '6-3300',
        name: 'Rate - Water',
        searchTerm: '6-3300 Rate - Water',
        country: 'AU'
    }, {
        code: '6-4000',
        name: 'Motor Vehicle Expenses',
        searchTerm: '6-4000 Motor Vehicle Expenses',
        country: 'AU'
    }, {
        code: '6-4100',
        name: 'A-MV Expenses',
        searchTerm: '6-4100 A-MV Expenses',
        country: 'AU'
    }, {
        code: '6-4110',
        name: 'A MV Rego',
        searchTerm: '6-4110 A MV Rego',
        country: 'AU'
    }, {
        code: '6-4120',
        name: 'A MV Insurance',
        searchTerm: '6-4120 A MV Insurance',
        country: 'AU'
    }, {
        code: '6-4130',
        name: 'A MV Fuel, Toll - Parking',
        searchTerm: '6-4130 A MV Fuel, Toll - Parking',
        country: 'AU'
    }, {
        code: '6-4140',
        name: 'A MV Repairs - Maintenance',
        searchTerm: '6-4140 A MV Repairs - Maintenance',
        country: 'AU'
    }, {
        code: '6-4200',
        name: 'Other MV (Excavator, Bobcat)',
        searchTerm: '6-4200 Other MV (Excavator, Bobcat)',
        country: 'AU'
    }, {
        code: '6-4210',
        name: 'Other MV Rego',
        searchTerm: '6-4210 Other MV Rego',
        country: 'AU'
    }, {
        code: '6-4220',
        name: 'Other MV Insurance',
        searchTerm: '6-4220 Other MV Insurance',
        country: 'AU'
    }, {
        code: '6-4230',
        name: 'Other MV Fuel, Toll',
        searchTerm: '6-4230 Other MV Fuel, Toll',
        country: 'AU'
    }, {
        code: '6-4240',
        name: 'Other MV Reparis - Maintenance',
        searchTerm: '6-4240 Other MV Reparis - Maintenance',
        country: 'AU'
    }, {
        code: '6-5000',
        name: 'Employment Expenses',
        searchTerm: '6-5000 Employment Expenses',
        country: 'AU'
    }, {
        code: '6-5100',
        name: 'Wages - Salaries',
        searchTerm: '6-5100 Wages - Salaries',
        country: 'AU'
    }, {
        code: '6-5200',
        name: 'Superannuation Expenses',
        searchTerm: '6-5200 Superannuation Expenses',
        country: 'AU'
    }, {
        code: '6-5400',
        name: 'Employee Expenses',
        searchTerm: '6-5400 Employee Expenses',
        country: 'AU'
    }, {
        code: '6-5500',
        name: 'Staff Amenities',
        searchTerm: '6-5500 Staff Amenities',
        country: 'AU'
    }, {
        code: '6-5600',
        name: 'Workers Compensation',
        searchTerm: '6-5600 Workers Compensation',
        country: 'AU'
    }, {
        code: '8-0000',
        name: 'Other Income',
        searchTerm: '8-0000 Other Income',
        country: 'AU'
    }, {
        code: '8-1000',
        name: 'Interest income',
        searchTerm: '8-1000 Interest income',
        country: 'AU'
    }, {
        code: '9-0000',
        name: 'Other Expenses',
        searchTerm: '9-0000 Other Expenses',
        country: 'AU'
    }, {
        code: '9-1000',
        name: 'Interest expense',
        searchTerm: '9-1000 Interest expense',
        country: 'AU'
    },
    // {
    //     code: '9-1001',
    //     name: 'Material Supplies',
    //     searchTerm: '9-1000 Material Supplies',
    //     country: 'AU'
    // }, {
    //     code: '9-1002',
    //     name: 'Subcontractors registered for GST',
    //     searchTerm: '9-1000 Subcontractors registered for GST',
    //     country: 'AU'
    // }, {
    //     code: '9-1003',
    //     name: 'Bank Fees & Charges',
    //     searchTerm: '9-1000 Bank Fees & Charges',
    //     country: 'AU'
    // }, {
    //     code: '9-1005',
    //     name: 'MV - Repairs',
    //     searchTerm: '9-1000 MV - Repairs',
    //     country: 'AU'
    // }, {
    //     code: '9-1006',
    //     name: 'MV - Fuel',
    //     searchTerm: '9-1000 MV - Fuel',
    //     country: 'AU'
    // }, {
    //     code: '9-1007',
    //     name: 'MV - Insurance',
    //     searchTerm: '9-1000 MV - Insurance',
    //     country: 'AU'
    // }, {
    //     code: '9-1008',
    //     name: 'MV - Tolls & Parking',
    //     searchTerm: '9-1000 MV - Tolls & Parking',
    //     country: 'AU'
    // }, {
    //     code: '9-1009',
    //     name: 'MV - Registration',
    //     searchTerm: '9-1000 MV - Registration',
    //     country: 'AU'
    // }, {
    //     code: '9-1010',
    //     name: 'Waste Removal and Cleaning',
    //     searchTerm: '9-1000 Waste Removal and Cleaning',
    //     country: 'AU'
    // }, {
    //     code: '9-1011',
    //     name: 'Net Wages Paid',
    //     searchTerm: '9-1000 Net Wages Paid',
    //     country: 'AU'
    // }
    ];

    return chartAccounts.map(coa => ({
        isRequired: true,
        data: new ChartAccountCreate(
            <any>{
                code: coa.code,
                name: coa.name,
                country: coa.country,
                searchTerm: coa.searchTerm
            }
        )
    }));
}
