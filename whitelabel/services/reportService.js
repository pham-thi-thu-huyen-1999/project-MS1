
export default class ReportService {
    constructor(axios) {
        this.axios = axios;
    }

    getClientInviteds(productCode, page, limit) {
        return this.axios.get(`/api/analytic/inviteds?productCodes=${productCode}&page=${page}&limit=${limit}`);
    }

    getCountClientInviteds(productCode) {
        return this.axios.get(`/api/analytic/count-inviteds?productCodes=${productCode}`);
    }

    getClientNotassigned(productCode, page, limit) {
        return this.axios.get(`/api/analytic/client-not-assigned?productCodes=${productCode}&page=${page}&limit=${limit}`);
    }

    getCountNotassigned(productCode) {
        return this.axios.get(`/api/analytic/count-client-assigned?productCodes=${productCode}`);
    }

    getlistNotcruncher(productCode, page, limit) {
        return this.axios.get(`/api/analytic/users-not-crunched?productCodes=${productCode}&page=${page}&limit=${limit}`);
    }

    getCountlistNotcruncher(productCode) {
        return this.axios.get(`/api/analytic/count-users-not-crunched?productCodes=${productCode}`);
    }

    getlistFinishcruncher(productCode, page, limit) {
        return this.axios.get(`/api/analytic/users-crunch-completed?productCodes=${productCode}&page=${page}&limit=${limit}`);
    }

    getCountlistFinishcruncher(productCode) {
        return this.axios.get(`/api/analytic/count-users-crunch-completed?productCodes=${productCode}`);
    }

    getAnalyticClients(productCode) {
        return this.axios.get(`/api/analytic/summary-clients?productCodes=${productCode}`);
    }

    getAnalyticManagers(productCode) {
        return this.axios.get(`/api/analytic/summary-managers?productCodes=${productCode}`);
    }

    getFinancialList(userId, beginYear) {
        return this.axios.get(`/api/report/balance-sheet-csv?userId=${userId}&beginYear=${beginYear}`);
    }

    getList(userId, beginDate, endDate) {
        return this.axios.get(`/api/report/report-available?userId=${userId}&beginMonth=${beginDate.month}&beginYear=${beginDate.year}&endMonth=${endDate.month}&endYear=${endDate.year}`);
    }

    exportCruncherPDF(userId, productCode, type, month, year) {
        return this.axios.get(`/api/report/crunch-file?productCode=${productCode}&userId=${userId}&type=${type}&month=${month}&year=${year}`);
    }

    exportCruncherYearPDF(userId, productCode, type, year) {
        return this.axios.get(`/api/report/crunch-year?productCode=${productCode}&userId=${userId}&type=${type}&year=${year}`);
    }

    exportCruncherCSV(userId, productCode, type, month, year) {
        return this.axios.get(`/api/report/crunch-csv?productCode=${productCode}&userId=${userId}&type=${type}&month=${month}&year=${year}`);
    }

    exportCruncherYearCSV(userId, productCode, type, year) {
        return this.axios.get(`/api/report/crunchyear-csv?productCode=${productCode}&userId=${userId}&type=${type}&year=${year}`);
    }

    exportDataReportPDF(data) {
        return this.axios.post(`/api/report/data-report-pdf`, data);
    }

    exportDataReportCSV(data) {
        return this.axios.post(`/api/report/data-report-csv`, data);
    }

    exportFinancial(type, userId, beginMonth, beginYear, endMonth, endYear) {
        return this.axios.get(`/api/report/export-financial?type=${type}&userId=${userId}&beginMonth=${beginMonth}&beginYear=${beginYear}&endMonth=${endMonth}&endYear=${endYear}`);
    }

    exportFinancialCSV(type, userId, beginMonth, beginYear, endMonth, endYear) {
        return this.axios.get(`/api/report/csv-financial?type=${type}&userId=${userId}&beginMonth=${beginMonth}&beginYear=${beginYear}&endMonth=${endMonth}&endYear=${endYear}`);
    }

    exportBalanceSheet(userId, month, year) {
        return this.axios.get(`/api/report/balance-sheet-pdf?userId=${userId}&month=${month}&year=${year}`);
    }

    uploadTemplateFinancial(userId, month, year, data) {
        return this.axios.post(`/api/report/balance-sheet?userId=${userId}&month=${month}&year=${year}`, data);
    }
    updateTemplateFinancial(id, data) {
        return this.axios.put(`/api/report/balance-sheet/${id}`, data);
    }
};
