<template>
  <keep-alive>
    <component :is="currentView" v-on:comchange="componentChange" :appVersion="appversion" :appType="apptype" :appQid="appqid" class="version-table">
      <!-- 组件在 vm.currentview 变化时改变！ -->
    </component>
  </keep-alive>
</template>

<script>
  const versionCountIndex = resolve => require(['./versionComponents/versionCountIndex.vue'], resolve);
  const versionCountChild = resolve => require(['./versionComponents/versionCountChild.vue'], resolve);
  const countByVersion = resolve => require(['./versionComponents/countByVersion.vue'], resolve);
  const versionDisTotal = resolve => require(['./versionComponents/versionDisTotal.vue'], resolve);
  const versionDisEvery = resolve => require(['./versionComponents/versionDisEvery.vue'], resolve);
  const versionDisVerdet = resolve => require(['./versionComponents/versionDisVerdet.vue'], resolve);
  const userFbTotal = resolve => require(['./versionComponents/userFbTotal.vue'], resolve);
  const dayQdSoft = resolve => require(['./versionComponents/dayQdSoft.vue'], resolve);
  const dayQdDet = resolve => require(['./versionComponents/dayQdDet.vue'], resolve);
  const dayQdHour = resolve => require(['./versionComponents/dayQdHour.vue'], resolve);
  const dayQdDetVersion = resolve => require(['./versionComponents/dayQdDetVersion.vue'], resolve);
  const dayQdSoftVersion = resolve => require(['./versionComponents/dayQdSoftVersion.vue'], resolve);
  const dayQdHourVersion = resolve => require(['./versionComponents/dayQdHourVersion.vue'], resolve);
  export default{
    data: function(){
      return{
        currentView: versionCountIndex,
        appversion: '',
        apptype: '',
        appqid: ''
      }
    },
    components:{
      versionCountIndex,
      versionCountChild,
      countByVersion,
      versionDisTotal,
      versionDisVerdet,
      versionDisEvery,
      userFbTotal,
      dayQdSoft,
      dayQdDet,
      dayQdHour,
      dayQdDetVersion,
      dayQdSoftVersion,
      dayQdHourVersion
    },
    methods:{
      componentChange:function(name, row){
        this.currentView = name;
        if (row) {
          this.appversion = row.appversion;
          this.apptype = row.apptype;
          this.appqid = row.appqid;
        }
        // console.log(name, row);
      }
    }
  };
</script>
<style>
  .version-table .el-table .cell, .version-table .el-table th>div {
    padding-left: 0;
    padding-right: 0;
  }
</style>
