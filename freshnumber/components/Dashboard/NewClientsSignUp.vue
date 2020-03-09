<template>
    <div class="box-white box-client">
        <div class="sub-title">
            <h3 class="name">New Clients Sign Up</h3>
        </div>
        <div v-if="list.length > 0" class="wrapper-list">
            <div class="row no-gutters row-title">
                <div class="col-7"><h4 class="title-list">Client</h4></div>
                <!-- <div class="col-3"><h4 class="title-list">ABN</h4></div> -->
                <div class="col-5 text-right"><h4 class="title-list">Sign Up</h4></div>
            </div>
            <div class="list-view">
                <div class="row no-gutters item-list align-items-center" v-for="(item, index) in list" :key="index">
                    <div class="col-7">
                        <img class="img-oval pull-left" :src="item.avatar || '/images/default-avatar.jpg'" title="default-avatar" alt=""/>
                        <h4 class="name">{{item.fullName}}</h4>
                        <h4 class="email">{{item.email}}</h4>
                    </div>
                    <!-- <div class="col-3">{{item.businessInfo && item.businessInfo.abnCode || 'No data'}}</div> -->
                    <div class="col-5 text-right">{{item.createdAt | formatDate}}</div>
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
import {formatDate} from '~/helpers/dateHelper';

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
                });
                this.list = data;
            }
        },
    },
    filters: {
        formatDate,
    }
};
</script>