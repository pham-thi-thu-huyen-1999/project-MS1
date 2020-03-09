import {ProductType, RoleCode} from '../../app/model/common/CommonType';

export default {
    SYSTEM: {
        code: 1000,
        name: 'System',
        order: 1,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            ACCESS: {
                code: 1001,
                name: 'Access system',
                order: 1,
                roleCodes: [
                    RoleCode.Self
                ]
            }
        }
    },
    PRODUCT: {
        code: 2000,
        name: 'Product',
        order: 2,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 2001,
                name: 'Get product',
                order: 1,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.TaxAgent,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager,
                    RoleCode.Client
                ]
            },
            CREATE: {
                code: 2101,
                name: 'Create product',
                order: 101,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            UPDATE: {
                code: 2201,
                name: 'Update product',
                order: 201,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.ProductAdmin
                ]
            },
            DELETE: {
                code: 2301,
                name: 'Delete product',
                order: 301,
                roleCodes: [
                    RoleCode.Self
                ]
            }
        }
    },
    ROLE: {
        code: 3000,
        name: 'Role',
        order: 3,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 3001,
                name: 'Get role',
                order: 1,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.TaxAgent,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager,
                    RoleCode.Client
                ]
            },
            CREATE: {
                code: 3101,
                name: 'Create role',
                order: 101,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            UPDATE: {
                code: 3201,
                name: 'Update role',
                order: 201,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            DELETE: {
                code: 3301,
                name: 'Delete role',
                order: 301,
                roleCodes: [
                    RoleCode.Self
                ]
            }
        }
    },
    USER: {
        code: 4000,
        name: 'User',
        order: 4,
        productTypes: [
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 4001,
                name: 'Get user info',
                order: 1,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            // CREATE: {
            //     code: 4101,
            //     name: 'Create user info',
            //     order: 101,
            // },
            UPDATE: {
                code: 4201,
                name: 'Update user info',
                order: 201,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            // DELETE: {
            //     code: 4301,
            //     name: 'Delete user info',
            //     order: 401,
            // },
        }
    },
    MANAGER: {
        code: 5000,
        name: 'Manager',
        order: 5,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 5001,
                name: 'Get manager info',
                order: 1,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.TaxAgent,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager
                ]
            },
            GET_MANAGER_FOR_ASSIGN: {
                code: 5002,
                name: 'Get manager for assign',
                order: 2,
                roleCodes: [
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager
                ]
            },
            GET_CLIENT: {
                code: 5003,
                name: 'Get client info',
                order: 3,
                roleCodes: [
                    RoleCode.Client
                ]
            },
            GET_CLIENT_BY_MANAGER: {
                code: 5004,
                name: 'Get client of manager',
                order: 4,
                roleCodes: [
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager
                ]
            },
            GET_CLIENT_PERSONAL_INFO: {
                code: 5005,
                name: 'Get client personal info',
                order: 5,
                roleCodes: [
                    RoleCode.Client
                ]
            },
            GET_CLIENT_BUSINESS_INFO: {
                code: 5006,
                name: 'Get client business info',
                order: 6,
                roleCodes: [
                    RoleCode.Client
                ]
            },
            GET_CLIENT_CONNECTED_BANK: {
                code: 5007,
                name: 'Get client connected banks',
                order: 7,
                roleCodes: [
                    RoleCode.Client
                ]
            },
            GET_CLIENT_TRADING_QUESTION: {
                code: 5008,
                name: 'Get client trading questions',
                order: 8,
                roleCodes: [
                    RoleCode.Client
                ]
            },
            CREATE: {
                code: 5101,
                name: 'Create manager',
                order: 101,
                roleCodes: [
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.TaxAgent,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager
                ]
            },
            CREATE_CLIENT: {
                code: 5102,
                name: 'Create client',
                order: 102,
                roleCodes: [
                    RoleCode.Client
                ]
            },
            INVITE_CLIENT: {
                code: 5103,
                name: 'Invite client',
                order: 103,
                roleCodes: [
                    RoleCode.Client
                ]
            },
            UPDATE: {
                code: 5201,
                name: 'Update manager info',
                order: 201,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager
                ]
            },
            UPDATE_CLIENT: {
                code: 5202,
                name: 'Update client info',
                order: 202,
                roleCodes: [
                    RoleCode.Client
                ]
            },
            UPDATE_CLIENT_PERSONAL_INFO: {
                code: 5203,
                name: 'Update client personal info',
                order: 203,
                roleCodes: [
                    RoleCode.Client
                ]
            },
            UPDATE_CLIENT_BUSINESS_INFO: {
                code: 5204,
                name: 'Update client business info',
                order: 204,
                roleCodes: [
                    RoleCode.Client
                ]
            },
            UPDATE_CLIENT_CONNECTED_BANK: {
                code: 5205,
                name: 'Update client connected banks',
                order: 205,
                roleCodes: [
                    RoleCode.Client
                ]
            },
            UPDATE_CLIENT_TRADING_QUESTION: {
                code: 5206,
                name: 'Update client trading questions',
                order: 206,
                roleCodes: [
                    RoleCode.Client
                ]
            },
            ASSIGN_MANAGER: {
                code: 5207,
                name: 'Assign manager',
                order: 207,
                roleCodes: [
                    RoleCode.Client
                ]
            },
            UPDATE_CLIENT_RECONNECT_BANK: {
                code: 5208,
                name: 'Update client reconnect bank',
                order: 208,
                roleCodes: [
                    RoleCode.Client
                ]
            },
            DELETE: {
                code: 5301,
                name: 'Delete manager info',
                order: 301,
                roleCodes: [
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager
                ]
            },
            DELETE_CLIENT: {
                code: 5302,
                name: 'Delete client info',
                order: 302,
                roleCodes: [
                    RoleCode.Client
                ]
            },
            DELETE_INVITE_CLIENT: {
                code: 5104,
                name: 'Delete invite client',
                order: 104,
                roleCodes: [
                    RoleCode.Client
                ]
            },
        }
    },
    GROUP_EXPENSE: {
        code: 6000,
        name: 'Group expense',
        order: 6,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 6001,
                name: 'Get group expense',
                order: 1,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            CREATE: {
                code: 6101,
                name: 'Create group expense',
                order: 101,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            UPDATE: {
                code: 6201,
                name: 'Update group expense',
                order: 201,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            DELETE: {
                code: 6301,
                name: 'Delete group expense',
                order: 301,
                roleCodes: [
                    RoleCode.Self
                ]
            }
        }
    },
    CHART_OF_ACCOUNT: {
        code: 7000,
        name: 'Chart of account',
        order: 7,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 7001,
                name: 'Get Chart of account',
                order: 1,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            CREATE: {
                code: 7101,
                name: 'Create Chart of account',
                order: 101,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            UPDATE: {
                code: 7201,
                name: 'Update Chart of account',
                order: 201,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            ASSIGN_CLIENT: {
                code: 7202,
                name: 'Assign Chart of account to Client',
                order: 202,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            DELETE: {
                code: 7301,
                name: 'Delete Chart of account',
                order: 301,
                roleCodes: [
                    RoleCode.Self
                ]
            }
        }
    },
    STATEMENT: {
        code: 8000,
        name: 'Statement',
        order: 8,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 8001,
                name: 'Get Statement',
                order: 1,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            },
            UPDATE: {
                code: 8201,
                name: 'Update Statement',
                order: 201,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            }
        }
    },
    TRANSACTION: {
        code: 9000,
        name: 'Transaction',
        order: 9,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 9001,
                name: 'Get Transaction',
                order: 1,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            },
            UPDATE: {
                code: 9101,
                name: 'update Transaction',
                order: 101,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            }
        }
    },
    PROVIDER: {
        code: 10000,
        name: 'Provider',
        order: 10,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 10001,
                name: 'Get Provider',
                order: 1,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            }
        }
    },
    YODLEE: {
        code: 11000,
        name: 'Yodlee',
        order: 11,
        productTypes: [
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 11001,
                name: 'Get Yodlee',
                order: 1,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            },
            CREATE: {
                code: 11101,
                name: 'Get Yodlee',
                order: 101,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            },
            UPDATE: {
                code: 11201,
                name: 'Update Yodlee',
                order: 201,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            },
            DELETE: {
                code: 11301,
                name: 'Delete Yodlee',
                order: 301,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            },
        }
    },
    RECEIPT: {
        code: 12000,
        name: 'Receipt',
        order: 12,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 12001,
                name: 'Get Receipt',
                order: 1,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            },
            CREATE: {
                code: 12101,
                name: 'Create Receipt',
                order: 101,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            },
            UPDATE: {
                code: 12201,
                name: 'Update Receipt',
                order: 201,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            },
            DELETE: {
                code: 12301,
                name: 'Delete Receipt',
                order: 301,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            }
        }
    },
    FINANCIAL: {
        code: 13000,
        name: 'Finance',
        order: 13,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 13001,
                name: 'Get Finance',
                order: 1,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            },
            CREATE: {
                code: 13101,
                name: 'Create Finance',
                order: 101,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            },
            UPDATE: {
                code: 13201,
                name: 'Update Finance',
                order: 201,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            },
            DELETE: {
                code: 13301,
                name: 'Delete Finance',
                order: 301,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            }
        }
    },
    ACCOUNTING: {
        code: 14000,
        name: 'Accounting',
        order: 14,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 14001,
                name: 'Get Accounting',
                order: 1,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            },
            CREATE: {
                code: 14101,
                name: 'Create Accounting',
                order: 101,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            },
            UPDATE: {
                code: 14201,
                name: 'Update Accounting',
                order: 201,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            },
            DELETE: {
                code: 14301,
                name: 'Delete Accounting',
                order: 301,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            }
        }
    },
    ABN: {
        code: 15000,
        name: 'ABN',
        order: 15,
        productTypes: [
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 15001,
                name: 'Get ABN',
                order: 1,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.Client
                ]
            }
        }
    },
    LOG: {
        code: 16000,
        name: 'Log',
        order: 16,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 16001,
                name: 'Get Log',
                order: 1,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager,
                    RoleCode.Client
                ]
            }
        }
    },
    MENU: {
        code: 17000,
        name: 'Menu',
        order: 17,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            TRANSACTION: {
                code: 17001,
                name: 'Transaction',
                order: 1,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            BUSINESS_DETAIL: {
                code: 17002,
                name: 'Business Detail',
                order: 2,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            DASHBOARD: {
                code: 17003,
                name: 'Dashboard',
                order: 3,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            PRODUCT_MANAGEMENT: {
                code: 17004,
                name: 'Product Management',
                order: 4,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            TEAM_MANAGEMENT: {
                code: 17005,
                name: 'Team Management',
                order: 5,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            CLIENT_MANAGEMENT: {
                code: 17006,
                name: 'Client Management',
                order: 6,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            MESSAGE: {
                code: 17007,
                name: 'Message',
                order: 7,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            SERVER_INFORMATION: {
                code: 17008,
                name: 'Server Information',
                order: 8,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            DATA_REPORT: {
                code: 17009,
                name: 'Data Report',
                order: 9,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            CHART_OF_ACCOUNT: {
                code: 17010,
                name: 'Chart of account',
                order: 10,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            SETTING: {
                code: 17011,
                name: 'Setting',
                order: 11,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            AUTOMATION_CRUNCH: {
                code: 17012,
                name: 'Automation crunch',
                order: 12,
                roleCodes: [
                    RoleCode.Self
                ]
            },
            PRODUCT: {
                code: 17013,
                name: 'get product with create manager',
                order: 13,
                roleCodes: [
                    RoleCode.Self
                ]
            },
        }
    },
    BUDGET: {
        code: 18000,
        name: 'Buget',
        order: 18,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 18001,
                name: 'Get budget',
                order: 1,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager,
                ]
            },
            CREATE: {
                code: 18101,
                name: 'Create budget',
                order: 101,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager,
                ]
            },
            UPDATE: {
                code: 18201,
                name: 'Update budget',
                order: 201,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager,
                ]
            },
            DELETE: {
                code: 18301,
                name: 'delete budget',
                order: 301,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager,
                ]
            }
        }
    },
    CRUNCHER: {
        code: 19000,
        name: 'Cruncher',
        order: 19,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 19001,
                name: 'Get crunch',
                order: 1,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager,
                    RoleCode.Client
                ]
            },
            CREATE: {
                code: 19101,
                name: 'Create crunch',
                order: 101,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager,
                    RoleCode.Client
                ]
            },
            UPDATE: {
                code: 19201,
                name: 'Update crunch',
                order: 201,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager,
                    RoleCode.Client
                ]
            },
            DELETE: {
                code: 19301,
                name: 'Delete crunch',
                order: 301,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager,
                    RoleCode.Client
                ]
            },
            APPROVE: {
                code: 19401,
                name: 'approve crunch',
                order: 401,
                roleCodes: [
                    RoleCode.Supervisor,
                ]
            }
        }
    },
    REPORT: {
        code: 20000,
        name: 'REPORT',
        order: 20,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 20001,
                name: 'Get Report',
                order: 1,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager,
                    RoleCode.Client
                ]
            },
            CREATE: {
                code: 20101,
                name: 'Create Report',
                order: 101,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager,
                    RoleCode.Client
                ]
            },
            UPDATE: {
                code: 20201,
                name: 'Update Report',
                order: 201,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager,
                    RoleCode.Client
                ]
            },
            DELETE: {
                code: 20301,
                name: 'Delete Report',
                order: 301,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager,
                    RoleCode.Client
                ]
            }
        }
    },
    MESSAGE: {
        code: 21000,
        name: 'MESSAGE',
        order: 21,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 21001,
                name: 'Get Message',
                order: 1,
                roleCodes: [
                    RoleCode.Self,
                    RoleCode.RegionAdmin,
                    RoleCode.Supervisor,
                    RoleCode.CaseManager,
                    RoleCode.ProductAdmin,
                    RoleCode.ProductManager,
                    RoleCode.Client
                ]
            },
            CREATE: {
                code: 21101,
                name: 'Create Message',
                order: 101,
                roleCodes: [
                    RoleCode.SuperAdmin
                ]
            },
            UPDATE: {
                code: 21201,
                name: 'Update Message',
                order: 201,
                roleCodes: [
                    RoleCode.SuperAdmin
                ]
            },
            DELETE: {
                code: 21301,
                name: 'Delete Report',
                order: 301,
                roleCodes: [
                    RoleCode.SuperAdmin
                ]
            }
        }
    },
    AUTOCRUNCHER: {
        code: 22000,
        name: 'Auto Cruncher',
        order: 22,
        productTypes: [
            ProductType.Management,
            ProductType.FreshNumber,
            ProductType.Justdone,
            ProductType.WhiteLabel
        ],
        claim: {
            GET: {
                code: 22001,
                name: 'Get auto crunch',
                order: 1,
                roleCodes: [
                    RoleCode.SuperAdmin,
                    RoleCode.CaseManager,
                ]
            },
            GET_MANAGER: {
                code: 22002,
                name: 'Get manager in crunch',
                order: 2,
                roleCodes: [
                    RoleCode.SuperAdmin,
                    RoleCode.CaseManager,
                ]
            },
            CREATE: {
                code: 22101,
                name: 'Create auto crunch',
                order: 101,
                roleCodes: [
                    RoleCode.SuperAdmin,
                    RoleCode.CaseManager,
                ]
            },
            UPDATE: {
                code: 22201,
                name: 'Update auto crunch',
                order: 201,
                roleCodes: [
                    RoleCode.SuperAdmin,
                    RoleCode.CaseManager,
                ]
            },
            DELETE: {
                code: 21301,
                name: 'Delete auto crunch',
                order: 301,
                roleCodes: [
                    RoleCode.SuperAdmin,
                    RoleCode.CaseManager,
                ]
            }
        }
    },
};
