<template>
    <section class="product">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <page-title :titles="titles"/>
                        <p v-if="errorText" class="form-label-error" style="font-size:11px">{{errorText}}</p>
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                        <div class="dropdown normal-btn">
                            <button @click="showProductDetail" data-toggle="modal" data-target="#add-product" class="btn dropdown-toggle not-arrow"> CREATE NEW PRODUCT</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            <div v-for="(productStatistic, index) in productStatistics" :key="index">
                <product-item :data="productStatistic"/>
            </div>
        <product-detail @createSuccess="hanldeCreateSuccess($event)" ref="createProduct"/>
    </section>
</template>

<script>
import ProductItem from '~/components/product/ProductItem';
import ProductDetail from '~/components/product/ProductDetail';
import PageTitle from '~/components/PageTitle';

export default {
    data() {
        return {
            titles: ['All Products'],
            urlImage: 'https://storage.googleapis.com',
            logo: null,
            data: null,
            errorText: null,
            statusServer: false,
            productStatistics: []
        };
    },
    components: {
        ProductItem,
        ProductDetail,
        PageTitle
    },
    async created() {
        this.reset();
        await this.getProductStatistics();
    },
    methods: {
        reset() {
            this.data = {
                list: [],
                page: 1,
                limit: 6
            };
            this.productStatistics = [];
            this.errorText = '';
        },
        showProductDetail() {
            this.$refs.createProduct.open();
        },
        async getProductStatistics() {
            this.$setLoading();
            let {data} = await this.$services.reportService.getProductStatistics();

            if (data) {
                data.sort((a, b) => {
                    return a.countClients > b.countClients ? 1 : -1;
                });

                data.sort((a, b) => {
                    return a.product.isCompleted ? 1 : -1;
                });
            }

            this.productStatistics = data || [];
            this.$setLoading(false);
        },
        async hanldeCreateSuccess(product) {
            this.productStatistics = [{product}, ...this.productStatistics];
        }
    }
};
</script>

