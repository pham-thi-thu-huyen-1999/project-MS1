import * as request from 'request-promise';
import {Config} from '../config';
import DataHelper from './DataHelper';

class CachingHelper {
    static get(url): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'GET',
            uri: `http://${Config.PROJECT.DOMAIN}:${Config.PROJECT.PORT_CACHING}/api/caching` + url,
            json: true
        }));
    }

    static post(url, data?: any): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'POST',
            uri: `http://${Config.PROJECT.DOMAIN}:${Config.PROJECT.PORT_CACHING}/api/caching` + url,
            body: data,
            json: true
        }));
    }

    static put(url, data: any): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'PUT',
            uri: `http://${Config.PROJECT.DOMAIN}:${Config.PROJECT.PORT_CACHING}/api/caching` + url,
            body: data,
            json: true
        }));
    }

    static patch(url, data: any): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'PATCH',
            uri: `http://${Config.PROJECT.DOMAIN}:${Config.PROJECT.PORT_CACHING}/api/caching` + url,
            body: data,
            json: true
        }));
    }

    static delete(url): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'DELETE',
            uri: `http://${Config.PROJECT.DOMAIN}:${Config.PROJECT.PORT_CACHING}/api/caching` + url,
            json: true
        }));
    }
}

Object.seal(CachingHelper);
export default CachingHelper;
