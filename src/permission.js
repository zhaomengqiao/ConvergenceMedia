import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import {
    getToken
} from '@/utils/auth' // 验权
import {
    Message
} from 'element-ui'

// permissiom judge
// function hasPermission(roles, permissionRoles) {
//     if (roles.indexOf('admin') >= 0) return true // admin权限 直接通过
//     if (!permissionRoles) return true
//     return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }

const whiteList = ['/authredirect'] // 不重定向白名单
router.beforeEach((to, from, next) => {
    NProgress.start() // 开启Progress
    if (localStorage.getItem('user')) { // 判断是否有token
        if (to.path === '/login') {
            next({
                path: '/dashboard'
            })
            NProgress.done() // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
        } else {
            if (store.getters.permission_list !== null && store.getters.permission_list.length === 0) { // 判断当前用户是否已拉取完user_info信息
                store.dispatch('GenerateRoutes').then(() => { // 生成可访问的路由表
                    router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                    if(to.path === '/'){
                        next('/dashboard')
                    }else {
                        next({ ...to,
                            replace: true
                        })
                    }
                     // hack方法 确保addRoutes已完成 ,replace: true so the navigation will not leave a history record
                }).catch(() => {
                    Message.error('获取不到权限')
                })
            } else {
                next()
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
        } else {
            // 地方站展示页面
            if(to.path === '/'){
                next(false)
                NProgress.done()
            }else if(to.path === '/login'){
                next()
            }else{
                next('/login') // 否则全部重定向到登录页
                NProgress.done() // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
            }
        }
    }
})

router.afterEach(() => {
    NProgress.done() // 结束Progress
})
