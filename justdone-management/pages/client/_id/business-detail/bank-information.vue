<template>
    <section class="business-detail bank-information">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <page-title :titles="titles"/>
                <div class="row">
                    <div class="col-lg-2 col-md-3 col-sm-12 col-xs-12">
                        <menu-page :listMenu="listMenu"></menu-page>
                    </div>
                    <div class="col-md col-sm-12 col-xs-12">
                        <div class="box-center">
                            <div class="box-content">
                                <div class="section-bank connect-bank-small">
                                    <h3 class="box-center-title">Bank Accounts</h3>
                                    <connect-bank :editable="editable" :clientId="clientId" :accountType="1"></connect-bank>
                                    <!-- <div class="infor-bank">
                                        <div class="row">
                                            <div class="col-md-6 col-sm-6 col-xs-12">
                                                <div class="icon-bank-box">
                                                    <span class="icon-bank-min i-con"></span>
                                                </div>
                                            </div>
                                            <div class="col-md-6 col-sm-6 col-xs-12">
                                                <div class="infor-detail">BSB: 063166 | Account No. xxx7200</div>
                                            </div>
                                        </div>
                                    </div> -->
                                    <!-- <p class="wait-connect">Please wait for reconnect bank...</p> -->
                                    <!-- <button v-if="$auth.checkPermission($module.MANAGER.claim.UPDATE_CLIENT_RECONNECT_BANK.code)" @click="reconnectBank" class="form-btn">reconnect bank</button> -->
                                </div>
                                <div class="section-credit connect-bank-small">
                                    <h3 class="box-center-title">Credit Cards</h3>
                                    <connect-bank :editable="editable" :clientId="clientId" :accountType="2"></connect-bank>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-auto col-sm-12 col-xs-12">
                        <history-logs></history-logs>
                    </div>
                </div>
            </div>
        </div>
        <!-- <reconnect-confirm :id="'confirmBank'" ref="reconnectBank"/> -->
    </section>  
</template>

<script>
import HistoryLogs from '~/components/HistoryLogs';
import MenuPage from '~/components/MenuPage';
import ConnectBank from '~/components/ConnectBank';
import PageTitle from '~/components/PageTitle';
import ReconnectConfirm from '~/components/ReconnectConfirm';

export default {
    data() {
        return {
            listMenu: [],
            editable: null,
            clientId: null,
            titles: ['Business detail', 'Bank information']
        };
    },
    created() {
        if (this.$store.state.client || this.$store.state.client._id)
            this.clientId = this.$store.state.client._id;

        if (!this.clientId)
            this.editable = true;
        else this.editable = false;

        this.listMenu = this.$services.commonService.getBusinessLinks(this.$store.state.client._id, this.$store.state.productCode);
    },
    components: {
        HistoryLogs,
        ConnectBank,
        MenuPage,
        ReconnectConfirm,
        PageTitle
    },
    methods: {
        // reconnectBank() {
        //     this.$refs.reconnectBank.open({clientId: this.$store.state.client._id, productCode: this.$store.state.client.permission.product.code});
        // }
    }
};
</script>

