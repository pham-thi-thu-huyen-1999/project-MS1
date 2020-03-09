class Development {
    static DATABASE = {
        SERVER: 'localhost',
        PORT: 27017,
        DB_NAME: 'justdone_development',
        DB_NAME_TEST: 'justdone_test',
        USERNAME: '',
        PASSWORD: ''
    };

    static DB_CONN_URI: string = `mongodb://${Development.DATABASE.SERVER}:${Development.DATABASE.PORT}/${Development.DATABASE.DB_NAME}`;
    static DB_CONN_URI_TEST: string = `mongodb://${Development.DATABASE.SERVER}:${Development.DATABASE.PORT}/${Development.DATABASE.DB_NAME_TEST}`;

    static SERVER = {
        CORE: {
            PROTOTYPE: 'http',
            DOMAIN: 'localhost:3001'
        },
        AUTHORIZATION: {
            PROTOTYPE: 'http',
            DOMAIN: 'localhost:3002'
        },
        BANK_SERVICE: {
            PROTOTYPE: 'http',
            DOMAIN: 'localhost:3003'
        },
        LOG: {
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
        INTEGRATION: {
            PROTOTYPE: 'http',
            DOMAIN: 'localhost:3007'
        },
        MANAGEMENT: {
            PROTOTYPE: 'http',
            DOMAIN: 'localhost:4001'
        },
        FRESH_NUMBER: {
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

    static GOOGLE_STORAGE = {
        PROJECT_ID: 'fast-rabbit-205105',
        BUCKET_NAME: 'justdone-dev',
        LOCATION: 'ASIA-SOUTHEAST1',
        BASE_URL: 'https://storage.googleapis.com',
        KEY_FILENAME: './src/resources/googleAccount/justdone-storage-dev.json'
    };

    static STRIPE = {
        KEY: 'sk_test_rV7bQ3SCQHLmoLyKm5pRAtay',
    };
}
export default Development;
