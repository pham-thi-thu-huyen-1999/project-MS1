<template>
    <div :id="id" class="box-progress" :class="{'show' : isShow}">
        <div class="box-head">
            <h2 class="box-title">Files uploading<span class="dots">...</span></h2>
            <div class="group-btn">
                <button class="btn-collapse" data-toggle="collapse" data-target="#boxCollapse" aria-expanded="true" @click="collapseProgress">
                    <img src="~/assets/images/icon-arrow-white.svg" alt="icon">
                </button>
                <button class="btn-close" @click="closeProgress"><img src="~/assets/images/icon-x-white.svg" alt="icon"></button>
            </div>
        </div>
        <div id="boxCollapse" class="collapse show">
            <div class="box-container">
                <div class="progress-upload">
                    <div class="progress-info">
                        <h3 class="progress-title">Product Manager.pdf</h3>
                        <span class="progress-control"><img src="~/assets/images/icon-x.svg" alt="icon"></span>
                    </div>
                    <div class="progress">
                        <div class="process-bar" role="progressbar" style="width: 30%"></div>
                    </div>
                </div>
                <div class="progress-upload">
                    <div class="progress-info">
                        <h3 class="progress-title">Cruncher report 2018.pdf</h3>
                        <span class="progress-control"><img src="~/assets/images/icon-check.svg" alt="icon"></span>
                    </div>
                    <div class="progress">
                        <div class="process-bar completed" role="progressbar" style="width: 100%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            default: ''
        },
        isShow: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        showProgress() {
            $('#' + this.id).addClass('show');
        },
        closeProgress() {
            $('#' + this.id).removeClass('show collapsed');
        },
        collapseProgress() {
            $('#' + this.id).toggleClass('collapsed');
        }
    }
};
</script>

