<template>
    <div class="box-white box-client">
        <div class="sub-title">
            <h3 class="name">Clients Finished Cruncher</h3>
        </div>
        <div v-if="completeCruncher && completeCruncher.list.length > 0" class="wrapper-list">
            <div class="row no-gutters row-title">
                <div class="col-7"><h4 class="title-list">Client</h4></div>
                <div class="col-5 text-right"><h4 class="title-list">product</h4></div>
            </div>
            <div class="list-view">
                <div class="row no-gutters item-list align-items-center" v-for="(item, index) in completeCruncher.list" :key="index">
                    <div class="col-7">
                        <!-- <img class="img-oval pull-left" src="/images/default-avatar.jpg" title="default-avatar" alt="default-avatar"/> -->
                        <span class="circle-text pull-left">{{item.subName}}</span>
                        <h4 class="name">{{item.fullName}}</h4>
                        <h4 class="email">{{item.email}}</h4>
                    </div>
                    <div class="col-5 text-right"><h4 class="label">{{item.permission && item.permission.product && item.permission.product.name}}</h4></div>
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
            productCode: null,
            completeCruncher: {
                list: [],
                page: 1,
                limit: 5,
            },
        };
    },
    async created() {
        this.productCode = this.$store.state.productCode;
        await this.getListCompleteCruncher();
    },
    methods: {
        async getListCompleteCruncher() {
            let {data = [], error} = await this.$services.reportService.getListCompleteCruncher('', this.completeCruncher.page, this.completeCruncher.limit);

            if (error)
                return false;
            else {
                data.forEach(cruncher => {
                    cruncher.subName = this.trimName(cruncher.fullName);
                    this.completeCruncher.list = data || [];
                });
            }
        },
        trimName(text) {
            let item = text.split(' ');
            return item[0].substring(0, 1).toUpperCase() + item[1].substring(0, 1).toUpperCase();
        }
    }
};
</script>

