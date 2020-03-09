<template>
    <div class="box-white box-infomation">
        <div class="sub-title">
            <h3 class="name">Clients Infomation</h3>
        </div>
        
        <div v-if="clients && clients.length" class="wrapper-list">
            <div class="row no-gutters row-title">
                <div class="col-sm-7 col-6"><h4 class="title-list">Client</h4></div>
                <!-- <div class="col-sm-3 col-6 text-sm-left "><h4 class="title-list">ABN</h4></div> -->
                <div class="col-sm-5 col-12 text-right"><h4 class="title-list">LAST ACCESS</h4></div>
            </div>
            <div class="list-view">
                <div class="row no-gutters item-list align-items-center" v-for="(item, index) in clients" :key="index">
                    <div class="col-sm-7 col-6">
                        <img class="img-oval pull-left" :src="item.avatar || '/images/default-avatar.jpg'" title="default-avatar" alt=""/>
                        <h4 class="name" :title="item.fullName">{{item.fullName}}</h4>
                        <h4 class="email" :title="item.email">{{item.email}}</h4>
                    </div>
                    <!-- <div class="col-sm-3 col-6 text-sm-left ">
                         {{item.businessInfo && item.businessInfo.abnCode || 'No data'}}
                    </div> -->
                    <div class="col-sm-5 col-12 text-right">
                        <template v-if="item.lastAccess">{{item.lastAccess | formatDate}}</template>
                        <template v-else>Not yet</template>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="wrapper-list">
            <div class="no-data text-center">
                <img src="~/assets/images/no-data.png" alt="no data">
                <p class="text-note">No data available.</p>
            </div>
        </div>
    </div>
</template>

<script>
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';
import {formatDate, formatTime} from '~/helpers/dateHelper';

export default {
    data() {
        return {
            clients: []
        };
    },
    async created() {
        await this.getClients();
    },
    methods: {
        async getClients() {
            let arrId = [];
            let {data} = await this.$services.userService.getClients(this.$store.state.productCode, '', false, 1, 10);
            if (data) {
                data.forEach(client => {
                    client.avatar = mapUrlGoogleStorage(client.avatar);
                    arrId.push(client._id);
                    if (client.lastAccess)
                        this.compareLastAcessAndNowDate(new Date(client.lastAccess), new Date());
                });

                this.clients = data || [];
            }
        },

        async compareLastAcessAndNowDate(lastAccess, current) {
            if (!lastAccess || !current)
                return;
            if (current.getTime() - lastAccess.getTime() < 3600000)
                this.isNearTime = true;
            else
                this.isNearTime = false;
        }
    },
    filters: {
        formatDate,
        formatTime
    }
};
</script>
