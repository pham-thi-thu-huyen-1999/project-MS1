<template>
    <section class="dashboard">
    </section>
</template>

<script>
export default {
    created() {
        if (process.browser && this.$route.path === '/') {
            let link = this.$auth.filterMenuDefault();
            return this.$router.push(link);
        }
    }
};
</script>



