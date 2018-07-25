<template>
<div class="scroll-container" ref="scrollContainer" @mousewheel="handleScroll">
    <div class="scroll_new">
        <el-dropdown  @command="handleCommand" trigger="click" style="position:absolute;right:0px;top:50%;margin-top:-14px;z-index:10">
            <el-button type="primary" size="mini">
            标签选项<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="closeAll">关闭所有</el-dropdown-item>
                <el-dropdown-item command="closeThis">关闭其他</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <div class="scroll-wrapper" ref="scrollWrapper" :style="{left: left + 'px'}">
            <slot></slot>
        </div>
    </div>
</div>
</template>

<script>
const padding = 15 // tag's padding

export default {
    name: 'scrollPane',
    data() {
        return {
            left: 0
        }
    },
    methods: {
        handleScroll(e) {
            e.preventDefault()
            const $container = this.$refs.scrollContainer
            const $containerWidth = $container.offsetWidth
            const $wrapper = this.$refs.scrollWrapper
            const $wrapperWidth = $wrapper.offsetWidth

            if (e.wheelDelta > 0) {
                this.left = Math.min(0, this.left + e.wheelDelta)
            } else {
                if ($containerWidth - 120 - padding < $wrapperWidth) {
                    if (this.left < -($wrapperWidth - $containerWidth + padding + 120)) {
                        this.left = this.left
                    } else {
                        this.left = Math.max(this.left + e.wheelDelta, $containerWidth - $wrapperWidth - padding - 120)
                    }
                } else {
                    this.left = 0
                }
            }
        },
        moveToTarget($target) {
            const $container = this.$refs.scrollContainer
            const $containerWidth = $container.offsetWidth
            const $targetLeft = $target.offsetLeft
            const $targetWidth = $target.offsetWidth

            if ($targetLeft < -this.left) {
                // tag in the left
                this.left = -$targetLeft + padding
            } else if ($targetLeft + padding > -this.left && $targetLeft + $targetWidth < -this.left + $containerWidth - padding) {
                // tag in the current view
                // eslint-disable-line
                this.left = Math.min(0, $containerWidth - 120 - $targetWidth - $targetLeft - 20)
            } else {
                // tag in the right
                this.left = -($targetLeft - ($containerWidth - 120 - $targetWidth) + padding)
            }
        },
        handleCommand(command) {
            if(command === 'closeAll'){
                this.$store.commit('CLOSE_ALL_VIEWS');
                this.$router.push({
                    path:'/dashboard'
                });
            }else{
                 this.$store.commit('CLOSE_THIS_VIEW', this)
            }
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    .scroll-wrapper {
        position: absolute;
        transition: left .3s ease;
    }
    .scroll_new{
        width: 100%;
        height: 100%;
        padding-right: 120px;
        box-sizing: border-box;
    }
}
</style>
