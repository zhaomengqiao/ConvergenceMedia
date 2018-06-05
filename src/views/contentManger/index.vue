<template lang="html">
    <keep-alive :include="cachedViews">
        <router-view style="padding:20px;"></router-view>
    </keep-alive>

</template>

<script>
export default {
    name: 'myContent',
    computed: {
        cachedViews() {
            // console.log(this.$store.state.tagsView.cachedViews)
            return this.$store.state.tagsView.cachedViews
        }
        // key() {
        //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
        // }
    }
}
</script>
