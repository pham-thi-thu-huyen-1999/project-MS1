import axios from 'axios';
import UserService from '~/services/userService';
import ChartAccountService from '~/services/chartAccountService';
import ProductService from '~/services/productService';
import BudgetService from '~/services/budgetService';
import CommonService from '~/services/commonService';
import RoleService from '~/services/roleService';
import TransactionService from '~/services/transactionService';
import StatementService from '~/services/statementService';
import CrunchService from '~/services/crunchService';
import AbnService from '~/services/abnService';
import YodleeService from '~/services/yodleeService';
import ReportService from '~/services/reportService';
import NotificationService from '~/services/notificationService';
import HistoryService from '~/services/historyService';
import SystemService from '~/services/systemService';
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
        systemService: new SystemService(axiosCore),
        chartAccountService: new ChartAccountService(axiosCore),
        productService: new ProductService(axiosCore),
        budgetService: new BudgetService(axiosCore),
        commonService: new CommonService(axiosCore),
        roleService: new RoleService(axiosCore),
        transactionService: new TransactionService(axiosCore),
        statementService: new StatementService(axiosCore),
        crunchService: new CrunchService(axiosCore),
        abnService: new AbnService(axiosCore),
        yodleeService: new YodleeService(axiosCore),
        messageService: new MessageService(axiosCore),
        reportService: new ReportService(axiosReport),
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
