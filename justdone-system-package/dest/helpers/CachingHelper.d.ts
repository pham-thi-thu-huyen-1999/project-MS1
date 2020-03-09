declare class CachingHelper {
    static get(url: any): Promise<any>;
    static post(url: any, data?: any): Promise<any>;
    static put(url: any, data: any): Promise<any>;
    static patch(url: any, data: any): Promise<any>;
    static delete(url: any): Promise<any>;
}
export default CachingHelper;
