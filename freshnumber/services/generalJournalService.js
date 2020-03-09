export default class GeneralJournalService {
    constructor(axios) {
        this.axios = axios;
    }

    getGeneralJournal(userId, beginYear, page, limit) {
        return this.axios.get(`api/general-journal?userId=${userId}&beginYear=${beginYear}&page=${page}&limit=${limit}`);
    }

    getGeneralJournalTotal(userId, beginYear) {
        return this.axios.get(`api/general-journal/total?userId=${userId}&beginYear=${beginYear}`);
    }

    getGeneralJournalItem(gjId, page, limit) {
        return this.axios.get(`api/general-journal/item?gjId=${gjId}&page=${page}&limit=${limit}`);
    }

    getGeneralJournalItemTotal(gjId) {
        return this.axios.get(`api/general-journal/total-item?gjId=${gjId}`);
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
