<template>
    <div>
      <p>动态组件切换</p>
      <button @click="handleClick()">返回</button>
    </div>
</template>

<script>
    export default {
      methods: {
        handleClick: function() {
          this.$emit('comchange', 'versionCountIndex');
        }
      }
    }
</script>
<style scoped>

</style>
