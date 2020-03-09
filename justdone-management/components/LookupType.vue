<template>
  <div class="filter-box type">
        <div class="dropdown normal">
            <div class="dropdown-toggle">
                <label class="filter-title">Type</label>
                <span class="filter-value">Global <input v-model="checked" value="true" type="radio" class="" name="select-type"></span>
                <span class="filter-value">Specific <input v-model="checked" value="false" type="radio" class="" name="select-type"></span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            checked: 'true'
        };
    },
    watch: {
        checked: function(newData) {
            this.$emit('input', newData);
        }
    }
};
</script>

