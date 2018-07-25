const loadDiv = {
    bind(el, binding) {
        const selectWrap = el.querySelector('.loadDiv')
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
    window.loadDiv = loadDiv
    Vue.directive('loadDiv', loadDiv)
}


if (window.Vue) {
    Vue.use(install); // eslint-disable-line
}

loadDiv.install = install
export default loadDiv
