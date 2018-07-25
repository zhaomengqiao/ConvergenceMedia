import Cookies from 'js-cookie'
import {
    getConfigSource
} from '@/api/systemTools'

const app = {
    state: {
        sidebar: {
            opened: !+Cookies.get('sidebarStatus')
        },
        language: Cookies.get('language') || 'zh',
        personalConfig: {
            auditFontSize: localStorage.getItem('auditFontSize')?Number(localStorage.getItem('auditFontSize')):16,
            auditLineHeight: localStorage.getItem('auditLineHeight')?Number(localStorage.getItem('auditLineHeight')):20,
            tableColumnShow: localStorage.getItem('tableColumn')?Number(localStorage.getItem('tableColumn')):1,
            tableRowShow: localStorage.getItem('tableRow')?Number(localStorage.getItem('tableRow')):10,
            source: localStorage.getItem('configSource')?JSON.parse(localStorage.getItem('configSource')):[],
            dfh: localStorage.getItem('configDFH')?JSON.parse(localStorage.getItem('configDFH')):[],
            editProject: localStorage.getItem('isEditProject')?JSON.parse(localStorage.getItem('isEditProject')):[]
        },
        hasNewNotify: false
    },
    mutations: {
        TOGGLE_SIDEBAR: state => {
            if (state.sidebar.opened) {
                Cookies.set('sidebarStatus', 1)
            } else {
                Cookies.set('sidebarStatus', 0)
            }
            state.sidebar.opened = !state.sidebar.opened
        },
        SET_LANGUAGE: (state, language) => {
            state.language = language
            Cookies.set('language', language)
        },
        SET_AUDIT_FONTSIZE(state,fontsize){
            state.auditFontSize = fontsize
        },
        SET_AUDIT_LINEHEIGHT(state,lineheight){
            state.auditLineHeight = lineheight
        },
        SET_TABLE_COLUMN(state,tablecolumn){
            state.tableColumnShow = tablecolumn
        },
        SET_TABLE_ROW(state,tablerow){
            state.tableRowShow = tablerow
        },
        SET_SOURCE(state,source) {
            state.personalConfig.source = JSON.parse(source)
            localStorage.setItem("configSource", source)
        },
        SET_DFH(state,dfh) {
            state.personalConfig.dfh = JSON.parse(dfh)
            localStorage.setItem("configDFH", dfh)
        },
        SET_EDITPROJECT(state,source) {
            state.personalConfig.editProject = JSON.parse(source)
            localStorage.setItem("isEditProject", source)
        },
        SET_HASNOTIFY(state,source) {
            state.hasNewNotify = source
        }
    },
    actions: {
        toggleSideBar({
            commit
        }) {
            commit('TOGGLE_SIDEBAR')
        },
        setLanguage({
            commit
        }, language) {
            commit('SET_LANGUAGE', language)
        },
        // 获取常用来源
        getConfigSource({commit}, userInfo) {
            return new Promise((resolve, reject) => {
                let params = {
                    configtype: 0,
                    username: JSON.parse(localStorage.getItem('user')).username
                }
                getConfigSource(params).then(response => {
                    if(response.code === '00001'){
                        let data = response.data
                        let sources = data.map(item => {
                            return {
                                id: item.id,
                                value: item.sourcename
                            }
                        })
                        commit('SET_SOURCE', JSON.stringify(sources))
                        resolve()
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取东方号
        getDFHaccount({commit}, userInfo) {
            return new Promise((resolve, reject) => {
                let params = {
                    configtype: 2,
                    username: JSON.parse(localStorage.getItem('user')).username
                }
                getConfigSource(params).then(response => {
                    if(response.code === '00001'){
                        let data = response.data
                        commit('SET_DFH', JSON.stringify(data))
                        resolve()
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取是否编辑保护
        getEditProject({commit}, userInfo) {
            return new Promise((resolve, reject) => {
                let params = {
                    configtype: 1,
                    username: JSON.parse(localStorage.getItem('user')).username
                }
                getConfigSource(params).then(response => {
                    if(response.code === '00001'){
                        let data = response.data
                        let editprotect = data[0].editprotect
                        commit('SET_EDITPROJECT', JSON.stringify(editprotect))
                        resolve()
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getHasNotify({
            commit
        }, notify) {
            commit('SET_HASNOTIFY', notify)
        }
    }
}

export default app
