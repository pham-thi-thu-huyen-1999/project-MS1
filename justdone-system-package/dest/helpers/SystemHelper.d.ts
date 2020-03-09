export default class SystemHelper {
    static getSytemInfo(): {
        name: string;
        domain: string;
        port: number;
        cpu: {
            free: number;
            used: number;
        };
        memory: {
            free: number;
            used: number;
        };
        operatingSystem: string;
        disk: {
            free: number;
            used: number;
        };
        status: boolean;
        deploy: Date;
    };
}
