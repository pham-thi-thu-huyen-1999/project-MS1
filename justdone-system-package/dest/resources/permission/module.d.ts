import { ProductType, RoleCode } from '../../app/model/common/CommonType';
declare const _default: {
    SYSTEM: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            ACCESS: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    PRODUCT: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            CREATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            DELETE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    ROLE: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            CREATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            DELETE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    USER: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    MANAGER: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            GET_MANAGER_FOR_ASSIGN: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            GET_CLIENT: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            GET_CLIENT_BY_MANAGER: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            GET_CLIENT_PERSONAL_INFO: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            GET_CLIENT_BUSINESS_INFO: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            GET_CLIENT_CONNECTED_BANK: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            GET_CLIENT_TRADING_QUESTION: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            CREATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            CREATE_CLIENT: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            INVITE_CLIENT: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE_CLIENT: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE_CLIENT_PERSONAL_INFO: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE_CLIENT_BUSINESS_INFO: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE_CLIENT_CONNECTED_BANK: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE_CLIENT_TRADING_QUESTION: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            ASSIGN_MANAGER: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE_CLIENT_RECONNECT_BANK: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            DELETE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            DELETE_CLIENT: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            DELETE_INVITE_CLIENT: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    GROUP_EXPENSE: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            CREATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            DELETE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    CHART_OF_ACCOUNT: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            CREATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            ASSIGN_CLIENT: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            DELETE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    STATEMENT: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    TRANSACTION: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    PROVIDER: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    YODLEE: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            CREATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            DELETE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    RECEIPT: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            CREATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            DELETE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    FINANCIAL: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            CREATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            DELETE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    ACCOUNTING: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            CREATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            DELETE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    ABN: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    LOG: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    MENU: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            TRANSACTION: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            BUSINESS_DETAIL: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            DASHBOARD: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            PRODUCT_MANAGEMENT: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            TEAM_MANAGEMENT: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            CLIENT_MANAGEMENT: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            MESSAGE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            SERVER_INFORMATION: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            DATA_REPORT: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            CHART_OF_ACCOUNT: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            SETTING: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            AUTOMATION_CRUNCH: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            PRODUCT: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    BUDGET: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            CREATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            DELETE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    CRUNCHER: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            CREATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            DELETE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            APPROVE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    REPORT: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            CREATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            DELETE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    MESSAGE: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            CREATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            DELETE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
    AUTOCRUNCHER: {
        code: number;
        name: string;
        order: number;
        productTypes: ProductType[];
        claim: {
            GET: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            GET_MANAGER: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            CREATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            UPDATE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
            DELETE: {
                code: number;
                name: string;
                order: number;
                roleCodes: RoleCode[];
            };
        };
    };
};
export default _default;
