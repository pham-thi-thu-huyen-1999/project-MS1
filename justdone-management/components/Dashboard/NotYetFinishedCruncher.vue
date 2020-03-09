<template>
    <div class="box-white box-cruncher">
        <div class="sub-title">
            <h3 class="name">Not Yet Finished Cruncher</h3>
            <!-- <span class="date pull-right">November, 2017</span> -->
        </div>
        <div v-if="notCruncher.list && notCruncher.list.length > 0" class="wrapper-list">
            <!-- <div class="row no-gutters row-title">
                <div class="col-lg-5 col-md-5 col-sm-3 col-6"><h4 class="title-list"><span>#</span>Name</h4></div>
                <div class="col-lg-2 col-md-2 col-sm-4 col-4"><h4 class="title-list">PRODUCT</h4></div>
                <div class="col-lg-3 col-md-3 col-sm-3 col-8"><h4 class="title-list">supervisor</h4></div>
                <div class="col-lg-2 col-md-2 col-sm-2 col-4 text-right"><h4 class="title-list">DASHBOARD</h4></div>
            </div> -->
            <div class="list-view">
                <div class="row no-gutters item-list align-items-center" v-for="(item, index) in notCruncher.list" :key="index">
                    <div class="col-lg-5 col-md-5 col-sm-3 col-6">
                        <span class="circle-text pull-left">{{item.subName}}</span>
                        <h4 class="name">{{item.fullName}}</h4>
                        <h4 class="email">{{item.email}}</h4>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-4 col-4"><span class="label">{{item.permission && item.permission.product && item.permission.product.name}}</span></div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-8" v-if="item.supervisorManager">
                        <img class="img-oval pull-left" :src="item.supervisorManager.avatar || '/images/default-avatar.jpg'" title="default-avatar" alt=""/>
                        <h4 v-if="item.supervisorManager.fullName" class="name">{{item.supervisorManager.fullName}}</h4>
                        <h4 v-if="item.supervisorManager.email" class="email" :title="item.supervisorManager.email">{{item.supervisorManager.email}}</h4>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-2 col-4 text-right ml-auto"><nuxt-link class="btn" :to="`client/${item._id}/transaction`" >view</nuxt-link></div>
                </div>
            </div>
            <!-- <div class="view-all"><button class="btn-view">VIEW ALL</button></div> -->
        </div>
        <div v-else class="wrapper-list">
            <!-- <div class="set-padding">No data</div> -->
            <div class="no-data text-center">
                <img src="~/assets/images/no-data.png" alt="no data">
                <p class="text-note">No data available.</p>
            </div>
        </div>
    </div>
</template>

<script>
import {RoleCode} from '~/common/commonType';
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';

export default {
    data() {
        return {
            productCode: null,
            notCruncher: {
                list: [],
                page: 1,
                limit: 4,
            },
        };
    },
    mounted() {

    },
    async created() {
        this.productCode = this.$store.state.productCode;
        await this.getNotCruncher();
    },
    methods: {
        async getNotCruncher() {
            let {data = [], error} = await this.$services.reportService.getlistNotcruncher('', this.notCruncher.page, this.notCruncher.limit);
            if (error)
                return false;
            else {
                data.forEach((item) => {
                    item.subName = this.trimName(item.fullName);
                    item.permission.managers.forEach(manager => {
                        if (manager.permission.role.code === RoleCode.Supervisor)
                            item.supervisorManager = manager;
                    });
                    if (item.supervisorManager)
                        item.supervisorManager.avatar = mapUrlGoogleStorage(item.supervisorManager.avatar);
                });
                this.notCruncher.list = data || [];
            }
        },
        trimName(text) {
            let item = text.split(' ');
            return item[0].substring(0, 1).toUpperCase() + item[1].substring(0, 1).toUpperCase();
        }
    }
};
</script>

