<template>
    <section class="new-management">
        <div class="row">
            <div class="col-md-6 col-sm-6 col-xs-12">
                <page-title :titles="titles"/>
            </div>
            <div class="col-md-6 col-sm-6 col-xs-12 text-sm-right">
                <nuxt-link to="/dashboard" class="form-btn small">back to dashboard</nuxt-link>
            </div>
        </div>
        <div class="wrapper">
            <div class="row-heading">
                <div class="row">
                    <div class="col-xl-8 col-lg-8 col-md-7 col-sm-6 col-12"><h3 class="title" style="margin-left: 30px">Name</h3></div>
                    <div class="col-xl col-lg col-md-2 col-sm col-12"><h3 class="title">PRODUCT</h3></div>
                    <div class="col-xl col-lg col-md-1 col-sm-1 col-6"><h3 class="title">ROLE</h3></div>
                    <div class="col-xl-1 col-lg col-md-2 col-sm col-6 text-sm-right"><h3 class="title">DASHBOARD</h3></div>
                </div>
            </div>
            <div class="row-item" v-for="item in 15" :key="item">
                <div class="row align-items-center">
                    <div class="col-xl-8 col-lg-8 col-md-7 col-sm-6 col-12">
                        <img src="~/assets/images/default-avatar.jpg" alt="" class="img-round rounded-circle">
                        <div class="box-inline">
                            <h3 class="name">Emma Gibson</h3>
                            <h3 class="mail">emmagibson@gmail.com</h3>
                        </div>
                    </div>
                    <div class="col-xl col-lg col-md-2 col-sm-3 col-12"><label class="product">Just Done</label></div>
                    <div class="col-xl col-lg col-md-1 col-sm-3 col-6"><span class="role">Admin</span></div>
                    <div class="col-xl-1 col-lg col-md-2 col-sm-12 col-6 text-sm-right"><button class="btn-normal">view</button></div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import PageTitle from '~/components/PageTitle';
export default {
    data() {
        return {
            titles: ['New Management'],
        };
    },
    components: {
        PageTitle
    }
};
</script>

