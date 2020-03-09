<template>
    <div class="box-white box-client">
        <div class="sub-title">
            <h3 class="name">New Clients Sign Up</h3>
        </div>
        <div v-if="list.length > 0" class="wrapper-list">
            <div class="row no-gutters row-title">
                <div class="col-7"><h4 class="title-list">Client</h4></div>
                <div class="col-5 text-right"><h4 class="title-list">product</h4></div>
            </div>
            <div class="list-view">
                <div class="row no-gutters item-list align-items-center" v-for="(item, index) in list" :key="index">
                    <div class="col-7">
                        <img v-if="item.avatar" class="img-oval pull-left" :src="item.avatar || '/images/default-avatar.jpg'" title="default-avatar" alt=""/>
                        <span v-else class="circle-text pull-left">{{item.subName}}</span>
                        <h4 class="name">{{item.fullName}}</h4>
                        <h4 class="email">{{item.email}}</h4>
                    </div>
                    <div class="col-5 text-right"><h4 class="label">{{item.permission.product.name}}</h4></div>
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
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';

export default {
    data() {
        return {
            list: [],
        };
    },
    async created() {
        await this.getClients();
    },
    methods: {
        async getClients() {
            let clientIds = [];
            let {data, error} = await this.$services.userService.getClientByDate([], [], '', false, 1, 5);

            if (error)
                return false;
            if (data && data.length) {
                data.forEach(client => {
                    client.avatar = mapUrlGoogleStorage(client.avatar);
                    clientIds.push(client._id);
                    client.subName = this.trimName(client.fullName);
                });
                this.list = data;
            }
        },
        trimName(text) {
            let item = text.split(' ');
            return item[0].substring(0, 1).toUpperCase() + item[1].substring(0, 1).toUpperCase();
        }
    }
};
</script>