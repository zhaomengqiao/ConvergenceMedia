<template lang="html">
    <section>
        <div class="operationTrack"
            :class="sideslipShow?'':'openOperationTrack'"
            :style="{width:boxWidth + 'px',transform: sideslipShow?'translateX(0px)':'translateX('+(boxWidth+40)+'px)'}">
            <el-tooltip effect="dark" :content="title" placement="top">
                <div class="operationTrackBtn"
                     style="cursor:pointer"
                     :style="{right: (boxWidth + 60)+'px'}"
                     v-show="!sideslipShow"
                     @click="sideShow"
                     >
                     <svg-icon :icon-class="icon" class-name="card-panel-icon" />
                     <!-- :style="{ bottom: position.y,right: position.x }" -->
                </div>
            </el-tooltip>
            <div>
                <i class="el-icon-d-arrow-right" @click="sideFold" style="cursor:pointer"></i>
                <slot></slot>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    props: {
        operationTrackShow: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: 'track'
        },
        title: {
            type: String,
            default: '操作轨迹'
        },
        boxWidth: {
            type: Number,
            default: 500
        }
    },
    data() {
        return {

        }
    },
    computed: {
        sideslipShow() {
            return this.operationTrackShow
        }
    },
    methods: {
        sideShow() {
            this.$emit('show', true)
        },
        sideFold() {
            this.$emit('fold', false)
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.operationTrack {
    width: 500px;
    height: 100%;
    padding: 20px;
    background-color: #fff;
    position: fixed;
    right: 0;
    border: 1px solid #e5e5e5;
    top: 0;
    transform: translateX(0px);
    box-shadow:0 2px 4px #e5e5e5,
    /*左边阴影*/
    0 0 0 #000,
    /*右边阴影*/
    0 0 0 #000,
    /*顶部阴影*/
    0 2px 4px #e5e5e5;
    /*底边阴影*/
    z-index: 2001;
    &.openOperationTrack {
        transform: translateX(540px);

    }
    transition: transform 0.3s;
}
.operationTrackBtn {
    position: fixed;
    right: 560px;
    bottom: 40px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    line-height: 50px;
    text-align: center;
    border: 1px solid #ccc;
    background-color: #fff;
    color: #666;
    z-index: 2002;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.3);
    transition: all 0.1s;
    font-size: 20px;
    &:hover {
        color: #409EFF;
        background-color: rgba(0,0,0,.05);
    }
}
</style>
