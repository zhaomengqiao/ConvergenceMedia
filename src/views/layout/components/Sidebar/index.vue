<template>
    <div>
        <scroll-bar v-show="!isCollapse">
            <el-menu mode="vertical"
                     :default-active="$route.path"
                     :collapse="false"
                     background-color="#304156"
                     text-color="#fff"
                     active-text-color="#409EFF"
                     unique-opened>
                <sidebar-item :routes="permission_routers"></sidebar-item>
            </el-menu>
        </scroll-bar>
        <el-menu mode="vertical"
                 :default-active="$route.path"
                 :collapse="true"
                 background-color="#304156"
                 text-color="#fff"
                 active-text-color="#409EFF"
                 unique-opened
                 v-show="isCollapse">
            <sidebar-item :routes="permission_routers"></sidebar-item>
        </el-menu>
    </div>

</template>

<script>
import {
    mapGetters
} from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
    components: {
        SidebarItem,
        ScrollBar
    },
    computed: {
        ...mapGetters([
            'permission_routers',
            'sidebar'
        ]),
        isCollapse() {
            return !this.sidebar.opened
        }
    }
}
</script>
