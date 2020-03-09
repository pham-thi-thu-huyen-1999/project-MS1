<template>
    <div class="template">
        <div class="box-template">
            <div class="head">
                <img src="~/assets/images/icon-email-temp.svg" title="" alt="">
                <h1 class="title-email">This invitation is not valid!!</h1>
            </div>
            <div class="body-mail">
                <h2 class="title-body-email">Hi mate!</h2>
                <div class="content-email">
                    <p>Welcome to White Label! You are requesting an invitation that has been expired or no longer exist. We hope to see you again soon in White Label.</p>
                    <p>You can click <a class="link" href="/register">here</a> to register an account.</p>
                    <h4 class="text-2">White Label team</h4>
                </div>
                <img class="logo-ft" src="~/assets/images/logo.svg" title="" alt="">
            </div>
        </div>
        <div class="footer">
            <span class="text-1">The team</span><span class="text-2">from White Label</span>
        </div>
    </div>
</template>
<style>
    .template{
        height: 100vh;
        padding-top: 40px;
        background-color: #f0f2f5;
    }
    .box-template{
        max-width: 648px;
        margin: 0px auto;
        border-radius: 3px;
        border-top: 2px solid #0096d0;
        padding: 35px;
        background-color: #fff;
        position: relative;
    }
    .box-template::after{
        border: 15px solid transparent;
        border-top-color: #fff;
        content: "";
        display: inline-block;
        width: 0;
        height: 0;
        vertical-align: middle;
        position: absolute;
        bottom: -30px;
        left: 50px;
    }
    .head{
        text-align: center;
    }
    .head .title-email{
        color: #0096d0;
        font-family: "CircularStd-Medium";
        font-size: 26px;
        font-weight: 500;
        margin-top:20px;
        margin-bottom: 50px; 
    }
    .content-email{
        border-bottom: 1px solid rgba(151, 151, 151, 0.17);
        padding-bottom: 10px;
        margin-bottom: 10px;
    }
    .title-body-email{
        color: #4a4a4a;
        font-family: "CircularStd-Bold";
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 30px;
    }
    p{
        color: #4a4a4a;
        font-family: "CircularStd-Book";
        font-size: 15px;
        font-weight: 300;
        line-height: 26px;
    }
    .link{
        color: #0096d0 !important;
        font-family: "CircularStd-Bold";
        border-bottom: 2px solid #0096d0;
    }
    .text-1{
        color: #4a4a4a;
        font-family: Arial;
        font-size: 14px;
        font-weight: 700;
    }
    .text-2{
        color: #9b9b9b;
        font-family: "CircularStd-Book";
        font-size: 14px;
        font-weight: 300;
        margin-top: 30px;
    }
    .logo-ft{
        max-width: 100px;
    }
    .footer{
        max-width: 648px;
        margin: 30px auto;
    }
    .text-1{
        margin-left: 30px;
        margin-right: 7px;
    }
</style>
<script>
export default {
    layout: 'blank',
};
</script>

