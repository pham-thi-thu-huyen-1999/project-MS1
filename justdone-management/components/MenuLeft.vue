<template>
    <div class="container-fluid">
        <div class="row">
            <ul class="menu-left">
                <li
                    class="menu-item"
                    v-for="(menu, index) in menuLinks"
                    :key="index"
                    v-show="!menu.code || $auth.checkPermission(menu.code)"
                >
                    <nuxt-link
                        :to="menu.link"
                        class="menu-link"
                        :class="{active: $route.path.startsWith(menu.link)}"
                    ><i :class="`i-con ${menu.icon}`"></i><span class="menu-name">{{menu.title}}</span></nuxt-link>
                </li>
                <li class="menu-item logout"><a
                        class="menu-link"
                        @click="logout"
                    ><i class="i-con icon-logout"></i><span class="menu-name">Log out</span></a></li>
            </ul>
        </div>
    </div>
</template>

<script>
import EventBus from '~/plugins/event-bus';

export default {
    data() {
        return {
            menuLinks: [],
            clientSelected: null,
            clientId: ''
        };
    },
    created() {
        this.checkClientSelected(this.$store.state.client);

        EventBus.$on('MENU_VIEW', client => {
            this.checkClientSelected(client);
        });
    },
    methods: {
        checkClientSelected(client) {
            this.clientSelected = client;
            this.clientId = this.clientSelected ? this.clientSelected._id : '';
            this.menuLinks = this.$services.commonService.getMenuList(this.$module.MENU.claim, this.clientId);
        },
        logout() {
            this.$store.commit('SET_AUTH_USER', null);
            setTimeout(() => this.$router.push('/login'), 100);
        }
    }
};
</script>