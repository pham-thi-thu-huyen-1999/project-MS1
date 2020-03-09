export interface IProject {
    DOMAIN: string;
    PORT: number;
    PORT_CACHING: number;
    PROJECT_NAME: string;
    SYSTEM_NAME: string;
    EXPIRE_DAYS: number;
    DATABASE: {
        SERVER: string;
        PORT: number;
        DB_NAME: string;
        DB_NAME_TEST: string;
        USERNAME: string;
        PASSWORD: string;
    };
    DB_CONN_URI: string;
    DB_CONN_URI_TEST: string;
    SERVER: {
        CORE: ServerDetail;
        AUTHORIZATION: ServerDetail;
        BANK_SERVICE: ServerDetail;
        INTEGRATION: ServerDetail;
        REPORT: ServerDetail;
        LOG: ServerDetail;
        MESSAGE: ServerDetail;
        MANAGEMENT: ServerDetail;
        FRESH_NUMBER: ServerDetail;
        JUSTDONE: ServerDetail;
        WHITE_LABEL: ServerDetail;
    };
    SMTP: {
        AUTHENTICATOR: {
            USERNAME: string;
            PASSWORD: string;
        };
        SENDER: {
            NAME: string;
            EMAIL: string;
        };
    };
    STRIPE: {
        KEY: string;
    };
    UPLOAD: {
        TMP_PATH: string;
        SIZE: number;
        PATH_VIDEO: string;
        PATH_IMAGE: string;
        PATH_DOCUMENT: string;
    };
    YODLEE: {
        USERNAME: string;
        PASSWORD: string;
        API_BASE: string;
        SANDBOX: string;
    };
    GOOGLE_STORAGE: {
        PROJECT_ID: string;
        BUCKET_NAME: string;
        LOCATION: string;
        BASE_URL: string;
        KEY_FILENAME: string;
    };
    ABN: {
        URL: string;
        GUID: string;
    };
    UKABN: {
        URL: string;
        KEY: string;
    };
    ADDRESSIFY: {
        KEY: string;
        URL: string;
    };
    REDIS: {
        REDIS_HOST: string;
        REDIS_PORT: string;
    };
    SENDINBLUE: {
        API_KEY: string;
        SENDER: {
            EMAIL: string;
            NAME: string;
        };
    };
    ARAGON: string;
    DEVELOPERS: {};
}
export declare class ServerDetail {
    PROTOTYPE: string;
    DOMAIN: string;
}
export declare class Config {
    static PROJECT: IProject;
    static init(config: any): void;
}
