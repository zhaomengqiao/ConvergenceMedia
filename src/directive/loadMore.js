const loadmore = {
    bind(el, binding) {
        const selectWrap = el.querySelector('.el-table__body-wrapper')
        selectWrap.addEventListener('scroll', function() {
            let sign = 10
            const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
            if (scrollDistance <= sign) {
                binding.value()
            }
        })
    }
}

const install = function(Vue) {
    window.loadmore = loadmore
    Vue.directive('loadmore', loadmore)
}


if (window.Vue) {
    Vue.use(install); // eslint-disable-line
}

loadmore.install = install
export default loadmore
