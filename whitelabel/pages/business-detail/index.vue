<template>
    <section class="business-detail">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <div class="row">
                    <div class="col-lg-2 col-md-3 col-sm-12 col-xs-12">
                        <page-title :titles="['Business Detail']"/>
                        <menu-page :listMenu="listMenu"></menu-page>
                    </div>
                    <div class="col-md col-sm-12 col-xs-12">
                        <div class="box-center box-personal" v-if="tab === 1">
                            <personal-information />
                        </div>
                        <div class="box-center" v-if="tab === 2">
                            <business-information />
                        </div>
                        <div class="box-center" v-if="tab === 3">
                            <bank-information/>
                        </div>
                        <div class="box-center form-box" v-if="tab === 4">
                            <change-password />
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
import PersonalInformation from '~/components/business-detail/PersonalInformation';
import BusinessInformation from '~/components/business-detail/BusinessInformation';
import ChangePassword from '~/components/business-detail/ChangePassword';
import BankInformation from '~/components/business-detail/BankInformation';
import PageTitle from '~/components/PageTitle';

export default {
    data: () => ({
        tab: null,
        listMenu: [],
    }),
    components: {
        HistoryLogs,
        MenuPage,
        PersonalInformation,
        BusinessInformation,
        ChangePassword,
        BankInformation,
        PageTitle
    },
    watch: {
        '$route.query.tab': function(newValue) {
            this.tab = Number(newValue);
        }
    },
    created() {
        this.listMenu = this.$services.commonService.getBusinessLinks();

        this.tab = this.$route.query.tab && !isNaN(this.$route.query.tab) ? Number(this.$route.query.tab) : 1;
    }

};
</script>