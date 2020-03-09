<template>
    <section class="container-fluid section-transaction">
        <menu-head></menu-head>
        <div class="wrapper" v-if="!notConnect">
            <div class="no-data" v-if="noData">
                <div class="group">
                    <div class="row group-head no-gutters">
                        <div class="col-lg-10 col-md-9 col-sm-8 col-12">
                            <button type="button" class="btn-collapse collapsed"><span>APRIL 2017</span><i class="fa fa-angle-up" aria-hidden="true"></i></button>
                        </div>
                        <div class="col-lg-2 col-md-3 col-sm-4 col-12 text-sm-right"><label class="form-label">Balance</label></div>
                    </div>
                    <div class="item-list">
                        <div class="row align-items-center">
                            <div class="col-lg-10 col-md-9 col-sm-8 col-12"><h3 class="text"><i class="icon-success yellow"></i><span>We couldn't find any credit cards</span></h3></div>
                            <div class="col-lg-2 col-md-3 col-sm-4 col-12 text-sm-right"><button type="button" class="form-btn small" @click="notConnect = true">connect</button></div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="group" v-for="(item, index) in 3" :key="index">
                    <div class="row group-head no-gutters">
                        <div class="col-lg-10 col-md-9 col-sm-8 col-12">
                            <button type="button" data-toggle="collapse" :data-target="'#collapseExample' + index" class="btn-collapse collapsed"><span>APRIL 2017</span><i class="fa fa-angle-up" aria-hidden="true"></i></button>
                        </div>
                        <div class="col-lg-2 col-md-3 col-sm-4 col-12"><label class="form-label">Balance</label></div>
                    </div>
                    <div class="group-list">
                        <div class="item-list head">
                            <div class="row align-items-center">
                                <div class="col-lg-10 col-md-9 col-sm-8 col-12"><label class="form-label">AUGUST'S CLOSING BALANCE</label></div>
                                <div class="col-lg-2 col-md-3 col-sm-4 col-12"><span class="text">$0,000.00</span><span class="form-label pull-right">AUD</span></div>
                            </div>
                        </div>
                        <div class="collapse" :id="'collapseExample' + index">
                            <div class="item-list" v-for="(item, index) in 4" :key="index">
                                <div class="row align-items-center">
                                    <div class="col-xl-1 col-lg-2 col-md-2 col-sm-2 col-12"><span class="form-label">01/04/2017</span></div>
                                    <div class="col-xl-5 col-lg-4 col-md-7 col-sm-7 col-12"><h3 class="text">Label</h3></div>
                                    <div class="col-lg col-md-3 col-sm-3"><span class="form-label">Category</span></div>
                                    <div class="col-sm col-12"><span class="text"><i class="fa fa-minus" aria-hidden="true"></i>$0,000.00</span></div>
                                    <div class="col-sm col-12"><span class="text"><i class="fa fa-plus" aria-hidden="true"></i>$0,000.00</span></div>
                                    <div class="col-xl-2 offset-xl-0 col-lg-2 offset-lg-10 col-md-3 col-sm-4 col-12"><span class="text">$0,000.00</span><span class="form-label pull-right">AUD</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <connect-bank v-else/>
    </section>
</template>
<script>
import ConnectBank from '~/components/transaction/ConnectBank';
import MenuPage from '~/components/MenuPage';
export default {
    layout: 'default',
    data() {
        return {
            notConnect: true,
            noData: false,
        };
    },
    components: {
        MenuPage,
        ConnectBank
    },
    // created() {
    //     console.log('this.$route.param', this.$route.params);
    // }
};
</script>