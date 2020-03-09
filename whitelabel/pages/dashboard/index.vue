<template>
    <section class="dashboard">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-12">
                        <page-title :titles="titles"/>
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <div class="row no-gutters row-10">
                    <div class="col-12">
                        <div class="box-white chart-dasboard">
                            <div class="dropdown">
                                <a class="dropdown-toggle" data-toggle="dropdown">{{selected}}<i class="fa fa-angle-down" aria-hidden="true"></i></a>
                                <ul class="dropdown-menu" style="max-width:110px">
                                    <li class="dropdown-menu-link" @click="selectOption(1)">Week</li>
                                    <li class="dropdown-menu-link" @click="selectOption(2)">Month</li>
                                </ul>
                            </div>
                            <no-ssr>
                                <line-chart ref="lineChart" :options="options" :height="285"></line-chart>
                            </no-ssr>
                        </div>
                    </div>
                </div>
                <div class="row no-gutters row-10 row-res justify-content-center">
                    <div class="col-lg-4 col-md-6 col-sm-12 col-12"><clients-information/></div>
                    <div class="col-lg-4 col-md-6 col-sm-12 col-12"><new-clients-sign-up/></div>
                    <div class="col-lg-4 col-md-6 col-sm-12 col-12"><clients-finished-cruncher/></div>
                </div>
                <div class="row no-gutters row-10 row-res">
                    <div class="col-md-6 col-sm-12 col-12"><new-management/></div>
                    <div class="col-md-6 col-sm-12 col-12"><not-yet-finished-cruncher/></div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import PageTitle from '~/components/PageTitle';
import BoxServerStatus from '~/components/Dashboard/BoxServerStatus';
import NotYetFinishedCruncher from '~/components/Dashboard/NotYetFinishedCruncher';
import ClientsInformation from '~/components/Dashboard/ClientsInformation';
import NewManagement from '~/components/Dashboard/NewManagement';
import NewClientsSignUp from '~/components/Dashboard/NewClientsSignUp';
import ClientsFinishedCruncher from '~/components/Dashboard/ClientsFinishedCruncher';
import moment from 'moment';

export default {
    data() {
        return {
            titles: ['Dashboard'],
            boxServerStatus: [],
            lineData: {},
            options: {},
            selected: 'Week',
            isChoice: 1,
            datasets: [],
            colors: {'CODE2': '#EB5F5F', 'CODE3': '#F4AC00', 'CODE4': '#009349', 'CODE5': '#5F92EB', 'CODE6': '#14377B'},
            labels: [],
            arrDatasets: [],
            arrDate: []
        };
    },
    components: {
        PageTitle,
        BoxServerStatus,
        NotYetFinishedCruncher,
        ClientsInformation,
        NewClientsSignUp,
        NewManagement,
        ClientsFinishedCruncher
    },
    async mounted() {
        this.lineData = {
            labels: this.labels ? this.labels : [],
            datasets: this.arrDatasets
        };

        this.options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        fontColor: '#757575',
                        fontSize: 11,
                        fontFamily: 'CircularStd-Book',
                    },
                }],
                yAxes: [{
                    gridLines: {
                        drawBorder: true,
                        tickMarkLength: 20,
                        color: '#e5e5e5',
                        zeroLineColor: '#e5e5e5',
                    },
                    ticks: {
                        fontColor: '#92959c',
                        fontSize: 11,
                        fontFamily: 'CircularStd-Book',
                        suggestedMin: 0
                    },
                }]
            },
            legend: {
                labels: {
                    fontColor: '#898c93',
                    fontSize: 9,
                    fontFamily: 'CircularStd-Book',
                    padding: 20,
                },
                onHover: function(event, legendItem) {
                    document.getElementById('line-chart').style.cursor = 'pointer';
                }
            },
            hover: {
                onHover: function(e, el) {
                    $('#line-chart').css('cursor', el[0] ? 'pointer' : 'default');
                }
            },
            tooltips: {
                displayColors: false,
                xPadding: 20,
                yPadding: 10,
                callbacks: {
                    title: function(tooltipItem) {
                        return '';
                    },
                    label: function(tooltipItem, data) {
                        return tooltipItem.yLabel + '';
                    }
                },
                onHover: function(event, legendItem) {
                }
            }
        };
        this.$loading.show();
        await this.changeChart();
        this.$loading.hide();
    },
    watch: {
        'isChoice': function(value) {
            this.changeChart();
        },
    },
    methods: {
        async changeChart() {
            let results = await this.getUserLastAccess();
            let {data, error} = await this.$services.roleService.getRoles();
            if (error) {
                console.log(error);
                return;
            }
            let roles = data;
            this.labels = [];
            this.arrDatasets = [];

            for (let i = 0; i < roles.length; i++) {
                let role = roles[i];
                let color = this.colors['CODE' + role.code];
                let line = {
                    label: role.name,
                    backgroundColor: color,
                    borderColor: color,
                    pointBackgroundColor: color,
                    pointBorderColor: color,
                    pointHoverBackgroundColor: color,
                    pointHoverBorderColor: 'rgba(0, 129, 55, 0.16)',
                    pointHoverBorderWidth: 12,
                    lineTension: 0,
                    borderWidth: 1,
                    fill: false,
                    data: []
                };
                this.arrDatasets.push(line);
                let currentDate = moment(new Date());
                let date = this.isChoice === 1 ? this.addDays(new Date(), -7) : this.addMonths(new Date(), -1);

                while (currentDate.diff(date, 'days') >= 0) {
                    let d = date.format('DD MMM');
                    if (!this.labels.find(l => l === d))
                        this.labels.push(d);
                    line.data.push(0);

                    for (let j = 0; j < results.length; j++) {
                        let item = results[j];
                        let date2 = moment(item._id.createdAt, 'YYYY-MM-DD');

                        if (item._id.roleId === role._id && date.diff(date2, 'days') === 0)
                            line.data[line.data.length - 1] += item.count;
                    }
                    date = this.addDays(date, 1);
                }
            }

            this.lineData.labels = this.labels;
            this.lineData.datasets = this.arrDatasets;

            if (this.$refs.lineChart)
                this.$refs.lineChart.renderChart(this.lineData, this.options);
        },
        addDays(date, days) {
            return moment(date).add(days, 'days');
        },
        addMonths(date, months) {
            return moment(date).add(months, 'months');
        },
        async getUserLastAccess() {
            let {data, error} = await this.$services.historyService.getListSignIn(this.isChoice, this.$store.state.productCode);
            if (error)
                return false;
            else
                return data;
        },
        removeDuplicateUsingFilter(arr) {
            let unique = arr.filter(function(elem, index, self) {
                return index === self.findIndex((t) => (
                    t._id.roleId === elem._id.roleId
                ));
            });
            return unique;
        },
        selectOption(code) {
            if (code === 1) {
                this.selected = 'Week';
                this.isChoice = 1;
            }
            else {
                this.selected = 'Month';
                this.isChoice = 2;
            }
        }
    }
};
</script>
