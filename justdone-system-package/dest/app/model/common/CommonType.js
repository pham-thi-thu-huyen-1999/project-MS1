"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClusterRequestType;
(function (ClusterRequestType) {
    ClusterRequestType[ClusterRequestType["LoadAllData"] = 1] = "LoadAllData";
    ClusterRequestType[ClusterRequestType["UpdateRole"] = 2] = "UpdateRole";
})(ClusterRequestType = exports.ClusterRequestType || (exports.ClusterRequestType = {}));
;
var GstType;
(function (GstType) {
    GstType[GstType["NotReporTable"] = 1] = "NotReporTable";
    GstType[GstType["GSTFree"] = 2] = "GSTFree";
    GstType[GstType["GST"] = 3] = "GST";
    GstType[GstType["CAP"] = 4] = "CAP";
})(GstType = exports.GstType || (exports.GstType = {}));
var GenernalJournalItemType;
(function (GenernalJournalItemType) {
    GenernalJournalItemType[GenernalJournalItemType["ADJUSTMENT"] = 1] = "ADJUSTMENT";
    GenernalJournalItemType[GenernalJournalItemType["NEWTRANSACTION"] = 2] = "NEWTRANSACTION";
})(GenernalJournalItemType = exports.GenernalJournalItemType || (exports.GenernalJournalItemType = {}));
var BusinessType;
(function (BusinessType) {
    BusinessType[BusinessType["PartnerShip"] = 1] = "PartnerShip";
    BusinessType[BusinessType["Company"] = 2] = "Company";
    BusinessType[BusinessType["SoleTrader"] = 3] = "SoleTrader";
})(BusinessType = exports.BusinessType || (exports.BusinessType = {}));
;
var ReportSettingCode;
(function (ReportSettingCode) {
    ReportSettingCode["GST"] = "4600";
    ReportSettingCode["GCA"] = "4500";
})(ReportSettingCode = exports.ReportSettingCode || (exports.ReportSettingCode = {}));
var System;
(function (System) {
    System[System["Core"] = 1] = "Core";
    System[System["Cache"] = 2] = "Cache";
    System[System["Authorization"] = 3] = "Authorization";
    System[System["Integration"] = 4] = "Integration";
    System[System["Message"] = 5] = "Message";
    System[System["Report"] = 6] = "Report";
    System[System["Management"] = 7] = "Management";
    System[System["Justdone"] = 8] = "Justdone";
    System[System["Precis"] = 9] = "Precis";
    System[System["WhiteLabel"] = 10] = "WhiteLabel";
})(System = exports.System || (exports.System = {}));
;
var ProductType;
(function (ProductType) {
    ProductType[ProductType["Management"] = 1] = "Management";
    ProductType[ProductType["Justdone"] = 2] = "Justdone";
    ProductType[ProductType["FreshNumber"] = 3] = "FreshNumber";
    ProductType[ProductType["WhiteLabel"] = 4] = "WhiteLabel";
})(ProductType = exports.ProductType || (exports.ProductType = {}));
;
var ProductCode;
(function (ProductCode) {
    ProductCode[ProductCode["Management"] = 1] = "Management";
    ProductCode[ProductCode["Justdone"] = 2] = "Justdone";
    ProductCode[ProductCode["Precis"] = 3] = "Precis";
    ProductCode[ProductCode["WhiteLabel"] = 4] = "WhiteLabel";
})(ProductCode = exports.ProductCode || (exports.ProductCode = {}));
;
var RoleCode;
(function (RoleCode) {
    RoleCode[RoleCode["Self"] = 0] = "Self";
    RoleCode[RoleCode["SuperAdmin"] = 1] = "SuperAdmin";
    RoleCode[RoleCode["RegionAdmin"] = 2] = "RegionAdmin";
    RoleCode[RoleCode["ProductAdmin"] = 3] = "ProductAdmin";
    RoleCode[RoleCode["ProductManager"] = 4] = "ProductManager";
    RoleCode[RoleCode["Supervisor"] = 5] = "Supervisor";
    RoleCode[RoleCode["CaseManager"] = 6] = "CaseManager";
    RoleCode[RoleCode["TaxAgent"] = 7] = "TaxAgent";
    RoleCode[RoleCode["Client"] = 8] = "Client";
})(RoleCode = exports.RoleCode || (exports.RoleCode = {}));
var RoleForManagement;
(function (RoleForManagement) {
    RoleForManagement[RoleForManagement["SuperAdmin"] = 1] = "SuperAdmin";
    RoleForManagement[RoleForManagement["RegionAdmin"] = 2] = "RegionAdmin";
    RoleForManagement[RoleForManagement["Supervisor"] = 5] = "Supervisor";
    RoleForManagement[RoleForManagement["CaseManager"] = 6] = "CaseManager";
    RoleForManagement[RoleForManagement["TaxAgent"] = 7] = "TaxAgent";
})(RoleForManagement = exports.RoleForManagement || (exports.RoleForManagement = {}));
var RoleForWhiteLabel;
(function (RoleForWhiteLabel) {
    RoleForWhiteLabel[RoleForWhiteLabel["ProductAdmin"] = 3] = "ProductAdmin";
    RoleForWhiteLabel[RoleForWhiteLabel["ProductManager"] = 4] = "ProductManager";
    RoleForWhiteLabel[RoleForWhiteLabel["Client"] = 8] = "Client";
})(RoleForWhiteLabel = exports.RoleForWhiteLabel || (exports.RoleForWhiteLabel = {}));
var RoleForFreshNumber;
(function (RoleForFreshNumber) {
    RoleForFreshNumber[RoleForFreshNumber["ProductAdmin"] = 3] = "ProductAdmin";
    RoleForFreshNumber[RoleForFreshNumber["Client"] = 8] = "Client";
})(RoleForFreshNumber = exports.RoleForFreshNumber || (exports.RoleForFreshNumber = {}));
var BankType;
(function (BankType) {
    BankType[BankType["None"] = 0] = "None";
    BankType[BankType["Bank"] = 1] = "Bank";
    BankType[BankType["CreditCard"] = 2] = "CreditCard";
    BankType[BankType["Manual"] = 3] = "Manual";
})(BankType = exports.BankType || (exports.BankType = {}));
;
var GenderType;
(function (GenderType) {
    GenderType[GenderType["Male"] = 1] = "Male";
    GenderType[GenderType["Female"] = 2] = "Female";
})(GenderType = exports.GenderType || (exports.GenderType = {}));
;
var LoginProvider;
(function (LoginProvider) {
    LoginProvider[LoginProvider["Local"] = 1] = "Local";
    LoginProvider[LoginProvider["Google"] = 2] = "Google";
    LoginProvider[LoginProvider["Facebook"] = 3] = "Facebook";
})(LoginProvider = exports.LoginProvider || (exports.LoginProvider = {}));
;
var UserStatus;
(function (UserStatus) {
    UserStatus[UserStatus["Inactive"] = 1] = "Inactive";
    UserStatus[UserStatus["Active"] = 2] = "Active";
    UserStatus[UserStatus["Cancelled"] = 3] = "Cancelled";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
;
var LogAction;
(function (LogAction) {
    LogAction[LogAction["GetBankStatus"] = 501] = "GetBankStatus";
    LogAction[LogAction["AddBank"] = 502] = "AddBank";
    LogAction[LogAction["CreateYodleeAccount"] = 503] = "CreateYodleeAccount";
    LogAction[LogAction["CronJob"] = 504] = "CronJob";
})(LogAction = exports.LogAction || (exports.LogAction = {}));
;
var LogModule;
(function (LogModule) {
    LogModule[LogModule["User"] = 1] = "User";
    LogModule[LogModule["Accounting"] = 2] = "Accounting";
    LogModule[LogModule["Statement"] = 3] = "Statement";
    LogModule[LogModule["Transaction"] = 4] = "Transaction";
    LogModule[LogModule["Yodlee"] = 5] = "Yodlee";
})(LogModule = exports.LogModule || (exports.LogModule = {}));
;
var CrunchType;
(function (CrunchType) {
    CrunchType[CrunchType["Expenses"] = 1] = "Expenses";
    CrunchType[CrunchType["Drawings"] = 2] = "Drawings";
    CrunchType[CrunchType["Income"] = 3] = "Income";
    CrunchType[CrunchType["Other"] = 4] = "Other";
})(CrunchType = exports.CrunchType || (exports.CrunchType = {}));
;
var FileType;
(function (FileType) {
    FileType[FileType["Other"] = 0] = "Other";
    FileType[FileType["Image"] = 1] = "Image";
    FileType[FileType["Video"] = 2] = "Video";
    FileType[FileType["Document"] = 3] = "Document";
})(FileType = exports.FileType || (exports.FileType = {}));
;
var Method;
(function (Method) {
    Method[Method["GET"] = 1] = "GET";
    Method[Method["POST"] = 2] = "POST";
    Method[Method["PUT"] = 3] = "PUT";
    Method[Method["PATCH"] = 4] = "PATCH";
    Method[Method["DELETE"] = 5] = "DELETE";
})(Method = exports.Method || (exports.Method = {}));
;
var AccountingStatus;
(function (AccountingStatus) {
    AccountingStatus[AccountingStatus["NotAvailabel"] = 1] = "NotAvailabel";
    AccountingStatus[AccountingStatus["NotStarted"] = 2] = "NotStarted";
    AccountingStatus[AccountingStatus["AwaitingConfirmation"] = 3] = "AwaitingConfirmation";
    AccountingStatus[AccountingStatus["Confirmed"] = 4] = "Confirmed";
    AccountingStatus[AccountingStatus["Completed"] = 5] = "Completed";
    AccountingStatus[AccountingStatus["Notcompleted"] = 6] = "Notcompleted";
    AccountingStatus[AccountingStatus["NotDueYet"] = 7] = "NotDueYet";
    AccountingStatus[AccountingStatus["DueSoon"] = 8] = "DueSoon";
    AccountingStatus[AccountingStatus["PleaseSign"] = 9] = "PleaseSign";
    AccountingStatus[AccountingStatus["Signed"] = 10] = "Signed";
    AccountingStatus[AccountingStatus["Lodged"] = 11] = "Lodged";
    AccountingStatus[AccountingStatus["Preparing"] = 12] = "Preparing";
})(AccountingStatus = exports.AccountingStatus || (exports.AccountingStatus = {}));
;
var HistoryStatus;
(function (HistoryStatus) {
    HistoryStatus[HistoryStatus["Success"] = 1] = "Success";
    HistoryStatus[HistoryStatus["Error"] = 2] = "Error";
})(HistoryStatus = exports.HistoryStatus || (exports.HistoryStatus = {}));
var LogStatus;
(function (LogStatus) {
    LogStatus[LogStatus["Success"] = 1] = "Success";
    LogStatus[LogStatus["Error"] = 2] = "Error";
})(LogStatus = exports.LogStatus || (exports.LogStatus = {}));
var ServerInforName;
(function (ServerInforName) {
    ServerInforName["CORE"] = "SYSTEM CORE";
    ServerInforName["AUTHORIZATION"] = "AUTHORIZATION";
    ServerInforName["BANK"] = "BANK";
    ServerInforName["REPORT"] = "REPORT";
    ServerInforName["LOG"] = "LOG";
})(ServerInforName = exports.ServerInforName || (exports.ServerInforName = {}));
var ImageProduct;
(function (ImageProduct) {
    ImageProduct[ImageProduct["Logo"] = 1] = "Logo";
    ImageProduct[ImageProduct["Favicon"] = 2] = "Favicon";
})(ImageProduct = exports.ImageProduct || (exports.ImageProduct = {}));
;
var StatusConnectBank;
(function (StatusConnectBank) {
    StatusConnectBank[StatusConnectBank["Connecting"] = 1] = "Connecting";
    StatusConnectBank[StatusConnectBank["Connected"] = 2] = "Connected";
    StatusConnectBank[StatusConnectBank["NotConnected"] = 3] = "NotConnected";
})(StatusConnectBank = exports.StatusConnectBank || (exports.StatusConnectBank = {}));
