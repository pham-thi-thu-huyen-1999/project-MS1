import * as request from 'request-promise';
import * as log4js from 'log4js';
import {Config} from '../config';
import DataHelper from './DataHelper';
import AuthorizationHelper from './AuthorizationHelper';

log4js.configure({
    appenders: {
        console: {type: 'console'},
    },
    categories: {
        default: {appenders: ['console'], level: 'debug'}
    }
});
const logger = log4js.getLogger('JustDone');

class LogHelper {
    static logDebug(fileName: any, fnName: any, message: any) {
        logger.debug(fileName + ' - ' + fnName + ' - ' + message);
    }

    static logInfo(fileName: any, fnName: any, message: any) {
        logger.info(fileName + ' - ' + fnName + ' - ' + message);
    }

    static logWarn(fileName: any, fnName: any, message: any) {
        logger.warn(fileName + ' - ' + fnName + ' - ' + message);
    }

    static logError(fileName: any, fnName: any, message: any) {
        logger.error(fileName + ' - ' + fnName + ' - ' + message);
    }

    static notificationService = {
        async get(status: number, page, limit ): Promise<any> {
            return await LogHelper.get(`/api/notification?page=${page}&limit=${limit}`);
        },
        async assign(productName: string, originId: string, actorNumberOneId: string, actorNumberTwoId: string, type: string): Promise<any> {
            let origin = await AuthorizationHelper.userService.get(originId);
            let actorNumberOne = await AuthorizationHelper.userService.get(actorNumberOneId);
            let actorNumberTwo = await AuthorizationHelper.userService.get(actorNumberTwoId);

            if (!origin || !actorNumberOne || !actorNumberTwo)
                return;

            let data: any[] = [];
            if (type === 'assign') {
                data.push({receiverId: actorNumberOne._id, title: `Assign manager`, message: `${origin.fullName} assign manager you to ${actorNumberTwo.fullName} in ${productName} product`});
                data.push({receiverId: actorNumberTwo._id, title: `Assign manager`, message: `${origin.fullName} assign manager ${actorNumberOne.fullName} to you in ${productName} product`});
            }
            else {
                data.push({receiverId: actorNumberOne._id, title: `Unassign manager`, message: `${origin.fullName} unassign manager you to ${actorNumberTwo.fullName} in ${productName} product`});
                data.push({receiverId: actorNumberTwo._id, title: `Unassign manager`, message: `${origin.fullName} unassign manager ${actorNumberOne.fullName} to you in ${productName} product`});
            }

            return await LogHelper.post('/api/notification/create-multi-data', data);
        },
        async invite(productName: string, originId: string, receiverIds: string[], toEmail: string): Promise<any> {
            let origin = await AuthorizationHelper.userService.get(originId);
            if (!origin)
                return;

            if (!receiverIds.length || !toEmail)
                return;
            let data = {
                title: 'Invited client',
                message: `${origin.fullName} invite client with <a href="/client-management" target="_blank">${toEmail}</a> in ${productName} product`,
                receiverIds,
            };

            return await this.createMultipleToReceiverIds(data);
        },
        async createUserByRole(productName: string, originId: string, receiverIds: string[], toEmail: string, roleName: string): Promise<any> {
            let origin = await AuthorizationHelper.userService.get(originId);

            if (!origin || !productName || !receiverIds.length || !toEmail || !roleName)
                return;

            let data = {
                title: 'Create user',
                message: `${origin.fullName} create user <a href="/client-management" target="_blank">${toEmail}</a> with ${roleName} role in ${productName} product`,
                receiverIds,
            };

            return await this.createMultipleToReceiverIds(data);
        },
        async actionAccount(productName: string, originId: string, receiverIds: string[], email: string, name: string, type: string): Promise<any> {
            let origin = await AuthorizationHelper.userService.get(originId);

            if (!origin || !productName || !receiverIds.length || !email || !name)
                return;

            if (receiverIds.indexOf(originId) >= 0)
                receiverIds.splice(receiverIds.indexOf(originId), 1);

            let data: any;
            if (type === 'enable') {
                data = {
                    title: 'Enable user',
                    message: `${origin.fullName} enable user <a href="/client-management" target="_blank">${name}(${email})</a> in ${productName} product`,
                    receiverIds,
                };
            }
            else {
                data = {
                    title: 'Disable user',
                    message: `${origin.fullName} disable user <a href="/client-management" target="_blank">${name}(${email})</a> in ${productName} product`,
                    receiverIds,
                };
            }
            return await this.createMultipleToReceiverIds(data);
        },
        async create(data: any ): Promise<any> {
            return await LogHelper.post('/api/notification', data);
        },
        async createMultipleToReceiverIds(data: any ): Promise<any> {
            return await LogHelper.post('/api/notification/create-multi-receivers', data);
        },
        async delete(_id: string): Promise<any> {
            return await LogHelper.delete(`/api/notification/${_id}`);
        }
    }

