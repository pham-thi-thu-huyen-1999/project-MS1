<template>
    <section class="box-title-head">
        <h1 class="page-title">{{titles && titles.join(' / ')}}</h1>
        <div class="info-client-head" v-if="clientSelected">
            <img class="client-img" src="/images/default-avatar.jpg" :title="clientName"/>
            <h4 class="client-name">{{clientName}}</h4>
            <nuxt-link to="/client-management" class="btn btn-small">OTHER CLIENT</nuxt-link>
        </div>
    </section>
</template>

<script>
export default {
    props: ['titles'],
    data: () => ({
        clientSelected: null,
        clientName: ''
    }),
    created() {
        this.clientSelected = this.$route.path.startsWith('/client/') && this.$store.state.client;
        this.clientName = this.clientSelected && this.clientSelected.profile ? this.clientSelected.profile.firstName + ' ' + this.clientSelected.profile.lastName : '';
    },
    components: {

    },
    methods: {

    }
};
</script>

