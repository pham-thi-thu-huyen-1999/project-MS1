<template>
    <section class="setting">
        <div class="row general">
            <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <page-title :titles="titles"/>
                        <menu-page :listMenu="listMenu"></menu-page>
                    </div>
                  
                  
                </div>
            </div>
        </div>
    </section>  
</template>

<script>
import PageTitle from '~/components/PageTitle';

export default {
    data() {
        return {
            titles: ['Sorry, this page is under construction. Please check back later!'],
        };
    },
    components: {
        PageTitle
    },
};
</script>
