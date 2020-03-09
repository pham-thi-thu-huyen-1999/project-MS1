import IMessageBusiness from './interfaces/IMessageBusiness'; // eslint-disable-line
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import module from 'justdone-system-package/dest/resources/permission/module';
import Message from 'justdone-system-package/dest/app/model/message/Message'; // eslint-disable-line
import MessageCreate from 'justdone-system-package/dest/app/model/message/MessageCreate'; // eslint-disable-line
import MessageRepository from 'justdone-system-package/dest/app/repository/MessageRepository';
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';
import {RoleCode} from 'justdone-system-package/dest/app/model/common/CommonType'; // eslint-disable-line
import BusinessLoader from '../../system/BusinessLoader';
import LogHelper from 'justdone-system-package/dest/helpers/LogHelper';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import MessageUpdate from 'justdone-system-package/dest/app/model/message/MessageUpdate'; // eslint-disable-line

class MessageBusiness implements IMessageBusiness {
    private messageRepository: MessageRepository;

    constructor() {
        this.messageRepository = new MessageRepository();
    }

    async get(_id: string): Promise<Message | null> {
        return null;
    }

    async getByGroup(originId: string, role: number, page: number, limit: number): Promise<Message[]> {
        if (!originId)
            return [];

        let products = await Authenticator.filterProductsPermission([module.MESSAGE.claim.GET.code], originId, [], []);
        if (!products.length)
            return [];

        let origin = await AuthorizationHelper.userService.get(originId);
        if (!origin || !origin.permission || !origin.permission.role)
            return [];

        let groupRole;
        if (origin.permission.role.code === RoleCode.SuperAdmin)
            groupRole = role;
        else
            groupRole = origin.permission.role.code; ;

        let params = {
            query: {
                'groupReceive.role': groupRole
            }
        };

        let result = await this.messageRepository.find(params, {createdAt: -1}, page, limit);

        return Message.parseArray(result);
    }

    async getCountByGroup(originId: string, role: number): Promise<number> {
        if (!originId)
            return 0;

        let products = await Authenticator.filterProductsPermission([module.MESSAGE.claim.GET.code], originId, [], []);
        if (!products.length)
            return 0;

        let origin = await AuthorizationHelper.userService.get(originId);
        if (!origin || !origin.permission || !origin.permission.role)
            return 0;

        let groupRole;
        if (origin.permission.role.code === RoleCode.SuperAdmin)
            groupRole = role;
        else
            groupRole = origin.permission.role.code;

        let params = {
            query: {
                'groupReceive.role': groupRole
            }
        };

        let result = await this.messageRepository.getCount(params);

        return result;
    }

    async create(originId: string, data: MessageCreate): Promise<Message> {
        if (!data || !originId)
            throw new ErrorCommon(101, 'Message Create');

        let products = await Authenticator.filterProductsPermission([module.MESSAGE.claim.CREATE.code], originId, [], []);
        if (!products.length)
            throw new ErrorCommon(101, 'Request');

        data.userId = originId;
        let result = await this.messageRepository.create(data);

        this.createNotification(data.groupReceive.role);

        return result;
    }

    async createNotification(roleCode: number): Promise<boolean> {
        if (!roleCode)
            return false;

        let role = await BusinessLoader.roleBusiness.getByCode(roleCode);
        if (!role)
            return false;

        let users = await BusinessLoader.userBusiness.getByRole(role._id);
        if (!users.length)
            return false;
        let userIds: string[] = [];
        users.forEach(user => {
            userIds.push(user._id);
        });

        LogHelper.notificationService.createMultipleToReceiverIds({title: 'New message', message: `You have a <a href="/message" target="_blank">new message</a>`, receiverIds: userIds});

        return true;
    }
}

Object.seal(MessageBusiness);
export default MessageBusiness;
