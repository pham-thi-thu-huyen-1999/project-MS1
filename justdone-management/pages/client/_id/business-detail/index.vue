<template>
    <section></section> 
</template>

<script>

export default {
    data() {
        return {
        };
    },
    created() {
        if (this.$store.state.client)
            this.$router.push(`/client/${this.$store.state.client._id}/business-detail/personal-information`);
        else
            this.$router.push('/');
    },

};
</script>

