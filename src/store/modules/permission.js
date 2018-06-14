import {
    asyncRouterMap,
    constantRouterMap
} from '@/router'

import {
    getAuthList
} from '@/api/login.js'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.role) {
        return roles.some(role => route.meta.role.indexOf(role) >= 0)
    } else {
        return true
    }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (hasPermission(roles, route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, roles)
            }
            return true
        }
        return false
    })
    return accessedRouters
}

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: [],
        list: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers
            state.routers = constantRouterMap.concat(routers)
        },
        SET_PERMISSION_LIST: (state, routers) => {
            state.list = routers
        }
    },
    actions: {
        GenerateRoutes({
            commit
        }, data) {
            var _this = this;
            return new Promise((resolve, reject) => {
                getAuthList().then(res => {
                    let data = res.data;
                    let filterAuthList = []
                    if (data !== null) {
                        asyncRouterMap.forEach(item => {
                            for (let i in data) {
                                if (data[i].redirect === item.meta.authUrl) {
                                    var subAuthList = []
                                    // 权限是否有二级菜单
                                    if (data[i].subItems && data[i].subItems.length !== 0) {
                                        data[i].subItems.forEach(subAuth => {
                                            // 路由是否有二级路由
                                            if (item.children && item.children.length !== 0) {
                                                item.children.forEach(subAsync => {
                                                    if (subAuth.redirect === subAsync.meta.authUrl) {
                                                        var thirdAuthList = []
                                                        // 权限是否有三级菜单
                                                        if (subAuth.subItems && subAuth.subItems.length !== 0) {
                                                            subAuth.subItems.forEach(thirdAuth => {
                                                                if (subAsync.children && subAsync.children.length !== 0) {
                                                                    subAsync.children.forEach(thirdAsync => {
                                                                        if (thirdAuth.redirect === thirdAsync.meta.authUrl) {
                                                                            // 第三层菜单
                                                                            thirdAuthList.push(thirdAsync)
                                                                        }

                                                                    })
                                                                }
                                                            })
                                                        }
                                                        subAsync.children = thirdAuthList
                                                        // 第二层菜单
                                                        subAuthList.push(subAsync)
                                                    }
                                                })
                                            }
                                        })
                                    }
                                    item.children = subAuthList
                                    // 第一层菜单
                                    filterAuthList.push(item)
                                }
                            }
                        })
                    }
                    filterAuthList.push({
                        path: '*',
                        redirect: '/404',
                        hidden: true
                    })
                    localStorage.setItem('authorList', JSON.stringify(data))
                    commit('SET_PERMISSION_LIST', data)
                    commit('SET_ROUTERS', filterAuthList)
                    resolve()
                })
            })

            // return new Promise(resolve => {
            //     const {
            //         roles
            //     } = data
            //     let accessedRouters
            //     if (roles.indexOf('admin') >= 0) {
            //         accessedRouters = asyncRouterMap
            //     } else {
            //         accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
            //     }
            //     commit('SET_ROUTERS', accessedRouters)
            //     resolve()
            // })
        }
    }
}

export default permission
