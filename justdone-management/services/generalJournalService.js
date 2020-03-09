export default class GeneralJournalService {
    constructor(axios) {
        this.axios = axios;
    }

    getGeneralJournal(userId, beginMonth, beginYear, endMonth, endYear, page, limit) {
        return this.axios.get(`api/general-journal?userId=${userId}&beginMonth=${beginMonth}&beginYear=${beginYear}&endMonth=${endMonth}&endYear=${endYear}&page=${page}&limit=${limit}`);
    }

    getGeneralJournalTotal(userId, beginMonth, beginYear, endMonth, endYear) {
        return this.axios.get(`api/general-journal/total?userId=${userId}&beginMonth=${beginMonth}&beginYear=${beginYear}&endMonth=${endMonth}&endYear=${endYear}`);
    }

    getGeneralJournalItem(gjId, page, limit) {
        return this.axios.get(`api/general-journal/item?gjId=${gjId}&page=${page}&limit=${limit}`);
    }

    getGeneralJournalItemTotal(gjId) {
        return this.axios.get(`api/general-journal/total-item?gjId=${gjId}`);
    }

    updateDateGJ(id, dataUpdate) {
        return this.axios.put(`api/general-journal/update-date-general-journal/${id}`, dataUpdate);
    }

    createGeneralJournal(data) {
        return this.axios.post(`api/general-journal`, data);
    }

    createGeneralJournalItem(data) {
        return this.axios.post(`api/general-journal/item`, data);
    }

    updateGeneralJournal(id, data) {
        return this.axios.put(`api/general-journal/${id}`, data);
    }

    updateGeneralJournalNote(id, data) {
        return this.axios.patch(`api/general-journal/${id}`, data);
    }

    updateGeneralJournalItem(id, data) {
        return this.axios.put(`api/general-journal/item/${id}`, data);
    }

    updateEvidenced(id, data) {
        return this.axios.put(`api/general-journal/evidenced/${id}`, data);
    }

    deleteGeneralJournal(id) {
        return this.axios.delete(`api/general-journal/${id}`);
    }

    deleteGeneralJournalItem(id) {
        return this.axios.delete(`api/general-journal/item/${id}`);
    }
}
