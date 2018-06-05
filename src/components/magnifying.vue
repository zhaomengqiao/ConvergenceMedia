<template lang="html">
    <div class="magnifying">
        <div id="smallImg">
            <img :src="config" alt="">
            <div id="lay"></div>
        </div>
        <div id="bigImg">
            <img :src="config" alt="">
        </div>
    </div>
</template>

<script>
export default {
    props: {
        config: {
            type: String,
            default: false
        }
    },
    mounted() {
        this.$nextTick(() => {
            var lay = document.querySelector('#lay'),
                smallImg = document.querySelector('#smallImg'),
                bigImg = document.querySelector('#bigImg')
            var imgB = bigImg.children[0]
            var scale = 6
            var w = smallImg.offsetWidth;
            var h = smallImg.offsetHeight;
            lay.style.width = w / scale + "px";
            lay.style.height = h / scale + "px";

            imgB.style.width = w * scale + "px";
            imgB.style.height = h * scale + "px";

            smallImg.onmouseover = function() {
                lay.style.display = "block";
                bigImg.style.display = "block";
            }

            smallImg.onmouseout = function() {
                lay.style.display = "none";
                bigImg.style.display = "none";
            }

            smallImg.onmousemove = function(e) {
                e = e || event;
                var x = e.clientX - smallImg.getBoundingClientRect().left - lay.offsetWidth/2
                var y = e.clientY - smallImg.getBoundingClientRect().top - lay.offsetHeight/2
                if (x <= 0) { //左侧边界判断
                    x = 0;
                }
                if (y <= 0) { //顶部边界判断
                    y = 0;
                }
                if (x >= smallImg.offsetWidth - lay.offsetWidth) {
                    x = smallImg.offsetWidth - lay.offsetWidth //右侧边界判断
                }
                if (y >= smallImg.offsetHeight - lay.offsetHeight) {
                    y = smallImg.offsetHeight - lay.offsetHeight //底部边界判断
                }
                lay.style.left = x + "px";
                lay.style.top = y + "px";
                imgB.style.left = -(e.clientX - smallImg.getBoundingClientRect().left) * scale + "px"; //图片默认位置为0 0左上角位置 需要反向才能两者相对显示
                imgB.style.top = -(e.clientY - smallImg.getBoundingClientRect().top) * scale + "px";
            }
        })
    },
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.magnifying{
    position: relative;
    display: inline-block;
}
#smallImg {
    height: 500px;
    position: relative;
    display: inline-block;
    img {
        width: auto;
        max-height: 500px;
    }
}
#lay {
    position: absolute;
    left: 0;
    top: 0;
    border: 1px solid #ccc;
    opacity: 0.6;
    filter: alpha(opacity = 60);
    background: #fff;
    display: none;
    cursor: move;
}
#bigImg {
    width: 300px;
    height: 300px;
    position: absolute;
    right: -300px;
    top: 0;
    overflow: hidden;
    display: none;
}
#bigImg img {
    position: absolute;
    left: 0;
    top: 0;
}
</style>
