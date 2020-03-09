<template>
    <!-- <div class="box-server">
        <div class="status-server">
            <div class="logo-server">
                <img src="~/assets/images/lg-justdone.svg" class="logo"/>
                <span class="name">Just Done</span>
            </div>
            <div class="title-status pull-right">
                <span>Server Status</span>
                <i class="fa fa-circle working"></i>
            </div>
        </div>
        <div class="row no-gutters row-client">
            <div class="col-6">
                <h4>New Clients</h4>
                <div class="percent new"><span class="i-con icon-up"></span>30%</div>
                <p class="number">68</p>
            </div>
            <div class="col-6">
                <h4 class="cancel">Cancel Clients</h4>
                <div class="percent cancel"><span class="i-con icon-up"></span>5%</div>
                <p class="number">2</p>
            </div>
        </div>
    </div> -->
    <div class="box-server box-white">
        <div class="sub-title">
            <div class="logo-server">
                <img :src="logo" class="logo"/>
                <span class="name">{{nameLogo}}</span>
            </div>
            <div class="title-status">
                <span>Server Status</span>
                <i class="fa fa-circle working" v-if="status==='working'"></i>
                <i class="fa fa-circle warning" v-else-if="status==='warning'"></i>
                <i class="fa fa-circle not-working" v-else></i>
            </div>
        </div>
        <div class="row no-gutters row-client">
            <div class="col-6">
                <h4>New Clients</h4>
                <div class="percent"><span class="i-con icon-up"></span>{{clientNewPercent.number}}%</div>
                <p class="number">{{clientNew}}</p>
            </div>
            <div class="col-6">
                <h4 class="cancel">Cancel Clients</h4>
                <!-- <div class="percent up" v-if="up === true"><span class="i-con icon-up"></span>{{cancelPercent.number}}%</div> -->
                <div class="percent down"><span class="i-con icon-up" :class="{none: cancelPercent === '0'}"></span>{{cancelPercent.number}}%</div>
                <p class="number">{{cancelNumber}}</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['logo', 'nameLogo', 'status', 'clientNewPercent', 'clientNew', 'cancelPercent', 'cancelNumber', 'up'],
    data() {
        return {

        };
    }
};
</script>

