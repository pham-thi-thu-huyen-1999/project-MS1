export default ({app, redirect, route, store}, inject) => {
    let module = {
        SYSTEM: {
            claim: {
                ACCESS: {
                    code: 1001
                }
            }
        },
        PRODUCT: {
            claim: {
                GET: {
                    code: 2001
                },
                CREATE: {
                    code: 2101
                },
                UPDATE: {
                    code: 2201
                },
                DELETE: {
                    code: 2301
                }
            }
        },
        ROLE: {
            claim: {
                GET: {
                    code: 3001
                },
                CREATE: {
                    code: 3101
                },
                UPDATE: {
                    code: 3201
                },
                DELETE: {
                    code: 3301
                }
            }
        },
        USER: {
            claim: {
                GET: {
                    code: 4001
                },
                UPDATE: {
                    code: 4201
                }
            }
        },
        MANAGER: {
            claim: {
                GET: {
                    code: 5001
                },
                GET_MANAGER_FOR_ASSIGN: {
                    code: 5002
                },
                GET_CLIENT: {
                    code: 5003
                },
                GET_CLIENT_BY_MANAGER: {
                    code: 5004
                },
                GET_CLIENT_PERSONAL_INFO: {
                    code: 5005
                },
                GET_CLIENT_BUSINESS_INFO: {
                    code: 5006
                },
                GET_CLIENT_CONNECTED_BANK: {
                    code: 5007
                },
                GET_CLIENT_TRADING_QUESTION: {
                    code: 5008
                },
                CREATE: {
                    code: 5101
                },
                CREATE_CLIENT: {
                    code: 5102
                },
                INVITE_CLIENT: {
                    code: 5103
                },
                UPDATE: {
                    code: 5201
                },
                UPDATE_CLIENT: {
                    code: 5202
                },
                UPDATE_CLIENT_PERSONAL_INFO: {
                    code: 5203
                },
                UPDATE_CLIENT_BUSINESS_INFO: {
                    code: 5204
                },
                UPDATE_CLIENT_CONNECTED_BANK: {
                    code: 5205
                },
                UPDATE_CLIENT_TRADING_QUESTION: {
                    code: 5206
                },
                ASSIGN_MANAGER: {
                    code: 5207
                },
                UPDATE_CLIENT_RECONNECT_BANK: {
                    code: 5208
                },
                DELETE: {
                    code: 5301
                },
                DELETE_CLIENT: {
                    code: 5302
                },
                DELETE_INVITE_CLIENT: {
                    code: 5104
                }
            }
        },
        GROUP_EXPENSE: {
            claim: {
                GET: {
                    code: 6001
                },
                CREATE: {
                    code: 6101
                },
                UPDATE: {
                    code: 6201
                },
                DELETE: {
                    code: 6301
                }
            }
        },
        CHART_OF_ACCOUNT: {
            claim: {
                GET: {
                    code: 7001
                },
                CREATE: {
                    code: 7101
                },
                UPDATE: {
                    code: 7201
                },
                ASSIGN_CLIENT: {
                    code: 7202
                },
                DELETE: {
                    code: 7301
                }
            }
        },
        STATEMENT: {
            claim: {
                GET: {
                    code: 8001
                },
                UPDATE: {
                    code: 8201
                }
            }
        },
        TRANSACTION: {
            claim: {
                GET: {
                    code: 9001
                },
                UPDATE: {
                    code: 9101
                }
            }
        },
        PROVIDER: {
            claim: {
                GET: {
                    code: 10001
                }
            }
        },
        YODLEE: {
            claim: {
                GET: {
                    code: 11001
                },
                CREATE: {
                    code: 11101
                },
                UPDATE: {
                    code: 11201
                },
                DELETE: {
                    code: 11301
                }
            }
        },
        RECEIPT: {
            claim: {
                GET: {
                    code: 12001
                },
                CREATE: {
                    code: 12101
                },
                UPDATE: {
                    code: 12201
                },
                DELETE: {
                    code: 12301
                }
            }
        },
        FINANCIAL: {
            claim: {
                GET: {
                    code: 13001
                },
                CREATE: {
                    code: 13101
                },
                UPDATE: {
                    code: 13201
                },
                DELETE: {
                    code: 13301
                }
            }
        },
        ACCOUNTING: {
            claim: {
                GET: {
                    code: 14001
                },
                CREATE: {
                    code: 14101
                },
                UPDATE: {
                    code: 14201
                },
                DELETE: {
                    code: 14301
                }
            }
        },
        ABN: {
            claim: {
                GET: {
                    code: 15001
                }
            }
        },
        LOG: {
            claim: {
                GET: {
                    code: 16001
                }
            }
        },
        MENU: {
            claim: {
                TRANSACTION: {
                    code: 17001
                },
                BUSINESS_DETAIL: {
                    code: 17002
                },
                DASHBOARD: {
                    code: 17003
                },
                PRODUCT_MANAGEMENT: {
                    code: 17004
                },
                TEAM_MANAGEMENT: {
                    code: 17005
                },
                CLIENT_MANAGEMENT: {
                    code: 17006
                },
                MESSAGE: {
                    code: 17007
                },
                SERVER_INFORMATION: {
                    code: 17008
                },
                DATA_REPORT: {
                    code: 17009
                },
                CHART_OF_ACCOUNT: {
                    code: 17010
                },
                SETTING: {
                    code: 17011
                },
                AUTOMATION_CRUNCH: {
                    code: 17012
                }
            }
        },
        BUDGET: {
            claim: {
                GET: {
                    code: 18001
                },
                CREATE: {
                    code: 18101
                },
                UPDATE: {
                    code: 18201
                },
                DELETE: {
                    code: 18301
                }
            }
        },
        CRUNCHER: {
            claim: {
                GET: {
                    code: 19001
                },
                CREATE: {
                    code: 19101
                },
                UPDATE: {
                    code: 19201
                },
                DELETE: {
                    code: 19301
                },
                APPROVE: {
                    code: 19401
                }
            }
        },
        REPORT: {
            claim: {
                GET: {
                    code: 20001
                },
                CREATE: {
                    code: 20101
                },
                UPDATE: {
                    code: 20201
                },
                DELETE: {
                    code: 20301
                }
            }
        },
        MESSAGE: {
            claim: {
                GET: {
                    code: 21001
                },
                CREATE: {
                    code: 21101
                },
                UPDATE: {
                    code: 21201
                },
                DELETE: {
                    code: 21301
                }
            }
        },
        AUTOCRUNCHER: {
            claim: {
                GET: {
                    code: 22001
                },
                GET_MANAGER: {
                    code: 22002
                },
                CREATE: {
                    code: 22101
                },
                UPDATE: {
                    code: 22201
                },
                DELETE: {
                    code: 21301
                }
            }
        }
    };

    inject('module', module);
};
