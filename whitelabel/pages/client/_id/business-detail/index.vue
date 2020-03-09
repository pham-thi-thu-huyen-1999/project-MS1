<template>
    <section class="business-detail">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <page-title :titles="titles"/>
                <div class="row">
                    <div class="col-lg-2 col-md-3 col-sm-12 col-xs-12">
                        <menu-page :listMenu="listMenu"></menu-page>
                    </div>
                    <div class="col-md col-sm-12 col-xs-12">
                        <div class="box-center box-personal" v-if="tab === 1">
                            <personal-information :clientId="clientId" />
                        </div>
                        <div class="box-center"  v-if="tab === 2">
                           <business-information :clientId="clientId"/>
                        </div>
                        <div class="box-center" v-if="tab === 3">
                            <bank-information :clientId="clientId" />
                        </div>
                    </div>
                    <div class="col-md-auto col-sm-12 col-xs-12">
                        <history-logs></history-logs>
                    </div>
                </div>
            </div>
        </div>
    </section>  
</template>

<script>
import HistoryLogs from '~/components/HistoryLogs';
import MenuPage from '~/components/MenuPage';
import PageTitle from '~/components/PageTitle';
import PersonalInformation from '~/components/business-detail/PersonalInformation';
import BusinessInformation from '~/components/business-detail/BusinessInformation';
import ChangePassword from '~/components/business-detail/ChangePassword';
import BankInformation from '~/components/business-detail/BankInformation';

export default {
    data() {
        return {
            listMenu: [],
            titles: ['Business detail'],
            tab: null,
            clientId: null,
        };
    },
    watch: {
        '$route.query.tab': function(newValue) {
            this.tab = Number(newValue);
        }
    },
    async created() {
        this.listMenu = this.$services.commonService.getBusinessLinks(this.$route.params.id);
        this.tab = this.$route.query.tab && !isNaN(this.$route.query.tab) ? Number(this.$route.query.tab) : 1;

        if (this.$route.params && this.$route.params.id)
            this.clientId = this.$route.params.id;
    },
    components: {
        HistoryLogs,
        MenuPage,
        PageTitle,
        PersonalInformation,
        BusinessInformation,
        ChangePassword,
        BankInformation,
    },
    methods: {

    }
};
</script>
