<template>
    <div class="template">
        <div class="box-template">
            <div class="head" :style="{ 'background-image': `url('${backgroundImage}')` }">
                <img src="~/assets/images/icon-email-logo.svg" title="" alt="">
                <h1 class="title-email">Welcome to Fresh Number system</h1>
                <h3 class="des-email">Thank you for joinin</h3>
            </div>
            <div class="body-mail">
                <h2 class="title-body-email">Hi John!</h2>
                <div class="content-email">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <p>Please click <a class="link">here</a> (the links will be expired in 24 hours) to sign in to Fresh Number system.</p>
                    <h4 class="text-2">Fresh Number team</h4>
                </div>
                <img class="logo-ft" src="~/assets/images/logo.png" title="" alt="">
            </div>
            <div class="shadow"></div>
        </div>
        <div class="footer">
            <span class="text-1">Auto-Responder</span><span class="text-2">from Fresh Number</span>
        </div>
    </div>
</template>
<script>
import backgroundImage from '~/assets/images/bg-head-email.png';
export default {
    data() {
        return {
            backgroundImage: ''
        };
    },
    created() {
        this.backgroundImage = backgroundImage;
    }
};
</script>

<style>
    .template{
        max-width: 648px;
        margin: 0 auto;
    }
    .box-template{
        background-color: #fff;
        position: relative;
    }
    .des-email{
        color: #ffffff;
        font-family: "CircularStd-Book";
        font-size: 15px;
        font-weight: 300;
        line-height: 26px;
        margin-bottom: 20px;
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
        left: 70px;
    }
    .head{
        text-align: center;
        background-size: cover;
        background-position: center center;
        padding: 30px 0px;
    }
    .body-mail{
        max-width: 554px;
        margin: 0 auto;
        padding: 30px;
        padding-bottom: 0;
        border-radius: 6px;
        position: relative;
        top: -35px;
        background-color: #fff;
        z-index: 2;
    }
    .shadow{
        height: 80px;
        position: absolute;
        width: 554px;
        top: 190px;
        z-index: 1;
        left: 47px;
        box-shadow: -1px -11px 12px hsla(0, 0%, 53%, 0.17);
    }
    .head .title-email{
        font-family: "CircularStd-Medium";
        font-size: 26px;
        font-weight: 500;
        margin-top:20px;
        color: #fff;
        margin-bottom: 5px; 
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
        margin-top: 30px;
    }
    .text-1{
        margin-left: 50px;
        margin-right: 7px;
    }
</style>

