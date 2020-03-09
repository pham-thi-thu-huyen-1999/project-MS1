export default class ReportService {
    constructor(axios) {
        this.axios = axios;
    }

    getFinancialList(userId, beginYear) {
        return this.axios.get(`/api/report/balance-sheet-csv?userId=${userId}&beginYear=${beginYear}`);
    }

    getCrunchCompleted(userId, beginMonth, beginYear, endMonth, endYear) {
        return this.axios.get(`/api/report/crunch-completed?userId=${userId}&beginMonth=${beginMonth || 7}&beginYear=${beginYear}&endMonth=${endMonth || 6}&endYear=${endYear}`);
    }

    getProductStatistics() {
        return this.axios.get(`/api/analytic/product-statistics`);
    }

    getlistNotcruncher(productCode, page, limit) {
        return this.axios.get(`/api/analytic/users-not-crunched?productCodes=${productCode}&page=${page}&limit=${limit}`);
    }

    getListCompleteCruncher(productCode, page, limit) {
        return this.axios.get(`/api/analytic/users-crunch-completed?productCodes=${productCode}&page=${page}&limit=${limit}`);
    }

    getList(userId, beginDate, endDate) {
        return this.axios.get(`/api/report/report-available?userId=${userId}&beginMonth=${beginDate.month}&beginYear=${beginDate.year}&endMonth=${endDate.month}&endYear=${endDate.year}`);
    }

    exportCruncherPDF(userId, productCode, accountId, type, month, year) {
        return this.axios.get(`/api/report/crunch-file?productCode=${productCode}&userId=${userId}&accountId=${accountId}&type=${type}&month=${month}&year=${year}`);
    }

    exportCruncherYearPDF(userId, productCode, accountId, type, year) {
        return this.axios.get(`/api/report/crunch-year?productCode=${productCode}&userId=${userId}&accountId=${accountId}&type=${type}&year=${year}`);
    }

    exportCruncherCSV(userId, productCode, accountId, type, month, year) {
        return this.axios.get(`/api/report/crunch-csv?productCode=${productCode}&userId=${userId}&accountId=${accountId}&type=${type}&month=${month}&year=${year}`);
    }

    exportCruncherYearCSV(userId, productCode, accountId, type, year) {
        return this.axios.get(`/api/report/crunchyear-csv?productCode=${productCode}&userId=${userId}&accountId=${accountId}&type=${type}&year=${year}`);
    }

    exportDataReportPDF(data) {
        return this.axios.post(`/api/report/data-report-pdf`, data);
    }

    exportDataReportCSV(data) {
        return this.axios.post(`/api/report/data-report-csv`, data);
    }

    previewFinancial(type, userId, managerId, beginMonth, beginYear, endMonth, endYear) {
        return this.axios.get(`/api/report/export-financial-preview?type=${type}&userId=${userId}&managerId=${managerId}&beginMonth=${beginMonth}&beginYear=${beginYear}&endMonth=${endMonth}&endYear=${endYear}`);
    }

    exportFinancial(type, userId, managerId, beginMonth, beginYear, endMonth, endYear) {
        return this.axios.get(`/api/report/export-financial?type=${type}&userId=${userId}&managerId=${managerId}&beginMonth=${beginMonth}&beginYear=${beginYear}&endMonth=${endMonth}&endYear=${endYear}`);
    }

    exportFinancialCSV(type, userId, managerId, beginMonth, beginYear, endMonth, endYear) {
        return this.axios.get(`/api/report/csv-financial?type=${type}&userId=${userId}&managerId=${managerId}&beginMonth=${beginMonth}&beginYear=${beginYear}&endMonth=${endMonth}&endYear=${endYear}`);
    }

    exportBalanceSheet(clientId, userId, month, year) {
        return this.axios.get(`/api/report/balance-sheet-pdf?userId=${clientId}&originId=${userId}&month=${month}&year=${year}`);
    }

    exportBalanceSheetCsv(clientId, userId, month, year) {
        return this.axios.get(`/api/report/balance-sheet-export-csv?userId=${clientId}&originId=${userId}&month=${month}&year=${year}`);
    }

    previewBalanceSheet(clientId, userId, month, year) {
        return this.axios.get(`/api/report/balance-sheet-preview?userId=${clientId}&originId=${userId}&month=${month}&year=${year}`);
    }

    uploadTemplateFinancial(userId, month, year, data) {
        return this.axios.post(`/api/report/balance-sheet?userId=${userId}&month=${month}&year=${year}`, data);
    }
    updateTemplateFinancial(id, data) {
        return this.axios.put(`/api/report/balance-sheet/${id}`, data);
    }
};
