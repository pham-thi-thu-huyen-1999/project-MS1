export enum ClusterRequestType {
    LoadAllData = 1,
    UpdateRole
};

export enum GstType {
    NotReporTable = 1,
    GSTFree,
    GST,
    CAP
}

export enum GenernalJournalItemType {
    ADJUSTMENT = 1,
    NEWTRANSACTION = 2
}

export enum BusinessType {
    PartnerShip = 1,
    Company,
    SoleTrader
};

export enum ReportSettingCode {
    GST = '4600',
    GCA = '4500',
}

export enum System {
    Core = 1,
    Cache = 2,
    Authorization = 3,
    Integration = 4,
    Message = 5,
    Report = 6,
    Management = 7,
    Justdone = 8,
    Precis = 9,
    WhiteLabel = 10
};

export enum ProductType {
    Management = 1,
    Justdone = 2,
    FreshNumber = 3,
    WhiteLabel = 4
};

export enum ProductCode {
    Management = 1,
    Justdone = 2,
    Precis = 3,
    WhiteLabel = 4
};

export enum RoleCode {
    Self = 0,
    SuperAdmin = 1,
    RegionAdmin = 2,
    ProductAdmin = 3,
    ProductManager = 4,
    Supervisor = 5,
    CaseManager = 6,
    TaxAgent = 7,
    Client = 8
}

export enum RoleForManagement {
    SuperAdmin = 1,
    RegionAdmin = 2,
    Supervisor = 5,
    CaseManager = 6,
    TaxAgent = 7,
}

export enum RoleForWhiteLabel {
    ProductAdmin = 3,
    ProductManager = 4,
    Client = 8
}

export enum RoleForFreshNumber {
    ProductAdmin = 3,
    Client = 8
}

export enum BankType {
    None = 0,
    Bank,
    CreditCard,
    Manual
};

export enum GenderType {
    Male = 1,
    Female
};

export enum LoginProvider {
    Local = 1,
    Google,
    Facebook
};

export enum UserStatus {
    Inactive = 1,
    Active,
    Cancelled
};

export enum LogAction {
    GetBankStatus = 501,
    AddBank = 502,
    CreateYodleeAccount = 503,
    CronJob = 504,
};

export enum LogModule {
    User = 1,
    Accounting = 2,
    Statement = 3,
    Transaction = 4,
    Yodlee = 5
};

export enum CrunchType {
    Expenses = 1,
    Drawings = 2,
    Income = 3,
    Other = 4
};

export enum FileType {
    Other = 0,
    Image,
    Video,
    Document
};

export enum Method {
    GET = 1,
    POST,
    PUT,
    PATCH,
    DELETE
};

export enum AccountingStatus {
    NotAvailabel = 1,
    NotStarted,
    AwaitingConfirmation,
    Confirmed,
    Completed,
    Notcompleted,
    NotDueYet,
    DueSoon,
    PleaseSign,
    Signed,
    Lodged,
    Preparing
};

export enum HistoryStatus {
    Success = 1,
    Error,
}

export enum LogStatus {
    Success = 1,
    Error,
}

export enum ServerInforName {
    CORE = 'SYSTEM CORE',
    AUTHORIZATION = 'AUTHORIZATION',
    BANK = 'BANK',
    REPORT = 'REPORT',
    LOG = 'LOG',
}

export enum ImageProduct {
    Logo = 1,
    Favicon = 2
};

export enum StatusConnectBank {
    Connecting = 1,
    Connected = 2,
    NotConnected = 3,
}
