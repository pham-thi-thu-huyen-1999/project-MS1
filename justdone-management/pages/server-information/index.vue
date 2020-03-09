<template>
    <section class="server-status">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-12">
                         <page-title :titles="titles"/>
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12 page-list text-lg-center text-sm-left text-center">
                <div class="row row-label d-lg-flex d-md-none">
                    <div class="col-lg col-md-2 col-sm-1 col-12">
                        <label class="col-label">Server name</label>
                    </div>
                    <div class="col-lg col-md-2 col-sm-2 col-12">
                        <label class="col-label">CPU</label>
                    </div>
                    <div class="col-lg col-md-2 col-sm-2 col-12">
                        <label class="col-label">Memory</label>
                    </div>
                    <div class="col-lg col-md-2 col-sm-2 col-12">
                        <label class="col-label">Disks</label>
                    </div>
                    <div class="col-lg col-md-2 col-sm-2 col-12">
                        <label class="col-label">Deploy time</label>
                    </div>
                    <div class="col-lg col-md-2 col-sm-2 col-12">
                        <label class="col-label">Status</label>
                    </div>
                </div>
                <div class="row item-list" v-for="(item, index) in lists" :key="index">
                    <div class="col-lg col-md-2 col-sm-2 col-12 col-stt">
                        <p class="stt-name">{{item.name}}</p>
                    </div>
                    <div class="col-lg col-md-2 col-sm-2 col-12 col-stt">
                        <div v-if="item.cpu" class="chart-circle" :id="'cpu' + index" :data-percent="Math.round(item.cpu.used)"></div>
                        <div v-else class="not-response" >Not response.</div>
                    </div>
                    <div class="col-lg col-md-2 col-sm-2 col-12 col-stt">
                        <div v-if="item.memory" class="chart-circle" :id="'memory' + index" :data-percent="Math.round(item.memory.used)"></div>
                        <div v-else class="not-response" >Not response.</div>   
                    </div>
                    <div class="col-lg col-md-2 col-sm-2 col-12 col-stt">
                        <div v-if="item.disk" class="chart-circle" :id="'disk' + index" :data-percent="Math.round(item.disk.used)"></div>
                        <div v-else class="not-response" >Not response.</div>     
                    </div>
                    <div class="col-lg col-md-2 col-sm-2 col-12 col-stt">
                        <p v-if="item.deploy" class="stt-date">{{ item.deploy | formatDate}}</p>
                        <p v-if="item.deploy" class="stt-time">{{ item.deploy | formatTime }}</p>
                        <p v-if="!item.deploy" class="stt-time">Not response.</p>               
                    </div>
                    <div class="col-lg col-md-2 col-sm-2 col-12 col-stt">
                        <p class="stt-status"><i class="fa fa-circle" :class="[item.status ? 'maintenance' : 'orange']" aria-hidden="true"></i><span>{{ item.status ? 'Operational' : 'Maintenance' }}</span></p>                        
                    </div>
                </div>
                <div class="row nor-gutters state text-left">
                    <div class="col-lg-8 col-md-8 col-sm-8 col-12">
                        <i class="fa fa-circle blue" aria-hidden="true"></i>
                        <span style="margin-right:20px;">Operational</span>
                        <i class="fa fa-circle orange" aria-hidden="true"></i>
                        <span>Maintenance</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import PageTitle from '~/components/PageTitle';
import {formatDate, formatTime} from '~/helpers/dateHelper';

export default {
    data() {
        return {
            titles: ['Server status'],
            lists: []
        };
    },
    components: {
        PageTitle
    },
    async mounted() {
        this.$setLoading();
        await this.getStatus();
        await this.createCircle();
        this.$setLoading(false);
    },
    methods: {
        createCircle() {
            var arrCanvas;
            try {
                arrCanvas = document.getElementsByClassName('chart-circle');
                setTimeout(() => {
                    for (var i = 0; i < arrCanvas.length; i++) {
                        var el = document.getElementById(arrCanvas[i].id);
                        var options = {
                            percent: el.getAttribute('data-percent') || 0,
                            size: el.getAttribute('data-size') || 62,
                            lineWidth: el.getAttribute('data-line') || 4,
                            rotate: el.getAttribute('data-rotate') || 0
                        };

                        var canvas = document.createElement('canvas');
                        var span = document.createElement('span');
                        span.textContent = options.percent + '%';
                        if (typeof (window.G_vmlCanvasManager) !== 'undefined') {
                            window.G_vmlCanvasManager.initElement(canvas);
                        }

                        var ctx = canvas.getContext('2d');
                        canvas.width = canvas.height = options.size;

                        el.appendChild(span);
                        el.appendChild(canvas);

                        ctx.translate(options.size / 2, options.size / 2);
                        ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI);

                        var radius = (options.size - options.lineWidth) / 2;

                        var drawCircle = function(color, lineWidth, percent, rotate) {
                            percent = Math.min(Math.max(0, percent || 0), 1);
                            ctx.beginPath();
                            ctx.arc(0, 0, radius, 0, -Math.PI * 2 * percent, true);
                            ctx.strokeStyle = percent === 0 ? '#e7efeb' : color;
                            ctx.lineCap = 'round';
                            ctx.lineWidth = lineWidth;
                            ctx.stroke();
                        };

                        drawCircle('#e7efeb', options.lineWidth, 100 / 100);
                        drawCircle(' #1c5df4', options.lineWidth, options.percent / 100);
                    }
                }, 200);
            }
            catch (e) {
                return false;
            }
        },
        async getStatus() {
            let {data, error} = await this.$services.systemService.getStatus();
            if (error)
                return false;
            if (data && data.length > 0) {
                data.forEach(sysInfo => {
                    if (sysInfo.name && sysInfo.name === 'RequestError') {
                        sysInfo.operatingSystem = '';
                        sysInfo.domain = '';
                        sysInfo.deploy = '';
                        sysInfo.port = '';
                    }
                });
            }
            this.lists = data;
        },
    },
    filters: {
        formatDate,
        formatTime
    }
};
</script>