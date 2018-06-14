<template>
<keep-alive>
    <div class="cmsData">
        <component :is="currentView" v-on:dtchange="dtChange" :row="row" :col="col" class="version-table">
            <!-- 组件在 vm.currentview 变化时改变！ -->
        </component>
    </div>
</keep-alive>
</template>
<script>
const logInfo = resolve => require(['./cmsDataComponents/logInfo.vue'], resolve);
const nameInfo = resolve => require(['./cmsDataComponents/nameInfo.vue'], resolve);
const lstatusInfo = resolve => require(['./cmsDataComponents/lstatusInfo.vue'], resolve);
export default {
    data: function() {
        return {
            currentView: logInfo,
            row: '',
            col: ''
        }
    },
    components: {
        logInfo,
        nameInfo,
        lstatusInfo
    },
    methods: {
        dtChange: function(name, row, col) {
            this.currentView = name;
            if (row) {
                this.row = row
            }
            if (col) {
                this.col = col
            }
        }
    }
};
</script>
<style scoped="scoped">
.version-table .el-table .cell,
.version-table .el-table th>div {
    padding-left: 0;
    padding-right: 0;
}
.cmsData{
    padding: 20px;
}
</style>
