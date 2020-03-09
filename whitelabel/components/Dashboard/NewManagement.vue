<template>
    <div class="box-white box-manage">
        <div class="sub-title">
            <h3 class="name">New Managers</h3>
            <nuxt-link :to="'/team-management'" v-if="list.length > 0" class="btn-view pull-right">VIEW ALL</nuxt-link>
        </div>
        <div v-if="list.length > 0" class="wrapper-list">
            <div class="row no-gutters item-list item-manage align-items-center" v-for="(item, index) in list" :key="index">
                <div class="col-lg-7 col-md-12 col-sm-7 col-12">
                    <img class="img-oval pull-left" :src="item.avatar || '/images/default-avatar.jpg'" :title="item.fullName"/>
                    <h4 class="name">{{item.fullName}}</h4>
                    <h4 class="email">{{item.email}}</h4>
                </div>
                <div class="col-lg-3 col-md-4 col-sm-2 col-6"><h4 class="label">{{item.roleName}}</h4> </div>
                <div class="col-lg-2 col-md-4 col-sm-1 col-12 text-right"><span class="time">{{item.createdAt | convertToDateString}}</span></div>
            </div>
        </div>
        <div v-else class="wrapper-list">
            <div class="no-data text-center">
                <img src="~/assets/images/no-data.png" alt="no data">
                <p class="text-note">No data available.</p>
            </div>
        </div>
    </div>
</template>
<script>
import Image1 from '~/assets/images/615100616-oval.jpg';
import Image2 from '~/assets/images/664811254-oval.jpg';
import Image3 from '~/assets/images/545098584-oval.jpg';
import Image4 from '~/assets/images/640021202-oval.jpg';
import Image5 from '~/assets/images/585766166-oval.jpg';
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';
import {convertToDateString} from '~/helpers/dateHelper';

export default {
    data() {
        return {
            list: [],
            productCode: null,
            roleCodes: [],
            arr: [{img: Image1, name: 'Lee Schwartz', email: 'amalia_schmeler@hotmail.com', product: 'Just Done', date: 'Just Now'},
                {img: Image2, name: 'Margaret Price', email: 'allie.torp@ebert.net', product: 'Précis', date: 'Just Now'},
                {img: Image3, name: 'Anne Reynolds', email: 'gibson_grace@kris.org', product: 'Cunning Fox', date: '11/17/2017'},
                {img: Image4, name: 'Carl Wright', email: 'nico.goodwin@bradford.ca', product: 'Fresh Number', date: '11/16/2017'},
                {img: Image5, name: 'Charlotte Ortega', email: 'tavares.schroeder@yahoo.com', position: 'Admin', product: 'White Label', date: '10/17/2017'}]
        };
    },
    async created() {
        this.productCode = this.$store.state.productCode;
        await this.getManagers();
    },
    methods: {
        async getManagers() {
            let resultRole = await this.$services.roleService.getRoles(this.productCode);
            if (resultRole.data) {
                resultRole.data.forEach(item => {
                    if (item.code)
                        this.roleCodes.push(item.code);
                });
            }

            let {data, error} = await this.$services.userService.getManagers([this.productCode], this.roleCodes, '', false, 1, 4);
            if (error)
                return false;
            if (data && data.length) {
                data.forEach(item => {
                    item.avatar = mapUrlGoogleStorage(item.avatar);
                    item.productName = item.permission && item.permission.product && item.permission.product.name;
                    item.productCode = item.permission && item.permission.product && item.permission.product.code;
                    item.roleName = item.permission && item.permission.role && item.permission.role.name;
                    item.roleCode = item.permission && item.permission.role && item.permission.role.code;
                });
                this.list = data;
            }
        },
    },
    filters: {
        convertToDateString(date) {
            return convertToDateString(date);
        }
    }
};
</script>
