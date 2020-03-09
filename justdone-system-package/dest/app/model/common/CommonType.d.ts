export declare enum ClusterRequestType {
    LoadAllData = 1,
    UpdateRole = 2
}
export declare enum GstType {
    NotReporTable = 1,
    GSTFree = 2,
    GST = 3,
    CAP = 4
}
export declare enum GenernalJournalItemType {
    ADJUSTMENT = 1,
    NEWTRANSACTION = 2
}
export declare enum BusinessType {
    PartnerShip = 1,
    Company = 2,
    SoleTrader = 3
}
export declare enum ReportSettingCode {
    GST = "4600",
    GCA = "4500"
}
export declare enum System {
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
}
export declare enum ProductType {
    Management = 1,
    Justdone = 2,
    FreshNumber = 3,
    WhiteLabel = 4
}
export declare enum ProductCode {
    Management = 1,
    Justdone = 2,
    Precis = 3,
    WhiteLabel = 4
}
export declare enum RoleCode {
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
export declare enum RoleForManagement {
    SuperAdmin = 1,
    RegionAdmin = 2,
    Supervisor = 5,
    CaseManager = 6,
    TaxAgent = 7
}
export declare enum RoleForWhiteLabel {
    ProductAdmin = 3,
    ProductManager = 4,
    Client = 8
}
export declare enum RoleForFreshNumber {
    ProductAdmin = 3,
    Client = 8
}
export declare enum BankType {
    None = 0,
    Bank = 1,
    CreditCard = 2,
    Manual = 3
}
export declare enum GenderType {
    Male = 1,
    Female = 2
}
export declare enum LoginProvider {
    Local = 1,
    Google = 2,
    Facebook = 3
}
export declare enum UserStatus {
    Inactive = 1,
    Active = 2,
    Cancelled = 3
}
export declare enum LogAction {
    GetBankStatus = 501,
    AddBank = 502,
    CreateYodleeAccount = 503,
    CronJob = 504
}
export declare enum LogModule {
    User = 1,
    Accounting = 2,
    Statement = 3,
    Transaction = 4,
    Yodlee = 5
}
export declare enum CrunchType {
    Expenses = 1,
    Drawings = 2,
    Income = 3,
    Other = 4
}
export declare enum FileType {
    Other = 0,
    Image = 1,
    Video = 2,
    Document = 3
}
export declare enum Method {
    GET = 1,
    POST = 2,
    PUT = 3,
    PATCH = 4,
    DELETE = 5
}
export declare enum AccountingStatus {
    NotAvailabel = 1,
    NotStarted = 2,
    AwaitingConfirmation = 3,
    Confirmed = 4,
    Completed = 5,
    Notcompleted = 6,
    NotDueYet = 7,
    DueSoon = 8,
    PleaseSign = 9,
    Signed = 10,
    Lodged = 11,
    Preparing = 12
}
export declare enum HistoryStatus {
    Success = 1,
    Error = 2
}
export declare enum LogStatus {
    Success = 1,
    Error = 2
}
export declare enum ServerInforName {
    CORE = "SYSTEM CORE",
    AUTHORIZATION = "AUTHORIZATION",
    BANK = "BANK",
    REPORT = "REPORT",
    LOG = "LOG"
}
export declare enum ImageProduct {
    Logo = 1,
    Favicon = 2
}
export declare enum StatusConnectBank {
    Connecting = 1,
    Connected = 2,
    NotConnected = 3
}
