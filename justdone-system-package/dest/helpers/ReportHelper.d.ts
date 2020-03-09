export default class ReportHelper {
    static writeLoga(message: string): void;
    static writeLog(req: any, err: any): Promise<any>;
    static getSytemInfo(): Promise<any>;
}
