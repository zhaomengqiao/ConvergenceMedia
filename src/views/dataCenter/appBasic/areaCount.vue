<template>
<keep-alive>
    <component :is="currentView" v-on:comchange="componentChange" :provname="provname" v-on:citychange="cityChange" :city="city" v-on:backchange="backChange" :backname="backname" v-on:dtchange="dtChange" :dt="dt" v-on:qdchange="qdChange" :qid="qid">
        <!-- 组件在 vm.currentview 变化时改变！ -->
    </component>
</keep-alive>
</template>
<script>
const diyu = resolve => require(['./areaComponents/diyu.vue'], resolve);
const check = resolve => require(['./areaComponents/check.vue'], resolve);
const city = resolve => require(['./areaComponents/city.vue'], resolve);
const ruanjian = resolve => require(['./areaComponents/ruanjian.vue'], resolve);
const sBar = resolve => require(['./areaComponents/sBar.vue'], resolve);
const dtdis = resolve => require(['./areaComponents/dtdis.vue'], resolve);
const lastBycity = resolve => require(['./areaComponents/lastBycity.vue'], resolve);
const qidCity = resolve => require(['./areaComponents/qidCity.vue'], resolve);
const dayCity = resolve => require(['./areaComponents/dayCity.vue'], resolve);
const totalsoft = resolve => require(['./areaComponents/totalsoft.vue'], resolve);
export default {
    data: function() {
        return {
            currentView: diyu,
            provname: '',
            city: '',
            backname: '',
            dt: '',
            qid: ''
        }
    },
    components: {
        diyu,
        check,
        city,
        ruanjian,
        sBar,
        dtdis,
        lastBycity,
        qidCity,
        dayCity,
        totalsoft
    },
    methods: {
        componentChange: function(name, provname) {
            this.currentView = name;
            console.log(name, provname);
            this.provname = provname;
        },
        cityChange: function(name, row) {
            this.currentView = name;
            this.provname = row.provname;
            this.city = row.city;
            this.qid = row.qid;
        },
        backChange: function(name, backname) {
            this.currentView = name;
            console.log(name, backname);
        },
        dtChange: function(name, row) {
            this.currentView = name;
            this.provname = row.provname;
            this.dt = row.dt;
        },
        qdChange: function(name, qid) {
            this.currentView = name;
            this.qid = qid;
        }
    }
};
</script>
<style scoped>
</style>
