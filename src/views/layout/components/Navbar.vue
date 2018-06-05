<template>
<el-menu class="navbar clearfix" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
        <el-select v-model="nowRoute" placeholder="请选择跳转地址" size="mini" filterable @change="selectRoute">
            <el-option v-for="(item,index) in router_nav" :key="index" :label="generateTitle(item.name)" :value="item.path">
            </el-option>
        </el-select>
        <!-- <error-log v-if="log.length>0" class="errLog-container right-menu-item" :logsList="log"></error-log>
        <el-badge is-dot style="display:inline;color:#666;cursor:pointer">
            <svg-icon icon-class="message" />
        </el-badge> -->
        <!-- <el-tooltip effect="dark" content="全屏" placement="bottom">
            <screenfull class="screenfull right-menu-item"></screenfull>
        </el-tooltip> -->

        <!-- <el-dropdown trigger="click" class='international' @command="handleSetLanguage">
            <div>
                <svg-icon class-name='right-menu-item international-icon' icon-class="language" />
            </div>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="zh" :disabled="language==='zh'">中文</el-dropdown-item>
                <el-dropdown-item command="en" :disabled="language==='en'">English</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown> -->

        <!-- <el-tooltip effect="dark" content="换肤" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip> -->

        <el-dropdown class="avatar-container right-menu-item" trigger="click">
            <div class="avatar-wrapper">
                <span>{{ name }}</span>
                <!-- <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'"> -->
                <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                    <router-link :to="{path: '/personalConfig'}" tag="div">系统设置</router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                    <span @click="logout" style="display:block;">退出登录</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</el-menu>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import ThemePicker from '@/components/ThemePicker'
import Screenfull from '@/components/Screenfull'
import ErrorLog from '@/components/ErrLog'
import errLogStore from 'store/errLog'
import {
    generateTitle
} from '@/utils/i18n'

import {
    getSystemNotificationByTime
} from '@/api/commonApi'

export default {
    components: {
        Breadcrumb,
        Hamburger,
        // ThemePicker,
        ErrorLog,
        //Screenfull
    },
    data() {
        return {
            router_nav: [],
            log: errLogStore.state.errLog,
            nowRoute: ''
        }
    },
    computed: {
        ...mapGetters([
            'sidebar',
            'name',
            'avatar',
            'language'
        ])
    },
    mounted() {
        this.getSystemNotificationByTime();
        this.getRouter_nav()
    },
    methods: {
        generateTitle,
        selectRoute() {
            this.$router.push({
                path: this.nowRoute
            })
        },
        // 获取最后一级路由
        getRouter_nav() {
            let _this = this
            let router = this.$store.getters.permission_routers
            router.forEach((item, index) => {
                if (item.hidden !== true && item.redirect !== 'dashboard') {
                    let router1st_path = item.path
                    let router1st_name = item.name
                    if (item.children && item.children.length != 0) {
                        item.children.forEach((item2nd, index2nd) => {
                            let router2nd_path = item2nd.path
                            let router2nd_name = item2nd.name
                            if (item2nd.children && item2nd.children.length != 0) {
                                item2nd.children.forEach((item3rd, index3rd) => {
                                    let router3rd_path = item3rd.path
                                    let router3rd_name = item3rd.name
                                    _this.router_nav.push({
                                        name: router3rd_name,
                                        path: router2nd_path + '/' + router3rd_path
                                    })
                                })
                            } else {
                                _this.router_nav.push({
                                    name: router2nd_name,
                                    path: router2nd_path
                                })
                            }
                        })
                    } else {
                        _this.router_nav.push({
                            name: router1st_name,
                            path: router1st_path
                        })
                    }
                }
            })
        },
        // 获取系统公告列表
        getSystemNotificationByTime() {
            getSystemNotificationByTime().then(res => {

            })
        },
        toggleSideBar() {
            this.$store.dispatch('toggleSideBar')
        },
        handleSetLanguage(lang) {
            this.$i18n.locale = lang
            this.$store.dispatch('setLanguage', lang)
            this.$message({
                message: 'switch language success',
                type: 'success'
            })
        },
        logout() {
            this.$store.dispatch('LogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
            })
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0 !important;
    .hamburger-container {
        line-height: 58px;
        height: 50px;
        float: left;
        padding: 0 10px;
    }
    .breadcrumb-container {
        float: left;
    }
    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }
    .right-menu {
        float: right;
        height: 100%;
        &:focus {
            outline: none;
        }
        .right-menu-item {
            display: inline-block;
            margin: 0 8px;
        }
        .screenfull {
            height: 20px;
        }
        .international {
            vertical-align: top;
            .international-icon {
                font-size: 20px;
                cursor: pointer;
                vertical-align: -5px;
            }
        }
        .theme-switch {
            vertical-align: 15px;
        }
        .avatar-container {
            height: 50px;
            margin-right: 30px;
            .avatar-wrapper {
                cursor: pointer;
                position: relative;
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 20px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
