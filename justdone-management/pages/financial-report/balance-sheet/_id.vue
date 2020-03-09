<template>
    <div>
        <vertical-menu />
        <section class="financial-template">
            <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                    <div class="row">
                        <div class="col-md-6 col-sm-6 col-xs-12">
                            <page-title :titles="titles" />
                        </div>
                        <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                            <div class="dropdown normal-btn">
                                <nuxt-link
                                    to="/financial-report/template"
                                    class="btn dropdown-toggle not-arrow bg-grey"
                                >
                                    BACK TO LIST
                                </nuxt-link>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="report-review">
                        <div class="row report-head">
                            <div class="pd-0 col-md-6 col-sm-6 col-xs-12 title-report">
                                BALANCE SHEET
                            </div>
                            <div class="pd-0 col-md-6 col-sm-6 col-xs-12 text-right">
                                <button class="btn min-140 bolder">DOWNLOAD</button>
                                <!-- <button class="btn min-140 bolder bg-grey">CANCEL</button> -->
                            </div>
                        </div>
                        <div class="report-frame">
                            <div class="title">
                                <h2>BALANCE SHEET <br />
                                    SELBY CONTRACTING PTY LTD <br />
                                    ABN: 56 617 888 <br />
                                </h2>
                                <h3>01/07/2017 through 30/06/2018</h3>
                            </div>
                            <div class="content">
                                <table>
                                    <tbody>
                                        <tr
                                            v-for="(item, index) in dataTemplate"
                                            :class="{underlined: +item.type.underlined === 1, 'font-bold': +item.type.bold === 1}"
                                            :key="index"
                                        >
                                            <td :style="{paddingLeft: (item.type.spacing * 20)+'px'}">{{item.name}}</td>
                                            <td class="text-right">{{item.value | convertToCurrency}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import VerticalMenu from '~/components/Report/VerticalMenu';
import PageTitle from '~/components/PageTitle';
import {convertToCurrency} from '~/helpers/dataHelper';

export default {
    data() {
        return {
            titles: ['Financial Report'],
            dataTemplate: [{name: 'label1',
                type: {spacing: '1', bold: '1', underlined: '0'},
                value: 234},
            {name: 'label2',
                type: {spacing: '2', bold: '0', underlined: '0'},
                value: 2356},
            {name: 'label3',
                type: {spacing: '1', bold: '1', underlined: '1'},
                value: 4565},
            {name: 'label1',
                type: {spacing: '1', bold: '1', underlined: '0'},
                value: 234},
            {name: 'label2',
                type: {spacing: '2', bold: '0', underlined: '0'},
                value: 2356},
            {name: 'label3',
                type: {spacing: '3', bold: '1', underlined: '1'},
                value: 4565}]
        };
    },
    components: {
        PageTitle,
        VerticalMenu
    },
    async created() {
        this.titles = [this.$route.path.replace(/-/g, ' ').substr(1)];
    },
    watch: {

    },
    methods: {
        getTemplate(id) {
            let {data} = this.$services.reportService.getTemplate(id);
            if (data)
                this.dataTemplate = data;
        }
    },
    filters: {
        convertToCurrency(value) {
            return convertToCurrency(value);
        }
    }
};
</script>
