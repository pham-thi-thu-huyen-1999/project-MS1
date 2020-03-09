<template>
    <div class="box-white box-infomation">
        <div class="sub-title">
            <h3 class="name">Clients Infomation</h3>
        </div>
        
        <div v-if="list.length > 0" class="wrapper-list">
            <div class="row no-gutters row-title">
                <div class="col-sm-3 col-6"><h4 class="title-list">Client</h4></div>
                <div class="col-sm-4 col-6 text-sm-left text-right"><h4 class="title-list">Product</h4></div>
                <div class="col-sm-5 col-12"><h4 class="title-list">Latest client</h4></div>
            </div>
            <div class="list-view">
                <div class="row no-gutters item-list align-items-center" v-for="(item, index) in list" :key="index">
                    <div class="col-sm-3 col-6"><h4 class="client">{{item.count}}</h4></div>
                    <div class="col-sm-4 col-6 text-sm-left text-right"><h4 class="label">{{item.product && item.product.name}}</h4></div>
                    <div class="col-sm-5 col-12">
                        <img v-if="item.latestUser && item.latestUser.avatar" class="img-oval pull-left" :src="(item.latestUser && item.latestUser.avatar) || '/images/default-avatar.jpg'" title="default-avatar" alt=""/>
                        <span v-else class="circle-text pull-left">{{item.subName}}</span>
                        <h4 class="name" :title="item.latestUser && (item.latestUser.firstName + ' ' + item.latestUser.lastName)">{{item.latestUser && (item.latestUser.firstName + ' ' + item.latestUser.lastName)}}</h4>
                        <h4 class="email" :title="item.latestUser && item.latestUser.email">{{item.latestUser && item.latestUser.email}}</h4>
                    </div>
                </div>
            </div>
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
export default {
    data() {
        return {
            list: []
        };
    },
    async created() {
        await this.getClientInfo();
    },
    methods: {
        async getClientInfo() {
            let {data} = await this.$services.userService.getCountClientInfo();
            if (data) {
                data.forEach(client => {
                    let fullName = (client.latestUser && client.latestUser.firstName) + ' ' + (client.latestUser && client.latestUser.lastName);
                    client.subName = this.trimName(fullName);
                });
                this.list = data || [];
            }
        },
        trimName(text) {
            let item = text.split(' ');
            return item[0].substring(0, 1).toUpperCase() + item[1].substring(0, 1).toUpperCase();
        }
    }
};
</script>
