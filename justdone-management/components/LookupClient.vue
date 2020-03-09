<template>
    <div class="filter-box">
        <div class="dropdown dropdown-client">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <label class="filter-title">Client</label>
                <span class="filter-value">3 Clients</span>
                <a class="icon-btn"><i class="i-con icon-client"></i></a>
            </div>
            <i class="fa fa-times" aria-hidden="true"></i>
            <ul class="dropdown-menu">
                <li v-if="ipSearch" class="dropdown-menu-item">
                    <input class="dropdown-input" placeholder="" type="text">
                </li>
                <li class="dropdown-menu-item">
                    <a class="dropdown-link">
                        <span class="dropdown-link-title">
                            Client A
                        </span>
                        <!-- <span class="dropdown-link-notifi">
                            <template>
                                <img class="dropdown-link-notifi-img" src="~/assets/images/noti-misscrunch.svg" alt="" title="">MISS CRUNCHER
                            </template>
                        </span> -->
                        <span class="dropdown-link-email">kency@namtech.com.au</span>
                        <span class="dropdown-link-abn">
                            <span class="dropdown-link-abn-title">ABN</span>
                            <span class="dropdown-link-abn-value">260008 672 179</span>
                        </span>
                    </a>
                </li>
                <li class="dropdown-menu-item">
                    <a class="dropdown-link">
                        <span class="dropdown-link-title">
                            Client B
                        </span>
                        <span class="dropdown-link-email">kency@namtech.com.au</span>
                        <span class="dropdown-link-abn">
                            <span class="dropdown-link-abn-title">ABN</span>
                            <span class="dropdown-link-abn-value">260008 672 179</span>
                        </span>
                    </a>
                </li>
                <li class="dropdown-menu-item">
                    <a class="dropdown-link">
                        <span class="dropdown-link-title">
                            Client C
                        </span>
                        <span class="dropdown-link-email">kency@namtech.com.au</span>
                        <span class="dropdown-link-abn">
                            <span class="dropdown-link-abn-title">ABN</span>
                            <span class="dropdown-link-abn-value">260008 672 179</span>
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
        ipSearch: {
            type: Boolean,
            default: true
        }
    },
    components: {

    },
    methods: {

    }
};
</script>

