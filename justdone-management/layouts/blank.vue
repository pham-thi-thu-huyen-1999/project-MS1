<template>
    <div id="container-template" class="container-template theme-default loading-area">
        <nuxt/>
    </div>
</template>

<script>
export default {
    middleware: ['auth'],
};
</script>