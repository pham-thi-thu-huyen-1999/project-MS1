class Default {
    static DOMAIN: string = 'localhost';
    static PORT: number = 3001;
    static PROJECT_NAME: string = 'SYSTEM CORE';
    static EXPIRE_DAYS: number = 15;

    static UPLOAD = {
        TMP_PATH: './tmp',
        SIZE: 1073741824,
        PATH_VIDEO: './upload/videos/',
        PATH_IMAGE: './upload/images/',
        PATH_DOCUMENT: './upload/document'
    };

    static ABN = {
        URL: 'https://abr.business.gov.au/abrxmlsearchRPC/AbrXmlSearch.asmx/SearchByABNv201408?',
        GUID: '49854556-7211-4e98-8a22-e29e88d9af1c',
    };

    static UKABN = {
        URL: 'https://api.companieshouse.gov.uk/',
        KEY: 'EMWV4AI2KJdMBsk3LwEicSCmmKjxJlRS7VE-geyl'
    }

    static ADDRESSIFY = {
        KEY: 'a686c44a-04f1-426c-afb6-09b792d6db83',
        URL: 'https://api.addressify.com.au/address/autoComplete?'
    };

    static SENDINBLUE = {
        API_KEY: 'Vwx9bXsqDFOcRHIh',
        SENDER: {
            EMAIL: 'angel1@yourbusinessangels.com.au',
            NAME: 'Admin'
        }
    };

    static REDIS = {
        REDIS_HOST: 'localhost',
        REDIS_PORT: '6379'
    };

    static DEVELOPERS = {
        'felix@namtech.com.au': 'Felix',
        'alex@namtech.com.au': 'Alet',
        'aragon@namtech.com.au': 'Aragon',
        'ashley@namtech.com.au': 'Ashley'
    };

    static ARAGON =
    `-----BEGIN PUBLIC KEY-----
    MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAvJTW2o9qRq9r0xhOFGv8
    Dug/LzU18Wl98WdYiuWAkITyvmkCBSgHJqtPFAHRB/ioABrk+HHEenpiP6IHE7u2
    bNIDVRVNlZADz0BnikalleYvumRcL679k23yVsp+jTxpz2gJ7x4ZBtYNGub6Kn2B
    9CTWLvI+5nkguYroXKyiOKGX4TLm4ONBUpO3tJ64Nps50jqeN/Ioi9c3YYZXZzjv
    fOanNTBPrpn3Zh8EtPAc0xCqjHXEcdma29kjWCFpmFossIW0uzL1H7rHKZTik1r4
    EqGrByCHWPdt0+BCbEYiwQKVoNV8VbvffOh9RcGHRFnnO2vzmCO6JqrjEsnYtFuL
    go5F7Nn2ujXIMtOPNUD+S4fQLVEzJgPcRBHPCfmttSXZK29XURV7T3Z/gqkrrTvo
    oVd3ianU8UmMkY2FuxclzLPWMEIBv3iH4jCBWm58r1JI00/GKTdHLmxhiCD0xuCD
    DGb9GzEanzhYN51ITsrmP6l32djeVMD0d4Mri8kNYVxjvXjPHznhwkKR5zfv7vZD
    UEGTWVYBgiIWNMZTaHFtSjsS3ghh9QhB1n5v9vy0zx8koUswGqTm/NJFkAPi7eQ9
    sdUkeR7McVXA8WnpLYpiHkOtgKmtHZmCEM3326raedvtl85ZhEJFGB416Nzymgm5
    FvlYGUPEiDOfBF2HmTXO+n0CAwEAAQ==
-----END PUBLIC KEY-----
    `
}
export default Default;