    static historyService = {
        async assign(productName: string, originId: string, actorNumberOneId: string, actorNumberTwoId: string, claim: number, status: number, type: string): Promise<any> {
            let origin = await AuthorizationHelper.userService.get(originId);
            let actorNumberOne = await AuthorizationHelper.userService.get(actorNumberOneId);
            let actorNumberTwo = await AuthorizationHelper.userService.get(actorNumberTwoId);

            if (!productName || !origin || !actorNumberOne || !actorNumberTwo || !claim || !status || !type)
                return;

            let data: any[] = [];
            if (type === 'assign')
                data.push({userId: origin._id,
                    target: {id: actorNumberTwo._id,
                        email: actorNumberTwo.email},
                    claim,
                    description: `You assigned manager  ${actorNumberOne.fullName} to ${actorNumberTwo.fullName} in ${productName} product`,
                    status});
            else
                data.push({userId: origin._id,
                    target: {id: actorNumberTwo._id,
                        email: actorNumberTwo.email},
                    claim,
                    description: `You unassigned manager  ${actorNumberOne.fullName} to ${actorNumberTwo.fullName} in ${productName} product`,
                    status});

            return await this.create(data);
        },
        async createUserByRole(productName: string, originId: string, toEmail: string, claim: number, roleName: string, status: number): Promise<any> {
            // let origin = await AuthorizationHelper.userService.get(originId);

            if (!originId || !productName || !toEmail || !roleName)
                return;

            let data = {
                userId: originId,
                target: {email: toEmail},
                claim: claim,
                description: `You create user <a href="/client-management" target="_blank">${toEmail}</a> with ${roleName} role in ${productName} product`,
                status,
            };

            return await this.create(data);
        },
        async getListSignIn(isChoice: number, claim: number, userIds: any): Promise<any> {
            return await LogHelper.post(`/api/history/list-sign-in?isChoice=${isChoice}&claim=${claim}`, userIds);
        },
        async get(claim: number, status: number, page, limit ): Promise<any> {
            return await LogHelper.get(`/api/history?claim=${claim}&status=${status}&page=${page}&limit=${limit}`);
        },
        async create(data: any ): Promise<any> {
            return await LogHelper.post('/api/history', data);
        },
        async delete(_id: string): Promise<any> {
            return await LogHelper.delete(`/api/history/${_id}`);
        }
    }

    static logService = {
        async get(system: string, module: string, method: string, status: number, page, limit ): Promise<any> {
            return await LogHelper.get(`/api/log?system=${system}&module=${module}&method=${method}&status=${status}&page=${page}&limit=${limit}`);
        },
        async create(data: any ): Promise<any> {
            return await LogHelper.post('/api/log', data);
        },
        async delete(_id: string): Promise<any> {
            return await LogHelper.delete(`/api/log/${_id}`);
        },
        async getSytemInfo(): Promise<any> {
            return await LogHelper.get(`/api/system/get-log-infor`);
        },
    }

    static get(url: string): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'GET',
            url: `${Config.PROJECT.SERVER.LOG.PROTOTYPE}://${Config.PROJECT.SERVER.LOG.DOMAIN}` + url,
            json: true
        }));
    }

    static post(url: string, data?: any): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'POST',
            url: `${Config.PROJECT.SERVER.LOG.PROTOTYPE}://${Config.PROJECT.SERVER.LOG.DOMAIN}` + url,
            body: data,
            json: true
        }));
    }

    static put(url: string, data: any): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'PUT',
            url: `${Config.PROJECT.SERVER.LOG.PROTOTYPE}://${Config.PROJECT.SERVER.LOG.DOMAIN}` + url,
            body: data,
            json: true
        }));
    }

    static delete(url: string): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'DELETE',
            url: `${Config.PROJECT.SERVER.LOG.PROTOTYPE}://${Config.PROJECT.SERVER.LOG.DOMAIN}` + url,
            json: true
        }));
    }
}

Object.seal(LogHelper);
export default LogHelper;
