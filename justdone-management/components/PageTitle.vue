<template>
    <section class="box-title-head">
        <h1
            class="page-title"
            v-if="titles && titles.length"
        >{{titles && titles.join(' / ')}}</h1>
        <div
            class="info-client-head d-flex align-items-center"
            v-if="clientSelected"
        >
            <span
                class="client-img"
                :title="clientName"
            >
                <div
                    :style="avatarStyle"
                    class="real-avatar"
                />
            </span>
            <h4 class="client-name mb-0">{{clientName}}</h4>
            <button
                @click="pushAndRemove()"
                class="btn btn-small"
            >OTHER CLIENT</button>
        </div>
    </section>
</template>

<script>
export default {
    props: ['titles'],
    data() {
        return {
            clientSelected: null,
            clientName: '',
            params: {},
            valuePage: '',
            avatarStyle: {
                backgroundImage: '',
            }
        };
    },
    async mounted() {
        let storage = await localStorage.pageManagement && JSON.parse(localStorage.pageManagement);
        if (storage) {
            this.params = storage[0];
        }
        this.valuePage = this.params.value;
        this.clientSelected = this.$route.path.startsWith('/client/') && this.$store.state.client;
        this.clientName = this.clientSelected && this.clientSelected.profile ? this.clientSelected.profile.firstName + ' ' + this.clientSelected.profile.lastName : '';
        this.avatarStyle.backgroundImage = `url("https://storage.googleapis.com${this.$get(this.clientSelected, 'profile.avatar', '')}")`;
    },
    methods: {
        async pushAndRemove() {
            this.$router.push(`/client-management?page=${this.valuePage}`);
            let storage = await localStorage.pageManagement && JSON.parse(localStorage.pageManagement);
            if (storage) {
                localStorage.removeItem('pageManagement');
            }
        }
    }
};
</script>
<style scoped>
.client-img {
    background-image: url("~assets/images/default-avatar.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.real-avatar {
    width: 26px;
    height: 26px;
    display: block;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
}
</style>

