<template>
    <div class="filter-box">
        <div class="dropdown sort-by">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <label class="filter-title">Sort by</label>
                <span class="filter-value">Select list</span>
                <a class="icon-btn"><i class="i-con icon-sort"></i></a>
            </div>
            <ul class="dropdown-menu">
                <li class="dropdown-menu-item">
                    <a class="dropdown-link" @click.stop>
                        <span class="dropdown-link-title">
                            <input type="checkbox"/>
                            User name
                        </span>
                    </a>
                </li>
                <li class="dropdown-menu-item">
                    <a class="dropdown-link" @click.stop>
                        <span class="dropdown-link-title">
                            <input type="checkbox"/>
                            Online
                        </span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {

        };
    },
    props: {

    },
    components: {

    },
    methods: {

    }
};
</script>

