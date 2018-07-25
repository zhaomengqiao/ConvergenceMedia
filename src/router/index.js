import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    role: ['admin','editor']     will control the page role (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [{
        path: '/login',
        component: _import('login/index'),
        hidden: true
    },
    {
        path: '/authredirect',
        component: _import('login/authredirect'),
        hidden: true
    },
    {
        path: '/404',
        component: _import('errorPage/404'),
        hidden: true
    },
    {
        path: '/401',
        component: _import('errorPage/401'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        name: 'home',
        meta: {
            title: 'home'
        },
        children: [{
            path: '/dashboard',
            component: _import('dashboard/index'),
            name: 'dashboard',
            meta: {
                title: 'dashboard',
                icon: 'dashboard',
                noCache: true
            }
        }]
    },
    {
        path: '',
        component: Layout,
        hidden: true,
        redirect: 'noredirect',
        children: [{
            path: 'personalConfig',
            component: _import('systemTools/personalConfig'),
            name: 'personalConfig',
            meta: {
                title: 'personalConfig',
                icon: 'personalConfig',
                noCache: true
            }
        }]
    },
    {
        path: '',
        component: Layout,
        hidden: true,
        redirect: 'noredirect',
        children: [{
            path: 'test',
            component: _import('test/test'),
            name: 'notify',
            meta: {
                title: 'notify',
                icon: 'personalConfig',
                noCache: true
            }
        }]
    }
    // {
    //     path: '',
    //     component: Layout,
    //     hidden: true,
    //     redirect: 'noredirect',
    //     children: [{
    //         path: 'notify',
    //         component: _import('systemTools/notify'),
    //         name: 'notify',
    //         meta: {
    //             title: 'notify',
    //             icon: 'personalConfig',
    //             noCache: true
    //         }
    //     }]
    // }
    // {
    //     path: '/documentation',
    //     component: Layout,
    //     redirect: '/documentation/index',
    //     children: [{
    //         path: 'index',
    //         component: _import('documentation/index'),
    //         name: 'documentation',
    //         meta: {
    //             title: 'documentation',
    //             icon: 'documentation',
    //             noCache: true
    //         }
    //     }]
    // }
]

export default new Router({
    mode: 'history', //后端支持可开
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRouterMap
})

export const asyncRouterMap = [
    {
        path: '/audit',
        component: Layout,
        redirect: 'noredirect',
        name: 'contentAudit',
        meta: {
            title: 'contentAudit',
            icon: 'audit',
            authUrl: 'v4blank27'
        },
        children: [
            {
                path: '/audit/wemedia',
                component: _import('contentAudit/index'),
                redirect: 'noredirect',
                name: 'wemedia',
                meta: {
                    title: 'wemedia',
                    icon: '',
                    authUrl: 'wemedia/audit'
                },
                children: [
                    {
                        path: 'news',
                        component: _import('contentAudit/weMedia/newsSelfaudit'),
                        name: 'wemediaNews',
                        meta: {
                            title: 'wemediaNews',
                            icon: '',
                            noCache: false,
                            authUrl: 'wemedia/news/detail'
                        }
                    },
                    {
                        path: 'video',
                        component: _import('contentAudit/weMedia/videoSelfaudit'),
                        name: 'wemediaVideos',
                        meta: {
                            title: 'wemediaVideos',
                            icon: '',
                            noCache: false,
                            authUrl: 'wemedia/video/detail'
                        }
                    },
                    {
                        path: 'picture',
                        component: _import('contentAudit/weMedia/pictureWeaudit'),
                        name: 'wemediaPictures',
                        meta: {
                            title: 'wemediaPictures',
                            icon: '',
                            noCache: false,
                            authUrl: 'wemedia/picture/detail'
                        }
                    },
                    {
                        path: 'shortVideo',
                        component: _import('contentAudit/weMedia/shortVideoAudit'),
                        name: 'shortVideoAudit',
                        meta: {
                            title: 'shortVideoAudit',
                            icon: '',
                            noCache: false,
                            authUrl: 'wemedia/shortvideo/detail'
                        }
                    }
                ]
            },
            {
                path: '/audit/selfmedia',
                component: _import('contentAudit/index'),
                redirect: 'noredirect',
                name: 'selfmedia',
                meta: {
                    title: 'selfmedia',
                    icon: '',
                    authUrl: 'selfmedia/audit'
                },
                children: [
                    {
                        path: 'news',
                        component: _import('contentAudit/dfhSelfMedia/newsDFHaudit'),
                        name: 'selfmediaNews',
                        meta: {
                            title: 'selfmediaNews',
                            icon: '',
                            noCache: false,
                            authUrl: 'selfmedia/news/detail'
                        }
                    },
                    {
                        path: 'video',
                        component: _import('contentAudit/dfhSelfMedia/videosDFHaudit'),
                        name: 'selfmediaVideos',
                        meta: {
                            title: 'selfmediaVideos',
                            icon: '',
                            noCache: false,
                            authUrl: 'selfmedia/video/detail'
                        }
                    },
                    {
                        path: 'picture',
                        component: _import('contentAudit/dfhSelfMedia/pictureSelfaudit'),
                        name: 'selfmediaPictures',
                        meta: {
                            title: 'selfmediaPictures',
                            icon: '',
                            noCache: false,
                            authUrl: 'selfmedia/picture/detail'
                        }
                    }
                ]
            },
            {
                path: '/audit/contentSortout',
                component: _import('contentAudit/index'),
                redirect: 'noredirect',
                name: 'contentSortout',
                meta: {
                    title: 'contentSortout',
                    icon: '',
                    authUrl: 'content/sorting-tab'
                },
                children: [
                    {
                        path: 'news',
                        component: _import('contentAudit/contentSortout/newsSortout'),
                        name: 'newsSortout',
                        meta: {
                            title: 'newsSortout',
                            icon: '',
                            noCache: false,
                            authUrl: 'content/classify'
                        }
                    },
                    {
                        path: 'video',
                        component: _import('contentAudit/contentSortout/videosSortout'),
                        name: 'videosSortout',
                        meta: {
                            title: 'videosSortout',
                            icon: '',
                            noCache: false,
                            authUrl: 'my/videoSorting'
                        }
                    },
                    {
                        path: 'sortoutList',
                        component: _import('contentAudit/contentSortout/contentSortoutList'),
                        name: 'sortoutList',
                        meta: {
                            title: 'sortoutList',
                            icon: '',
                            noCache: false,
                            authUrl: 'my/classifylog'
                        }
                    }
                ]
            },
            {
                path: '/audit/dfwmedia',
                component: _import('contentAudit/index'),
                redirect: 'noredirect',
                name: 'dfwmedia',
                meta: {
                    title: 'dfwmedia',
                    icon: '',
                    authUrl: 'eastday/audit'
                },
                children: [
                    {
                        path: 'firstCheck',
                        component: _import('contentAudit/dfwMedia/dfwmediaFirstCheck'),
                        name: 'dfwmediaFirstCheck',
                        meta: {
                            title: 'dfwmediaFirstCheck',
                            icon: '',
                            noCache: false,
                            authUrl: 'dfw/audit/check'
                        }
                    },
                    {
                        path: 'reCheck',
                        component: _import('contentAudit/dfwMedia/dfwmediaRecheck'),
                        name: 'dfwmediaRecheck',
                        meta: {
                            title: 'dfwmediaRecheck',
                            icon: '',
                            noCache: false,
                            authUrl: 'dfw/audit/recheck'
                        }
                    },
                    {
                        path: 'thirdCheck',
                        component: _import('contentAudit/dfwMedia/dfwmediaThirdcheck'),
                        name: 'dfwmediaThirdcheck',
                        meta: {
                            title: 'dfwmediaThirdcheck',
                            icon: '',
                            noCache: false,
                            authUrl: 'dfw/audit/thirdcheck'
                        }
                    }
                ]
            },
            {
                path: 'classifyAudit',
                component: _import('contentAudit/classifyMedia/classifyAudit'),
                name: 'classifyAudit',
                meta: {
                    title: 'classifyAudit',
                    icon: '',
                    authUrl: 'classify/news/audit'
                }
            },
            {
                path: 'rejectEdit',
                component: _import('contentAudit/rejectEdit/rejectEdit'),
                name: 'rejectEdit',
                meta: {
                    title: 'rejectEdit',
                    icon: '',
                    authUrl: 'auditReject'
                }
            },
            {
                path: 'accountAudit',
                component: _import('contentAudit/accountAudit/accountAudit'),
                name: 'accountAudit',
                meta: {
                    title: 'accountAudit',
                    icon: '',
                    authUrl: 'contentReview'
                }
            },
            {
                path: '/audit/auditData',
                component: _import('contentAudit/index'),
                redirect: 'noredirect',
                name: 'auditData',
                meta: {
                    title: 'auditData',
                    icon: '',
                    authUrl: 'auditMonitoring'
                },
                children: [
                    {
                        path: 'dfw',
                        component: _import('contentAudit/auditData/auditData_DFW'),
                        name: 'auditData_DFW',
                        meta: {
                            title: 'auditData_DFW',
                            icon: '',
                            noCache: false,
                            authUrl: 'auditData/DFW/news'
                        }
                    },
                    {
                        path: 'allList',
                        component: _import('contentAudit/auditData/auditData_All'),
                        name: 'auditData_All',
                        meta: {
                            title: 'auditData_All',
                            icon: '',
                            noCache: false,
                            authUrl: 'auditData/All/list'
                        }
                    },
                    {
                        path: 'allDetail',
                        component: _import('contentAudit/auditData/auditData_Detail'),
                        name: 'auditData_Detail',
                        meta: {
                            title: 'auditData_Detail',
                            icon: '',
                            noCache: false,
                            authUrl: 'auditData/All/detail'
                        }
                    },
                    {
                        path: 'auditData_comment_All',
                        component: _import('contentAudit/auditData/auditData_comment_All'),
                        name: 'auditData_comment_All',
                        meta: {
                            title: 'auditData_comment_All',
                            icon: '',
                            noCache: false,
                            authUrl: 'auditData/comment/list'
                        }
                    },
                    {
                        path: 'audit_comment_Detail',
                        component: _import('contentAudit/auditData/audit_comment_Detail'),
                        name: 'audit_comment_Detail',
                        meta: {
                            title: 'audit_comment_Detail',
                            icon: '',
                            noCache: false,
                            authUrl: 'auditData/comment/detail'
                        }
                    },
                    {
                        path: 'audit_nickName_All',
                        component: _import('contentAudit/auditData/audit_nickName_All'),
                        name: 'audit_nickName_All',
                        meta: {
                            title: 'audit_nickName_All',
                            icon: '',
                            noCache: false,
                            authUrl: 'auditData/nickName/list'
                        }
                    },
                    {
                        path: 'audit_nickName_Detail',
                        component: _import('contentAudit/auditData/audit_nickName_Detail'),
                        name: 'audit_nickName_Detail',
                        meta: {
                            title: 'audit_nickName_Detail',
                            icon: '',
                            noCache: false,
                            authUrl: 'auditData/nickName/detail'
                        }
                    }
                ]
            },
            {
                path: '/audit/auditPatrol',
                component: _import('contentAudit/index'),
                redirect: 'noredirect',
                name: 'auditPatrol',
                meta: {
                    title: 'auditPatrol',
                    icon: '',
                    authUrl: 'audit/patrol'
                },
                children: [
                    {
                        path: 'auditPatrolTools',
                        component: _import('contentAudit/auditPatrol/auditPatrol'),
                        name: 'auditPatrolTools',
                        meta: {
                            title: 'auditPatrol',
                            icon: '',
                            noCache: false,
                            authUrl: 'audit/patrol/tools'
                        }
                    },
                    {
                        path: 'auditPatrolList',
                        component: _import('contentAudit/auditPatrol/auditPatrolList'),
                        name: 'auditPatrolList',
                        meta: {
                            title: 'auditPatrolList',
                            icon: '',
                            noCache: false,
                            authUrl: 'audit/patrol/list'
                        }
                    },
                    {
                        path: 'auditPatrolDetail',
                        component: _import('contentAudit/auditPatrol/auditPatrolDetail'),
                        name: 'auditPatrolDetail',
                        meta: {
                            title: 'auditPatrolDetail',
                            icon: '',
                            noCache: false,
                            authUrl: 'audit/patrol/details'
                        }
                    }
                ]
            },
            {
                path: 'dfwCarNewsAudit',
                component: _import('contentAudit/dfwCarAudit/dfwCarNewsAudit'),
                name: 'dfwCarNewsAudit',
                meta: {
                    title: 'dfwCarNewsAudit',
                    icon: '',
                    authUrl: 'eastdayqiche/audit'
                }
            },
            {
                path: 'searchAudit',
                component: _import('contentAudit/searchAudit/searchAudit'),
                name: 'searchAudit',
                meta: {
                    title: 'searchAudit',
                    icon: '',
                    authUrl: 'search/audit'
                }
            }
        ]
    },
    {
        path: '/contentManage',
        component: Layout,
        redirect: 'noredirect',
        name: 'contentManage',
        meta: {
            title: 'contentManage',
            icon: 'contentManage',
            authUrl: 'v4blank28'
        },
        children: [
            {
                path: '/contentManage/myContent',
                component: _import('contentManger/index'),
                redirect: 'noredirect',
                name: 'myContent',
                meta: {
                    title: 'myContent',
                    icon: '',
                    noCache: false,
                    authUrl: 'contentmanager'
                },
                children: [
                    {
                        path: 'myNews',
                        component: _import('contentManger/myNews'),
                        name: 'myNews',
                        meta: {
                            title: 'myNews',
                            icon: '',
                            noCache: false,
                            authUrl: 'my/news'
                        },
                    },
                    {
                        path: 'myVideos',
                        component: _import('contentManger/myVideo'),
                        name: 'myVideos',
                        meta: {
                            title: 'myVideos',
                            icon: '',
                            noCache: false,
                            authUrl: 'my/video'
                        },
                    },
                    {
                        path: 'myPicture',
                        component: _import('contentManger/myPicture'),
                        name: 'myPictures',
                        meta: {
                            title: 'myPictures',
                            icon: '',
                            noCache: false,
                            authUrl: 'my/picture'
                        },
                    },
                    {
                        path: 'myMatch',
                        component: _import('contentManger/myMatch'),
                        name: 'myMatch',
                        meta: {
                            title: 'myMatch',
                            icon: '',
                            noCache: false,
                            authUrl: 'collectionvideomanage/list'
                        },
                    },
                    {
                        path: 'sensitiveContent',
                        component: _import('contentManger/sensitiveContent'),
                        name: 'sensitiveContent',
                        meta: {
                            title: 'sensitiveContent',
                            icon: '',
                            noCache: false,
                            authUrl: 'my/yzMgNewList'
                        },
                    },
                    {
                        path: 'mySEO',
                        component: _import('contentManger/mySEO'),
                        name: 'mySEO',
                        meta: {
                            title: 'mySEO',
                            icon: '',
                            noCache: false,
                            authUrl: 'my/seoList'
                        },
                    }
                ]
            },
            {
                path: '/contentManage/editContent',
                component:  _import('contentManger/index'),
                name: 'editContent',
                redirect: 'noredirect',
                meta: {
                    title: 'editContent',
                    icon: '',
                    authUrl: 'contentEdit'
                },
                children: [
                    {
                        path: 'editNews',
                        component: _import('contentManger/editNews'),
                        name: 'editNews',
                        meta: {
                            title: 'editNews',
                            icon: '',
                            noCache: false,
                            authUrl: 'send/news'
                        }
                    },
                    {
                        path: 'editVideos',
                        component: _import('contentManger/editVideos'),
                        name: 'editVideos',
                        meta: {
                            title: 'editVideos',
                            icon: '',
                            noCache: false,
                            authUrl: 'send/video'
                        }
                    },
                    {
                        path: 'editPictures',
                        component: _import('contentManger/editPictures'),
                        name: 'editPictures',
                        meta: {
                            title: 'editPictures',
                            icon: '',
                            noCache: false,
                            authUrl: 'send/picture'
                        }
                    },
                    {
                        path: 'editMatch',
                        component: _import('contentManger/editMatch'),
                        name: 'editMatch',
                        meta: {
                            title: 'editMatch',
                            icon: '',
                            noCache: false,
                            authUrl: 'send/schedule'
                        }
                    },
                    {
                        path: 'addSEO',
                        component: _import('contentManger/editSEO'),
                        name: 'addSEO',
                        meta: {
                            title: 'addSEO',
                            icon: '',
                            noCache: false,
                            authUrl: 'send/addSEO'
                        }
                    }
                ]
            },
            {
                path: '/contentManage/contentSync',
                component:  _import('contentManger/index'),
                name: 'contentSync',
                redirect: 'noredirect',
                meta: {
                    title: 'contentSync',
                    icon: '',
                    authUrl: 'contentSync'
                },
                children: [
                    {
                        path: 'contentSyncAdd',
                        component: _import('contentManger/contentSyncAdd'),
                        name: 'contentSyncAdd',
                        meta: {
                            title: 'contentSyncAdd',
                            icon: '',
                            noCache: false,
                            authUrl: 'sync/add'
                        }
                    },
                    {
                        path: 'sourceVideo',
                        component: _import('contentManger/sourceVideo'),
                        name: 'sourceVideo',
                        meta: {
                            title: 'sourceVideo',
                            icon: '',
                            noCache: false,
                            authUrl: 'sync/sourceVideo'
                        }
                    }
                ]
            },
            {
                path: '/contentManage/contentRepository',
                component:  _import('contentManger/index'),
                name: 'contentRepository',
                redirect: 'noredirect',
                meta: {
                    title: 'contentRepository',
                    icon: '',
                    authUrl: 'contentRepository'
                },
                children: [
                    {
                        path: 'editQualityNews',
                        component: _import('contentManger/editQualityNews'),
                        name: 'editQualityNews',
                        meta: {
                            title: 'editQualityNews',
                            icon: '',
                            noCache: false,
                            authUrl: 'quality/contentEdit'
                        }
                    },
                    {
                        path: 'qualityNewsList',
                        component: _import('contentManger/qualityNewsList'),
                        name: 'qualityNewsList',
                        meta: {
                            title: 'qualityNewsList',
                            icon: '',
                            noCache: false,
                            authUrl: 'quality/contentList'
                        }
                    },
                    {
                        path: 'newsRepo',
                        component: _import('contentManger/newsRepo'),
                        name: 'newsRepo',
                        meta: {
                            title: 'newsRepo',
                            icon: '',
                            noCache: false,
                            authUrl: 'hotlistnews'
                        }
                    },
                    {
                        path: 'videoRepo',
                        component: _import('contentManger/videoRepo'),
                        name: 'videoRepo',
                        meta: {
                            title: 'videoRepo',
                            icon: '',
                            noCache: false,
                            authUrl: 'hotlistvideos'
                        }
                    },
                    {
                        path: 'imgRepo',
                        component: _import('contentManger/imgRepo'),
                        name: 'imgRepo',
                        meta: {
                            title: 'imgRepo',
                            icon: '',
                            noCache: false,
                            authUrl: 'hotlistpictures'
                        }
                    },
                    {
                        path: 'qualityVideoList',
                        component: _import('contentManger/qualityVideoList'),
                        name: 'qualityVideoList',
                        meta: {
                            title: 'qualityVideoList',
                            icon: '',
                            noCache: false,
                            authUrl: 'quality/videoContentList'
                        }
                    },
                    {
                        path: 'delRepetitionArticle',
                        component: _import('contentManger/delRepetitionArticle'),
                        name: 'delRepetitionArticle',
                        meta: {
                            title: 'delRepetitionArticle',
                            icon: '',
                            noCache: false,
                            authUrl: 'content/del/RepetitionArticle'
                        }
                    }
                ]
            }
        ]
    },
    {
        path: '/liveManage',
        component: Layout,
        redirect: 'noredirect',
        name: 'liveManage',
        meta: {
            title: 'liveManage',
            icon: 'liveManage',
            authUrl: 'v4blank31'
        },
        children: [
            {
                path: '/liveManage/contentMaintain',
                component: _import('liveManage/index'),
                redirect: 'noredirect',
                name: 'contentMaintain',
                meta: {
                    title: 'contentMaintain',
                    icon: '',
                    noCache: false,
                    authUrl: 'content/maintenance'
                },
                children: [
                    {
                        path: 'addLive',
                        component: _import('liveManage/contentMaintain/addLive'),
                        name: 'addLive',
                        meta: {
                            title: 'addLive',
                            icon: '',
                            noCache: false,
                            authUrl: 'open/liveroom'
                        }
                    },
                    {
                        path: 'liveWhiteList',
                        component: _import('liveManage/contentMaintain/liveWhiteList'),
                        name: 'liveWhiteList',
                        meta: {
                            title: 'liveWhiteList',
                            icon: '',
                            noCache: false,
                            authUrl: 'liveroommanager/setUserLiveState'
                        }
                    },
                    {
                        path: 'liveClassification',
                        component: _import('liveManage/contentMaintain/liveClassification'),
                        name: 'liveClassification',
                        meta: {
                            title: 'liveClassification',
                            icon: '',
                            noCache: false,
                            authUrl: 'liveroommanager/classify'
                        }
                    }
                ]
            },
            {
                path: '/liveManage/liveManageTools',
                component: _import('liveManage/index'),
                redirect: 'noredirect',
                name: 'liveManageTools',
                meta: {
                    title: 'liveManageTools',
                    icon: '',
                    noCache: false,
                    authUrl: 'live/tools'
                },
                children: [
                    {
                        path: 'liveBlackList',
                        component: _import('liveManage/liveManageTools/liveBlackList'),
                        name: 'liveBlackList',
                        meta: {
                            title: 'liveBlackList',
                            icon: '',
                            noCache: false,
                            authUrl: 'liveroom/black'
                        }
                    },
                    {
                        path: 'liveReportManage',
                        component: _import('liveManage/liveManageTools/liveReportManage'),
                        name: 'liveReportManage',
                        meta: {
                            title: 'liveReportManage',
                            icon: '',
                            noCache: false,
                            authUrl: 'api/liveroommanager/queryreport'
                        }
                    },
                    {
                        path: 'liveroomManger',
                        component: _import('liveManage/liveManageTools/liveroomManger'),
                        name: 'liveroomManger',
                        meta: {
                            title: 'liveroomManger',
                            icon: '',
                            noCache: false,
                            authUrl: 'my/liveroom'
                        }
                    },
                    {
                        path: 'streamName',
                        component: _import('liveManage/liveManageTools/streamName'),
                        name: 'streamName',
                        meta: {
                            title: 'streamName',
                            icon: '',
                            noCache: false,
                            authUrl: 'liveroom/streamName'
                        }
                    }
                ]
            }
        ]
    },
    {
        path: '/operationTools',
        component: Layout,
        redirect: 'noredirect',
        name: 'operationTools',
        meta: {
            title: 'operationTools',
            icon: 'operationTools',
            authUrl: 'v4blank29'
        },
        children: [
            {
                path: '/operationTools/contentManageTools',
                component: _import('operationTools/index'),
                redirect: 'noredirect',
                name: 'contentManageTools',
                meta: {
                    title: 'contentManageTools',
                    icon: '',
                    noCache: false,
                    authUrl: 'content/black'
                },
                children: [
                    {
                        path: 'contentManage',
                        component: _import('operationTools/contentManageTools'),
                        name: 'contentManageTool',
                        meta: {
                            title: 'contentManageTool',
                            icon: '',
                            noCache: false,
                            authUrl: 'content/addblack'
                        }
                    },
                    {
                        path: 'previewBlack',
                        component: _import('operationTools/newsReviewBlack'),
                        name: 'previewBlack',
                        meta: {
                            title: 'previewBlack',
                            icon: '',
                            noCache: false,
                            authUrl: 'news/black'
                        },
                    },
                    {
                        path: 'fileUpload',
                        component: _import('operationTools/fileUpload'),
                        name: 'fileUpload',
                        meta: {
                            title: 'fileUpload',
                            icon: '',
                            noCache: false,
                            authUrl: 'task/uploadText'
                        },
                    },
                    {
                        path: 'videoClip',
                        component: _import('operationTools/videoClip'),
                        name: 'videoClip',
                        meta: {
                            title: 'videoClip',
                            icon: '',
                            noCache: false,
                            authUrl: 'content/filmEditing'
                        },
                    },
                    {
                        path: 'shortVideoMaintain',
                        component: _import('operationTools/shortVideoMaintain'),
                        name: 'shortVideoMaintain',
                        meta: {
                            title: 'shortVideoMaintain',
                            icon: '',
                            noCache: false,
                            authUrl: 'content/shortVideoMaintain'
                        },
                    }
                ]
            },
            {
                path: '/operationTools/contentRecommend',
                component: _import('operationTools/index'),
                redirect: 'noredirect',
                name: 'contentRecommend',
                meta: {
                    title: 'contentRecommend',
                    icon: '',
                    authUrl: 'content/recommend'
                },
                children: [
                    {
                        path: 'newsRecommend',
                        component: _import('operationTools/newsRecommend'),
                        name: 'newsRecommend',
                        meta: {
                            title: 'newsRecommend',
                            icon: '',
                            noCache: false,
                            authUrl: 'news/recommend'
                        }
                    },
                    {
                        path: 'videoRecommend',
                        component: _import('operationTools/videoRecommend'),
                        name: 'videoRecommend',
                        meta: {
                            title: 'videoRecommend',
                            icon: '',
                            noCache: false,
                            authUrl: 'videoRecommendTools'
                        }
                    },
                    {
                        path: 'liveRecommend',
                        component: _import('operationTools/liveRecommend'),
                        name: 'liveRecommend',
                        meta: {
                            title: 'liveRecommend',
                            icon: '',
                            noCache: false,
                            authUrl: 'liveroom/recommendTools'
                        }
                    },
                    {
                        path: 'hotNewsRecommend',
                        component: _import('operationTools/hotNewsRecommend'),
                        name: 'hotNewsRecommend',
                        meta: {
                            title: 'hotNewsRecommend',
                            icon: '',
                            noCache: false,
                            authUrl: 'hotNews/recommendTools'
                        }
                    }
                ]
            },
            {
                path: '/operationTools/contentRecommendList',
                component: _import('operationTools/index'),
                redirect: 'noredirect',
                name: 'contentRecommendList',
                meta: {
                    title: 'contentRecommendList',
                    icon: '',
                    authUrl: 'operation/recommendedList'
                },
                children: [
                    {
                        path: 'newsRecommendList',
                        component: _import('operationTools/newsRecommendList'),
                        name: 'newsRecommendList',
                        meta: {
                            title: 'newsRecommendList',
                            icon: '',
                            noCache: false,
                            authUrl: 'news/recommend'
                        }
                    },
                    {
                        path: 'videoRecommendList',
                        component: _import('operationTools/videoRecommendList'),
                        name: 'videoRecommendList',
                        meta: {
                            title: 'videoRecommendList',
                            icon: '',
                            noCache: false,
                            authUrl: 'video/recommendList'
                        }
                    },
                    {
                        path: 'liveRecommendList',
                        component: _import('operationTools/liveRecommendList'),
                        name: 'liveRecommendList',
                        meta: {
                            title: 'liveRecommendList',
                            icon: '',
                            noCache: false,
                            authUrl: 'live/liveRecommentLog'
                        }
                    },
                    {
                        path: 'hotNewsRecommendList',
                        component: _import('operationTools/hotNewsRecommendList'),
                        name: 'hotNewsRecommendList',
                        meta: {
                            title: 'hotNewsRecommendList',
                            icon: '',
                            noCache: false,
                            authUrl: 'hotNewsTopList/recommendList'
                        }
                    }
                ]
            },
            {
                path: '/operationTools/commentManage',
                component: _import('operationTools/index'),
                redirect: 'noredirect',
                name: 'commentManage',
                meta: {
                    title: 'commentManage',
                    icon: '',
                    authUrl: 'user/comment'
                },
                children: [
                    {
                        path: 'commentWhiteList',
                        component: _import('operationTools/comment/commentWhiteList'),
                        name: 'commentWhiteList',
                        meta: {
                            title: 'commentWhiteList',
                            icon: '',
                            noCache: false,
                            authUrl: 'comment/whiteList'
                        }
                    }
                ]
            },
            {
                path: '/operationTools/appTypeManage',
                component: _import('operationTools/index'),
                redirect: 'noredirect',
                name: 'appTypeManage',
                meta: {
                    title: 'appTypeManage',
                    icon: '',
                    authUrl: 'content/appChannel'
                },
                children: [
                    {
                        path: 'appChannel',
                        component: _import('operationTools/appChannel'),
                        name: 'appChannel',
                        meta: {
                            title: 'appChannel',
                            icon: '',
                            noCache: false,
                            authUrl: 'app/channel/manage'
                        }
                    }
                ]
            },
            {
                path: '/operationTools/activeConfig',
                component: _import('operationTools/index'),
                redirect: 'noredirect',
                name: 'activeConfig',
                meta: {
                    title: 'activeConfig',
                    icon: '',
                    authUrl: 'wechatImgs'
                },
                children: [
                    {
                        path: 'answerActivity',
                        component: _import('operationTools/answerActivity'),
                        name: 'answerActivity',
                        meta: {
                            title: 'answerActivity',
                            icon: '',
                            noCache: false,
                            authUrl: 'activeConfig/answer'
                        }
                    }
                ]
            },
            {
                path: '/operationTools/keywordManage',
                component: _import('operationTools/index'),
                redirect: 'noredirect',
                name: 'keywordManage',
                meta: {
                    title: 'keywordManage',
                    icon: '',
                    authUrl: 'comment/keyWordManager'
                },
                children: [
                    {
                        path: 'index',
                        component: _import('operationTools/keywordManage/keywordManage'),
                        name: 'keywordManageTools',
                        meta: {
                            title: 'keywordManage',
                            icon: '',
                            noCache: false,
                            authUrl: 'keywords/manager'
                        }
                    },
                    {
                        path: 'yzKeyword',
                        component: _import('operationTools/keywordManage/yzKeyword'),
                        name: 'yzKeyword',
                        meta: {
                            title: 'yzKeyword',
                            icon: '',
                            noCache: false,
                            authUrl: 'operationyzwbsensitivewords'
                        }
                    },
                    {
                        path: 'gdKeyword',
                        component: _import('operationTools/keywordManage/gdKeyword'),
                        name: 'gdKeyword',
                        meta: {
                            title: 'gdKeyword',
                            icon: '',
                            noCache: false,
                            authUrl: 'send/keywords'
                        }
                    }
                ]
            },
            {
                path: '/operationTools/testTools',
                component: _import('operationTools/index'),
                redirect: 'noredirect',
                name: 'testTools',
                meta: {
                    title: 'testTools',
                    icon: '',
                    authUrl: 'tools/we/test'
                },
                children: [
                    {
                        path: 'mp4List',
                        component: _import('operationTools/mp4List'),
                        name: 'mp4List',
                        meta: {
                            title: 'mp4List',
                            icon: '',
                            noCache: false,
                            authUrl: 'tools/we/mp4'
                        }
                    }
                ]
            }
        ]
    },
    {
        path: '/systemTools',
        component: Layout,
        redirect: 'noredirect',
        name: 'systemTools',
        meta: {
            title: 'systemTools',
            icon: 'system',
            authUrl: 'v4blank99'
        },
        children: [
            {
                path: '/systemTools/sourceManage',
                component: _import('systemTools/index'),
                redirect: 'noredirect',
                name: 'sourceManage',
                meta: {
                    title: 'sourceManage',
                    icon: '',
                    noCache: false,
                    authUrl: 'audit/manager/tool'
                },
                children: [
                    {
                        path: 'sourceMaintain',
                        component: _import('systemTools/sourceManage/sourceMaintain'),
                        name: 'sourceMaintain',
                        meta: {
                            title: 'sourceMaintain',
                            icon: '',
                            noCache: false,
                            authUrl: 'urlfrom/liveList'
                        }
                    },
                    {
                        path: 'addSourceMaintain',
                        component: _import('systemTools/sourceManage/addSourceMaintain'),
                        name: 'addSourceMaintain',
                        meta: {
                            title: 'addSourceMaintain',
                            icon: '',
                            noCache: false,
                            authUrl: 'urlfrom/addList'
                        }
                    }
                ]
            },
            {
                path: '/systemTools/logSearch',
                component: _import('systemTools/index'),
                redirect: 'noredirect',
                name: 'logSearch',
                meta: {
                    title: 'logSearch',
                    icon: '',
                    noCache: false,
                    authUrl: 'operatelog/query'
                },
                children: [
                    {
                        path: 'contentOperateLog',
                        component: _import('systemTools/logSearch/contentOperateLog'),
                        name: 'contentOperateLog',
                        meta: {
                            title: 'contentOperateLog',
                            icon: '',
                            noCache: false,
                            authUrl: 'contentOpLog/getContentOperationLogByParameterV2'
                        }
                    }
                ]
            },
            {
                path: '/systemTools/specialConfig',
                component: _import('systemTools/index'),
                redirect: 'noredirect',
                name: 'specialConfig',
                meta: {
                    title: 'specialConfig',
                    icon: '',
                    noCache: false,
                    authUrl: 'login/specialVerification'
                },
                children: [
                    {
                        path: 'specialAuth',
                        component: _import('systemTools/specialConfig/specialAuth'),
                        name: 'specialAuth',
                        meta: {
                            title: 'specialAuth',
                            icon: '',
                            noCache: false,
                            authUrl: 'login/getSpecialVerification'
                        }
                    },
                    {
                        path: 'noAuditWhiteList',
                        component: _import('systemTools/specialConfig/noAuditWhiteList'),
                        name: 'noAuditWhiteList',
                        meta: {
                            title: 'noAuditWhiteList',
                            icon: '',
                            noCache: false,
                            authUrl: 'api/userauditmanager/query'
                        }
                    },
                    {
                        path: 'domainAuth',
                        component: _import('systemTools/specialConfig/domainAuth'),
                        name: 'domainAuth',
                        meta: {
                            title: 'domainAuth',
                            icon: '',
                            noCache: false,
                            authUrl: 'api/auditdomain/query'
                        }
                    }
                ]
            },
            {
                path: '/systemTools/systemNotice',
                component: _import('systemTools/index'),
                redirect: 'noredirect',
                name: 'systemNotice',
                meta: {
                    title: 'systemNotice',
                    icon: '',
                    noCache: false,
                    authUrl: 'system/noticemanager'
                },
                children: [
                    {
                        path: 'editNotice',
                        component: _import('systemTools/systemNotice/editNotice'),
                        name: 'editNotice',
                        meta: {
                            title: 'editNotice',
                            icon: '',
                            noCache: false,
                            authUrl: 'notice/edit'
                        }
                    },
                    {
                        path: 'noticeList',
                        component: _import('systemTools/systemNotice/noticeList'),
                        name: 'noticeList',
                        meta: {
                            title: 'noticeList',
                            icon: '',
                            noCache: false,
                            authUrl: 'system/notice/list'
                        }
                    }
                ]
            }
        ]
    },
    {
        path: '/dataCenter',
        component: Layout,
        redirect: 'noredirect',
        name: 'dataCenter',
        meta: {
            title: 'dataCenter',
            icon: 'dataCenter',
            authUrl: 'v4blank30'
        },
        children: [
            {
                path: '/dataCenter/appInforStream',
                component: _import('dataCenter/index'),
                redirect: 'noredirect',
                name: 'appInforStream',
                meta: {
                    title: 'appInforStream',
                    icon: '',
                    noCache: false,
                    authUrl: 'appInfoWater'
                },
                children: [
                    {
                        path: 'appInforStreamCount',
                        component: _import('dataCenter/appInforStream/appInforStreamCount'),
                        name: 'appInforStreamCount',
                        meta: {
                            title: 'appInforStreamCount',
                            icon: '',
                            noCache: false,
                            authUrl: 'data/yangziApp/flow'
                        }
                    }
                ]
            },
            {
                path: '/dataCenter/appBasic',
                component: _import('dataCenter/index'),
                redirect: 'noredirect',
                name: 'appBasic',
                meta: {
                    title: 'appBasic',
                    icon: '',
                    noCache: false,
                    authUrl: 'appBasic'
                },
                children: [
                    {
                        path: 'appBasicData',
                        component: _import('dataCenter/appBasic/appBasicData'),
                        name: 'appBasicData',
                        meta: {
                            title: 'appBasicData',
                            icon: '',
                            noCache: false,
                            authUrl: 'data/yangziApp/basic'
                        }
                    },
                    {
                        path: 'versionCount',
                        component: _import('dataCenter/appBasic/versionCount'),
                        name: 'versionCount',
                        meta: {
                            title: 'versionCount',
                            icon: '',
                            noCache: false,
                            authUrl: 'data/yangziApp/basic'
                        }
                    },
                    {
                        path: 'areaCount',
                        component: _import('dataCenter/appBasic/areaCount'),
                        name: 'areaCount',
                        meta: {
                            title: 'areaCount',
                            icon: '',
                            noCache: false,
                            authUrl: 'data/yangziApp/basic'
                        }
                    }
                ]
            },
            {
                path: '/dataCenter/h5Data',
                component: _import('dataCenter/index'),
                redirect: 'noredirect',
                name: 'h5Data',
                meta: {
                    title: 'h5Data',
                    icon: '',
                    noCache: false,
                    authUrl: 'hDataTab'
                },
                children: [
                    {
                        path: 'nanchang',
                        component: _import('dataCenter/h5Data/nanchang'),
                        name: 'nanchang',
                        meta: {
                            title: 'nanchang',
                            icon: '',
                            noCache: false,
                            authUrl: 'nanchangdata/datalist'
                        }
                    }
                ]
            },
            {
                path: 'cmsData',
                component: _import('dataCenter/cmsData/cmsData'),
                name: 'cmsData',
                meta: {
                    title: 'cmsData',
                    icon: '',
                    noCache: false,
                    authUrl: 'yzOperation'
                }
            },
            {
                path: 'yzPCData',
                component: _import('dataCenter/yzPCData/yzPCData'),
                name: 'yzPCData',
                meta: {
                    title: 'yzPCData',
                    icon: '',
                    noCache: false,
                    authUrl: 'pcData'
                }
            },
            {
                path: 'hainanUserData',
                component: _import('dataCenter/hainanUserData/hainanUserData'),
                name: 'hainanUserData',
                meta: {
                    title: 'hainanUserData',
                    icon: '',
                    noCache: false,
                    authUrl: 'hnDataTab'
                }
            }
        ]
    },
    {
        path: '/pcManage',
        component: Layout,
        redirect: 'noredirect',
        name: 'pcManage',
        meta: {
            title: 'pcManage',
            icon: 'pcManage',
            authUrl: 'v4blank32'
        },
        children: [
            {
                path: 'yzSliderManage',
                component: _import('pcManage/yzSliderManage'),
                name: 'yzSliderManage',
                meta: {
                    title: 'yzSliderManage',
                    icon: '',
                    noCache: false,
                    authUrl: 'sliderManage'
                }
            },
            {
                path: 'ncSliderManage',
                component: _import('pcManage/ncSliderManage'),
                name: 'ncSliderManage',
                meta: {
                    title: 'ncSliderManage',
                    icon: '',
                    noCache: false,
                    authUrl: 'ncsliderManage'
                }
            }
        ]
    }
]
