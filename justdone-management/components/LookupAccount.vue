<template>
    <div class="filter-box">
        <div class="dropdown">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <label class="filter-title">Account</label>
                <span class="filter-value">Bank, Credit card</span>
                <a class="icon-btn"><i class="i-con icon-bank"></i></a>
            </div>
            <i class="fa fa-times" aria-hidden="true"></i>
            <ul class="dropdown-menu">
                <li class="dropdown-menu-item">
                    <a class="dropdown-link" @click.stop>
                        <span class="dropdown-link-title">
                            Bank account
                        </span>
                    </a>
                </li>
                <li class="dropdown-menu-item">
                    <a class="dropdown-link" @click.stop>
                        <span class="dropdown-link-title">
                            Credit card
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

