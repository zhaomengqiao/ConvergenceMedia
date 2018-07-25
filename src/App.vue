<template>
<div id="app">
    <router-view v-show='routerView'></router-view>
    <lg-preview></lg-preview>
    <local-app v-show='!isLogin && !isHref && $route.path!="/login" && $route.path!="/404"'></local-app>
</div>
</template>

<script>
import localApp from '@/views/localApp/index.vue'

export default {
    name: 'APP',
    components: {
        localApp
    },
    data() {
        return {
            isLogin: false,
            isJianSu: true,
            routerView: false,
            isHref: false,
            // 无地方站，不白屏名单
            localHref: [
                'http://cms.dftoutiao.com:9080/',
                'http://172.18.250.87:3432/',
                'http://172.18.250.87:3322/',
                'http://rong.eastday.com/',
                'http://172.18.250.87:8800/',
                'http://localhost:9527/',
                'http://localhost:8081/'
            ]
        }
    },
    created(){
        var localHref = window.location.href
        console.log(localHref)
        for(var i = 0;i < this.localHref.length -1;i++){
            if(localHref == this.localHref[i]){
                this.isHref = true
                this.$router.push({'path':'/dashboard'})
                return
            }
        }
    },
    mounted() {
        this.homeLogin();
    },
    methods: {
        homeLogin(){//首屏区别加载
            var user = localStorage.getItem('user');
            if (user) {
                this.isLogin=true;
            }else{
                this.isLogin=false;
            }
            setTimeout(() => {
                this.routerView=true;
            }, 500);
        }
    }
}
</script>

<style lang="scss">
@import '~normalize.css/normalize.css'; // normalize.css 样式格式化
@import './styles/index.scss'; // 全局自定义样式
</style>
