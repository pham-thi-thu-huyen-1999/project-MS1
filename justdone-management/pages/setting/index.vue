<template>
    <section class="setting">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-12">
                        <page-title :titles="titles"/>
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">

            </div>
        </div>
    </section>
</template>

<script>
import PageTitle from '~/components/PageTitle';

export default {
    data() {
        return {
            titles: ['Sorry, this page is under construction. Please check back later!']
        };
    },
    components: {
        PageTitle
    },
};
</script>