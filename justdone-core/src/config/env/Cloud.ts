class Cloud {
    static DATABASE = {
        SERVER: '35.197.128.99',
        DB_NAME: 'justdone_development',
        DB_NAME_TEST: 'justdone_test',
        USERNAME: '',
        PASSWORD: ''
    };

    static DB_CONN_URI: string = `mongodb://${Cloud.DATABASE.SERVER}/${Cloud.DATABASE.DB_NAME}`;
    static DB_CONN_URI_TEST: string = `mongodb://${Cloud.DATABASE.SERVER}/${Cloud.DATABASE.DB_NAME_TEST}`;

    static SERVER = {
        // CACHE: {
        //     PROTOTYPE: 'http',
        //     DOMAIN: '35.197.128.99:3000'
        // },
        CORE: {
            PROTOTYPE: 'http',
            DOMAIN: 'localhost:3001'
        },
        AUTHORIZATION: {
            PROTOTYPE: 'http',
            DOMAIN: '35.197.128.99:3002'
        },
        BANK_SERVICE: {
            PROTOTYPE: 'http',
            DOMAIN: 'localhost:3003'
        },
        INTEGRATION: {
            PROTOTYPE: 'http',
            DOMAIN: 'localhost:3004'
        },
        REPORT: {
            PROTOTYPE: 'http',
            DOMAIN: 'localhost:3005'
        },
        MESSAGE: {
            PROTOTYPE: 'http',
            DOMAIN: 'localhost:3006'
        },
        MANAGEMENT: {
            PROTOTYPE: 'http',
            DOMAIN: 'localhost:4001'
        },
        PRECIS: {
            PROTOTYPE: 'http',
            DOMAIN: 'localhost:4002'
        },
        JUSTDONE: {
            PROTOTYPE: 'http',
            DOMAIN: 'localhost:4003'
        },
        WHITE_LABEL: {
            PROTOTYPE: 'http',
            DOMAIN: 'localhost:4004'
        }
    };

    static SMTP = {
        AUTHENTICATOR: {
            USERNAME: '[Authenticator Email]',
            PASSWORD: '[Password]'
        },
        SENDER: {
            NAME: '[Sender Name]',
            EMAIL: '[Sender Email]'
        }
    };

    static GOOGLE_STORAGE = {
        PROJECT_ID: 'ardent-topic-186203',
        BUCKET_NAME: 'justdone-dev',
        LOCATION: 'ASIA-SOUTHEAST1',
        BASE_URL: 'https://storage.googleapis.com',
        KEY_FILENAME: './src/resources/googleAccount/justdone-storage-dev.json'
    };

    static STRIPE = {
        KEY: 'sk_test_rV7bQ3SCQHLmoLyKm5pRAtay',
    };
}
export default Cloud;
