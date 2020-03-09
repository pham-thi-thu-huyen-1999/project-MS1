class TemplateBalanceSheetCsv {
    csvContent :string;
    
    constructor(data: {user: any, templateData: any[], years: any}) {
        this.csvContent = '';
        const templateData = data.templateData ? data.templateData : [];
        const user = data.user;
        const year = data.years.year;
        const month = data.years.month
        this.csvContent += this.generateHeader(user.fullName, user.businessInfo.abnCode, year, month);
        // console.log('======================');
        // console.log(years.month);
        this.csvContent += this.renderContent(templateData);
    }

    //render csv
    renderCsvContent() {
        return this.csvContent;
    }
    generateHeader(fullName:string, abnCode: string, month: number, year: number) {
        
        let header = `,,Profit And Loss,\n`;
        header += `,,${fullName},\n`;
        header += `,,ABN: ${abnCode},\n`;
        header += `,,As of "${this.converMonthToWord(month)} ${this.converMonthToWord(year)}",\n`
        header += `,,,\n`;
        header += `,,,\n`;
        return header;
    }
    renderContent(templateData) {
        let data = '';
        if(!templateData){
            return '';
        }
        
        else {
            if(templateData.asset) {
                data += this.renderAssetContent(templateData.asset);
            }
            if (templateData.liabilities) {
                data += this.renderLiabilities(templateData.liabilities);
            }
            if (templateData.netAssets) {
                data += this.renderNetAssetContent(templateData.netAssets);
            }
            if (templateData.equity) {
                data += this.renderEquityContent(templateData.equity);
            }
        }
        return data;
    }
    renderAssetContent(items) {
        let data = '';
        const dataCoa = this.compareFilterCoa(items.currentAsset.dataCoa);
        const nameAsset = items.name;
        data += `"${nameAsset}",\n`;
        data += `"${items.currentAsset.name}",\n`;
        dataCoa.forEach(item => {
            let nameCoa = item.name;
            let totalCoa = item.total;
            data += `"${nameCoa}",,, "${totalCoa}",\n`;
        });
        if(items.currentAsset || items.nonCurrentAsset){
            data += `"${items.currentAsset.totalCurrentAsset.name}",,, ${items.currentAsset.totalCurrentAsset.total},\n`;
            data += `"${items.nonCurrentAsset.name}",\n`
        }
        return data;
    }
    renderLiabilities(items){
        let data = '';
        data += `"${items.name}", \n`;
        const dataCurrentLiabilities = items.currentLiabilities.data.filter(item => item.total !== 0 && item.total !== -0);
        dataCurrentLiabilities.forEach(item => {
            data += `"${item.name}", \n`;
            if(item.dataCoa.length) {
                let itemDataCoa = item.dataCoa;
                itemDataCoa.forEach(itemCoa => {
                    data += `"${itemCoa.name}",,, ${itemCoa.total}\n`
                });
            }
        });
        if (items.currentLiabilities.totalCurrentLiabilities || items.nonCurrentLiabilities) {
            data += `"${items.currentLiabilities.totalCurrentLiabilities.name}",,, ${items.currentLiabilities.totalCurrentLiabilities.total}\n`
            data += `"${items.nonCurrentLiabilities.name}"\n`;
            const dataNonCurrentLiabilities = items.nonCurrentLiabilities.data.filter(item => item.total !== 0 && item.total !== -0);
            console.log('------------------->>>>', dataNonCurrentLiabilities);
            dataNonCurrentLiabilities.forEach(item => {
                data += `"${item.name}"\n`;
                if(item.dataCoa.length) {
                    const itemDataCoa = item.dataCoa;
                    itemDataCoa.forEach(itemCoa => {
                        data += `"${itemCoa.name}",,, ${itemCoa.total}\n`;
                    });
                }
            });
            if (items.nonCurrentLiabilities.totalNonCurrentLiabilities || items.totalLiabilities) {
                data += `"${items.nonCurrentLiabilities.totalNonCurrentLiabilities.name}",,, ${items.nonCurrentLiabilities.totalNonCurrentLiabilities.total}\n`
                data += `"${items.totalLiabilities.name}",,, ${items.totalLiabilities.total}\n`
            }
        }
        return data;
    }
    renderNetAssetContent(items) {
        let data = '';
        data += `"${items.name}",,, ${items.totalNetAssets}\n`;
        return data;
    }
    renderEquityContent (items) {
        let data = '';
        data += `"${items.name}"\n`;
        if(items.dataCoa.length) {
            const dataEquity = items.dataCoa;
            dataEquity.forEach(itemCoa => {
                data += `"${itemCoa.name}",,, ${itemCoa.total}\n`;
            });
        }
        if (items.totalEquity) {
            data += `"${items.totalEquity.name}",,, ${items.totalEquity.total}\n`;
        }
        return data;
    }

    compareFilterCoa(arr: any){
        // let data = '';
        let tempArr = arr.filter(item => item.total !== 0 && item.total !== -0)
        let data:any = [];
        let newArr:any = [];

        tempArr.forEach((item: { name: string | number; total: string | number; }) => {
            item.name = item.name.toString()
            if(data[item.name] === undefined) {
                data[item.name] = item.total;
            } else {
                data[item.name] += item.total;
            }
        })
        for(const [key, value] of Object.entries(data)) {
            newArr = [...newArr, { name: key, total: value, type: {
            } } ];
        }
        return newArr.filter(item => item.total !== 0);
    }

    converMonthToWord(value) {
        let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return month[value - 1];
    }


}
export default TemplateBalanceSheetCsv;