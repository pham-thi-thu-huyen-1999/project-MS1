<template>
    <section class="team-management-statistic">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-12">
                        <page-title :titles="titles"/>
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <div class="row">
                    <div class="col-sm-6 col-12" v-for="(item, index) in arrDashboard" :key="index">
                        <div class="box-item">
                            <div class="row title-item">
                                <div class="col-md-8 col-sm-12">
                                    <img :src="item.icon" class="icon-logo"/>
                                    <h2>{{item.title}}</h2>
                                </div>
                                <div class="col-md-4 col-sm-12 text-right">
                                    <nuxt-link to="/" class="link-view">view all</nuxt-link>
                                </div>
                            </div>
                            <div class="list-content">
                                <div class="row title-list">
                                    <div class="col-lg-3 col-md-5 col-sm-12 pdl-0"><h3>Name</h3></div>
                                    <div class="col-lg-5 col-md-7 col-sm-12 "><h3>Email</h3></div>
                                    <div class="col-lg-4 col-md-7 col-sm-12 pd-0"><h3>Level</h3><h3>Actions</h3></div>
                                </div>
                                <div class="row item-list align-items-center" v-for="(item, index) in arrList" :key="index">
                                    <div class="col-lg-3 col-md-5 col-sm-12 pdl-0">
                                        <img :src="item.image" class="rounded-circle"/>
                                        <h3>{{item.name}}</h3>
                                    </div>
                                    <div class="col-lg-5 col-md-7 col-sm-12 col-email"><p>{{item.email}}</p></div>
                                    <div class="col-lg-4 col-md-7 col-sm-12 pd-0">
                                        <div class="inline-button"><button type="button" class="form-btn grey">{{item.level}}</button></div>
                                        <div class="inline-button"><button type="button" class="form-btn blue">Edit</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Dropdown from '~/components/Dropdown';
import Image1 from '~/assets/images/image-person1.png';
import Image2 from '~/assets/images/image-person2.png';
import Image3 from '~/assets/images/image-person3.png';
import Image4 from '~/assets/images/image-person4.png';
import Image5 from '~/assets/images/image-person5.png';
import Icon1 from '~/assets/images/icon-justdone.svg';
import Icon2 from '~/assets/images/icon-precis.svg';
import Icon3 from '~/assets/images/icon-cunning.jpg';
import Icon4 from '~/assets/images/icon-fresh.jpg';
import Icon5 from '~/assets/images/icon-whitelabel.svg';
import PageTitle from '~/components/PageTitle';

export default {
    data() {
        return {
            titles: ['Team management'],
            arrList: [{image: Image1, name: 'Lee Schwartz', email: 'beahan@gmail.com', level: 'Admin'},
                {image: Image2, name: 'Daisy Rivera', email: 'marilie.kunze@yahoo.com', level: 'Product Admin'},
                {image: Image3, name: 'Ivan Stephens', email: 'nader.royal@orpha.ca', level: 'Product Manager'},
                {image: Image4, name: 'Joshua Tucker', email: 'patience.veum@paula.tv', level: 'Supervisor'},
                {image: Image5, name: 'Trevor Shaw', email: 'susan.cartwright@yahoo.com', level: 'Case Manager'}],
            arrDashboard: [{icon: Icon1, title: 'Just Done'}, {icon: Icon2, title: 'Précis'}, {icon: Icon3, title: 'Cunning Fox'}, {icon: Icon4, title: 'Fresh Number'}, {icon: Icon5, title: 'White Label'}],
        };
    },
    components: {
        Dropdown,
        PageTitle
    },
};
</script>
