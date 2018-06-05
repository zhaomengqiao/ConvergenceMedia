import {
    requestLogin,
    logout,
    getUserInfo
} from '@/api/login'
import {
    Login1
} from '@/api/commonApi.js'
import {
    getToken,
    setToken,
    removeToken
} from '@/utils/auth'
import jsonp from 'jsonp';
import jQuery from 'jquery'

const user = {
    state: {
        user: '',
        status: '',
        code: '',
        token: getToken(),
        name: JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).username : '',
        avatar: '',
        introduction: '',
        roles: [],
        setting: {
            articlePlatform: []
        }
    },

    mutations: {
        SET_CODE: (state, code) => {
            state.code = code
        },
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_INTRODUCTION: (state, introduction) => {
            state.introduction = introduction
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting
        },
        SET_STATUS: (state, status) => {
            state.status = status
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        }
    },

    actions: {
        // 用户名登录
        LoginByUsername({
            commit
        }, userInfo) {
            return new Promise((resolve, reject) => {
                requestLogin(userInfo).then(response => {
                    let data = response.data
                    let url = data.url
                    // function proxyLogin(askurl, askData, okurl) {
                    //     var killAjax = true;
                    //     setTimeout(function() {
                    //         checkajaxkill();
                    //     }, 30000);
                    //     var ajaxCall = jQuery.getJSON(askurl + "?callback=?", {
                    //         askData: askData
                    //     }, function(d) {
                    //         killAjax = false;
                    //         if (d.msg == "-1") {
                    //             window.location.href = "http://sso.test.com:8080/authority/replylogin?ReturnURL=http%3A%2F%2Flocalhost%3A9527%2Flogin%2Fproxylogin";
                    //         } else {
                    //             $.post(okurl, {
                    //                 replyTxt: d.msg
                    //             }, function(e) {
                    //                 window.location.href = e.returl;
                    //             }, "json");
                    //         }
                    //     });
                    //
                    //     function checkajaxkill() {
                    //         if (killAjax) {
                    //             ajaxCall.abort();
                    //             window.location.href = "localhost:9527";
                    //         }
                    //     }
                    // }
                    // console.log(url)
                    // let queryParam = '&data=' + data.data + '&ReturnURL=' + data.ReturnURL + '&callback';
                    // jsonp(url+'?callbackparam=callback', {
                    //     'param': queryParam,
                    //     'name': 'callback'
                    // }, function(err, data) {
                    //     // console.log(err)
                    //     // console.log(data)
                    //     // Login1(data.returnUrl).then(res => {
                    //     //
                    //     // })
                    // });
                    // window.callback = function(data){
                    //     console.log(data)
                    //     Login1(data.returnUrl).then(res => {
                    //         if(res.code === '00001'){
                    //             console.log(res)
                    //             proxyLogin(res.data.askurl, res.data.askData, res.data.okurl);
                    //         }
                    //     })
                    // }


                    localStorage.setItem('user', JSON.stringify(data))
                    commit('SET_NAME', data.username)
                    // commit('SET_TOKEN', data.token)
                    // setToken(response.data.token)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetUserInfo({
            commit,
            state
        }) {
            return new Promise((resolve, reject) => {
                getUserInfo(state.token).then(response => {
                    if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
                        reject('error')
                    }
                    const data = response.data
                    commit('SET_ROLES', data.role)
                    commit('SET_NAME', data.name)
                    commit('SET_AVATAR', data.avatar)
                    commit('SET_INTRODUCTION', data.introduction)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登出
        LogOut({
            commit,
            state
        }) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    removeToken()
                    // 不删除的localStorage
                    var cantDel = ["user","authorList","auditFontSize", "auditLineHeight", "tableColumn", "tableRow", "tree", "configSource"]
                    //遍历并输出localStorage里存储的名字和值
                    for (var i = 0; i < localStorage.length; i++) {
                        if (Array.indexOf(cantDel, localStorage.key(i), 0) == -1) {
                            localStorage.removeItem(localStorage.key(i))
                        }
                    }
                    localStorage.removeItem("user")
                    localStorage.removeItem("authorList")
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 第三方验证登录
        // LoginByThirdparty({ commit, state }, code) {
        //   return new Promise((resolve, reject) => {
        //     commit('SET_CODE', code)
        //     loginByThirdparty(state.status, state.email, state.code).then(response => {
        //       commit('SET_TOKEN', response.data.token)
        //       setToken(response.data.token)
        //       resolve()
        //     }).catch(error => {
        //       reject(error)
        //     })
        //   })
        // },



        // 前端 登出
        FedLogOut({
            commit
        }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                // removeToken()
                // 不删除的localStorage
                var cantDel = ["user","authorList","auditFontSize", "auditLineHeight", "tableColumn", "tableRow", "tree", "configSource"]
                //遍历并输出localStorage里存储的名字和值
                for (let i = 0; i < localStorage.length; i++) {
                    console.log(localStorage.key(i))
                    if (Array.indexOf(cantDel, localStorage.key(i), 0) == -1) {
                        localStorage.removeItem(localStorage.key(i))
                    }
                }
                localStorage.removeItem("user")
                localStorage.removeItem("authorList")
                resolve()
            })
        },

        // 动态修改权限
        ChangeRole({
            commit
        }, role) {
            return new Promise(resolve => {
                commit('SET_TOKEN', role)
                setToken(role)
                getUserInfo(role).then(response => {
                    const data = response.data
                    commit('SET_ROLES', data.role)
                    commit('SET_NAME', data.name)
                    commit('SET_AVATAR', data.avatar)
                    commit('SET_INTRODUCTION', data.introduction)
                    resolve()
                })
            })
        }
    }
}

export default user
