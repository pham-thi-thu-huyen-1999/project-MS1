import axios from 'axios';
import UserService from '~/services/userService';
import CommonService from '~/services/commonService';
import RoleService from '~/services/roleService';
import StatementService from '~/services/statementService';
import ReportService from '~/services/reportService';
import TransactionService from '~/services/transactionService';
import AbnService from '~/services/abnService';
import YodleeService from '~/services/yodleeService';
import GroupExpenseService from '~/services/groupExpenseService';
import ChartAccountService from '~/services/chartAccountService';
import BudgetService from '~/services/budgetService';
import CrunchService from '~/services/crunchService';
import NotificationService from '~/services/notificationService';
import HistoryService from '~/services/historyService';
import ProductService from '~/services/productService';
import MessageService from '~/services/messageService';
import FileManagementService from '~/services/fileManagementService';
import UsageBudget from '~/services/usageBudgetService';
import GeneralJournalService from '~/services/generalJournalService';

const axiosInstanceCore = axios.create({
    baseURL: process.env.apiCoreBase,
    timeout: 10000
});

const axiosInstanceLog = axios.create({
    baseURL: process.env.apiLogBase,
    timeout: 10000
});

const axiosInstanceReport = axios.create({
    baseURL: process.env.apiReportBase,
    timeout: 10000
});

export default ({app, redirect, route, store}, inject) => {
    let axiosCore = initAxiosMethods(axiosInstanceCore);
    let axiosLog = initAxiosMethods(axiosInstanceLog);
    let axiosReport = initAxiosMethods(axiosInstanceReport);

    inject('services', {
        userService: new UserService(axiosCore),
        chartAccountService: new ChartAccountService(axiosCore),
        budgetService: new BudgetService(axiosCore),
        commonService: new CommonService(axiosCore),
        roleService: new RoleService(axiosCore),
        transactionService: new TransactionService(axiosCore),
        statementService: new StatementService(axiosCore),
        groupExpenseService: new GroupExpenseService(axiosCore),
        abnService: new AbnService(axiosCore),
        yodleeService: new YodleeService(axiosCore),
        reportService: new ReportService(axiosReport),
        crunchService: new CrunchService(axiosCore),
        messageService: new MessageService(axiosCore),
        productService: new ProductService(axiosCore),
        notificationService: new NotificationService(axiosLog),
        historyService: new HistoryService(axiosLog),
        fileManagementService: new FileManagementService(axiosCore),
        usageBudgetService: new UsageBudget(axiosReport),
        generalJournalService: new GeneralJournalService(axiosCore)
    });

    function setToken(option) {
        if (!option)
            option = {};
        if (!option.headers)
            option.headers = {};
        if (!option.headers.Authorization && !option.headers.authorization && store.state.userAuth && store.state.userAuth.token && store.state.userAuth.token.accessToken)
            option.headers.Authorization = store.state.userAuth.token.accessToken;

        return option;
    }

    function handleError(err) {
        if (err.response && err.response.status === 401) {
            store.commit('SET_AUTH_USER', null);
            return redirect('/login');
        }
        if (err.response && err.response.data && err.response.data.error)
            err = err.response.data.error;

        return {error: err};
    }

    function initAxiosMethods(axiosInstance) {
        return {
            get: (url, option) => {
                return new Promise((resolve, reject) => {
                    option = setToken(option);
                    return axiosInstance.get(url, option).then(({data}) => resolve(data)).catch(err => resolve(handleError(err)));
                });
            },
            post: (url, data, option) => {
                return new Promise((resolve, reject) => {
                    option = setToken(option);
                    return axiosInstance.post(url, data, option).then(({data}) => resolve(data)).catch(err => resolve(handleError(err)));
                });
            },
            put: (url, data, option) => {
                return new Promise((resolve, reject) => {
                    option = setToken(option);
                    return axiosInstance.put(url, data, option).then(({data}) => resolve(data)).catch(err => resolve(handleError(err)));
                });
            },
            patch: (url, data, option) => {
                return new Promise((resolve, reject) => {
                    option = setToken(option);
                    return axiosInstance.patch(url, data, option).then(({data}) => resolve(data)).catch(err => resolve(handleError(err)));
                });
            },
            delete: (url, option) => {
                return new Promise((resolve, reject) => {
                    option = setToken(option);
                    return axiosInstance.delete(url, option).then(({data}) => resolve(data)).catch(err => resolve(handleError(err)));
                });
            }
        };
    }
};
