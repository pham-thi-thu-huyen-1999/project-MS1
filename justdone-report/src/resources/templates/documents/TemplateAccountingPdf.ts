class TemplateAccountingPdf {
    htmlString: string;
    result: string;

    constructor(htmlString: string) {
        this.htmlString = htmlString;

        const template: string = `
        <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="initial-scale=1.0">
            <meta name="format-detection" content="telephone=no">
            <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
            <meta name="x-apple-disable-message-reformatting">
            <title></title>
            <style>
                .popup-sign{
                    overflow-x: hidden;
                    overflow-y: auto;
                    padding-left: 0 !important;
                    &.fade{
                        transition: .6s;
                        &:not(.in){
                            .modal-lg{
                                -webkit-transform: translate3d(100%, 0, 0);
                                transform: translate3d(100%, 0, 0);
                                transition: transform .5s,-webkit-transform .5s;
                            }
                        }
                        &.in{
                            .modal-lg {
                                transition: transform .8s, -webkit-transform .8s;
                            }
                        }
                    }
                    .button-close{
                        height: 38px;
                        width: 38px;
                        border-radius: 50%;
                        border: solid 1px #979797;
                        background-color: #ffffff;
                        position: absolute;
                        z-index: 1;
                        top: 20px;
                        right: 20px;
                        &:focus{
                            outline: none;
                        }
                        span{
                            display: inline-block;
                            position: relative;
                            transform: rotate(135deg);
                            bottom: 4px;
                            &:before, &:after{
                                content: '';
                                width: 17px;
                                height: 2px;
                                background-color: #979797;
                                display: block;
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                            }
                            &:after{
                                width: 2px;
                                height: 17px;
                            }
                        }
                    }
                .modal-lg{
                    margin: 0;
                    float: right;
                    //position: relative;
                    //animation: toLeft 0.5s;
                    .modal-content{
                    border: none;
                    padding: 25px 100px 344px;
                    border-radius: 0;
                        box-shadow: none;
                    .modal-body{
                        //padding: 40px 40px 0;
                        //border: solid 1px #979797;
                        h2{
                        font-family: CircularStd-Book, sans-serif;
                        font-size: 20px;
                        line-height: 1.5;
                        text-align: center;
                        color: #262c39;
                        margin-bottom: 50px;
                        }
                        .btn-default{
                        width: 194px;
                        height: 48px;
                        border-radius: 3px;
                        font-family: CircularStd-Bold, sans-serif;
                        font-size: 12px;
                        font-weight: normal;
                        line-height: 1.33;
                        letter-spacing: 1px;
                        text-align: center;
                        text-transform: uppercase;
                        margin: 41px 0;
                            color: #ffffff;
                            border: solid 1px #276cf2;
                            background-color: #276cf2;
                            &:focus{
                                outline: none;
                            }
                        &.disabled{
                            color: #72747f;
                            border: solid 1px #d0d8e4;
                            background-color: #ffffff;
                            pointer-events: none;
                        }
                        }
                        .box-content{
                        border: solid 1px #c5c6cc;  
                        .title{
                            padding-bottom: 20px;
                            h3{
                            font-family: CircularStd-Bold, sans-serif;
                            font-size: 12px;
                            color: #262c39;
                            margin-top: 0;
                            }
                        }
                        .content-item{
                            height: 30px;
                            padding-top: 4px;
                            page-break-inside : avoid ;
                            &:nth-child(even){
                            border-top: 1px solid #c5c6cc;
                            border-bottom: 1px solid #c5c6cc;
                            background-color: #f0f2f5;
                            }
                            h4, p{
                            font-family: CircularStd-Book, sans-serif;
                            font-size: 9px;
                            color: #9AD0DE;
                            margin: 0;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            }
                            p{
                            line-height: 1;
                            color: #262c39;
                            }
                        }
                        .sub-total{
                            padding-top: 18px;
                            .col-xs-12:nth-child(2n+1){
                            clear: left;
                            }
                            .col-sm-4{
                            padding-left: 0;
                            }
                            .pd-top{
                            padding-top: 10px;
                            }
                            p, h4{
                            font-size: 10px;
                            margin: 0;
                            }
                            h4{
                            line-height: 17px;
                            }
                            .text-term{
                            font-family: CircularStd-Bold;
                            margin-top: 10px;
                            }
                            .text-balance{
                            color: #9AD0DE;
                            }
                        }
                        .up-signature{
                            padding: 0px 15px 44px;
                            .btn-upload{
                                margin-top: 30px;
                                max-width: 220px;
                                width: 100%;
                            min-height: 48px;
                            border-radius: 3px;
                            background-color: #f4f3f3;
                            border: dashed 1px #1c5df4;
                            position: relative;
                            &:focus{
                                outline: none;
                            }
                            }
                            img{
                            position: absolute;
                            right: 24px;
                            top: 9px;
                            }
                            .textSignature{
                                font-family: SignericaFat;
                                font-size: 32px;
                                color: #000000;
                            }
                            .label-form{
                                margin-top: 10px;
                            }
                        }
                        }
                    }
                    }
                }
                }
                
                .page {
                    margin: 1cm auto;
                    background: #fff;
                    box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);
                    outline: 0;
                
                    width: 21cm;
                    min-height: 29.7cm;
                    padding: 2cm;
                    
                }
                
                @page {
                    size: A4 portrait;
                    margin: 2cm;
                    orphans: 4;
                    widows: 2;
                }
                
                @media print {
                    html, body {
                        /* Reset the document's background color */
                        background-color: #fff;
                    }
                    .page {
                        width: initial !important;
                        min-height: initial !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: initial !important;
                        border-radius: initial !important;
                        background: initial !important;
                        box-shadow: initial !important;
                        page-break-after: always;
                    }
                    .popup-sign {
                        .button-close{
                            display: none;
                        }
                        .modal-lg{
                            float: none !important;
                            &.modal-dialog {
                                visibility: visible !important;
                                /**Remove scrollbar for printing.**/
                                overflow: visible !important;
                            }
                            .modal-content{
                                padding: 0 !important;
                            }
                        }
                    }
                }
            </style>
        </head>
        <body>
            ${this.htmlString}
        </body>
        </html>
        `;
        this.result = template;
    }

    public getTemplate(): string {
        return this.result;
    }
}

Object.seal(TemplateAccountingPdf);
export default TemplateAccountingPdf;
