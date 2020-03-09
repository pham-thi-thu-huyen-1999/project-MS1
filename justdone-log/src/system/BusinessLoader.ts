import INotificationBusiness from '../app/business/interfaces/INotificationBusiness';
import NotificationBusiness from '../app/business/NotificationBusiness';
import ILogBusiness from '../app/business/interfaces/ILogBusiness';
import LogBusiness from '../app/business/LogBusiness';
import IHistoryBusiness from '../app/business/interfaces/IHistoryBusiness';
import HistoryBusiness from '../app/business/HistoryBusiness';

class BusinessLoader {
    static notificationBusiness: INotificationBusiness;
    static logBusiness: ILogBusiness;
    static historyBusiness: IHistoryBusiness;

    static init() {
        BusinessLoader.notificationBusiness = new NotificationBusiness();
        BusinessLoader.logBusiness = new LogBusiness();
        BusinessLoader.historyBusiness = new HistoryBusiness();
    }
}

export default BusinessLoader;
