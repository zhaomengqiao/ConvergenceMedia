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
        path: '',
        component: Layout,
        redirect: 'dashboard',
        children: [{
            path: 'dashboard',
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
    }
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
                    }
                ]
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
                        component: _import('operationTools/contentManageTools'),
                        name: 'previewBlack',
                        meta: {
                            title: 'previewBlack',
                            icon: '',
                            noCache: false,
                            authUrl: 'news/black'
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
            }
        ]
    },
    // {
    //     path: '/permission',
    //     component: Layout,
    //     redirect: '/permission/index',
    //     meta: {
    //         role: ['admin']
    //     },
    //     children: [{
    //         path: 'index',
    //         component: _import('permission/index'),
    //         name: 'permission',
    //         meta: {
    //             title: 'permission',
    //             icon: 'lock',
    //             role: ['admin']
    //         }
    //     }]
    // },
    // {
    //     path: '/icon',
    //     component: Layout,
    //     children: [{
    //         path: 'index',
    //         component: _import('svg-icons/index'),
    //         name: 'icons',
    //         meta: {
    //             title: 'icons',
    //             icon: 'icon',
    //             noCache: true
    //         }
    //     }]
    // },
    //
    // {
    //     path: '/components',
    //     component: Layout,
    //     redirect: 'noredirect',
    //     name: 'component-demo',
    //     meta: {
    //         title: 'components',
    //         icon: 'component'
    //     },
    //     children: [{
    //             path: 'tinymce',
    //             component: _import('components-demo/tinymce'),
    //             name: 'tinymce-demo',
    //             meta: {
    //                 title: 'tinymce'
    //             }
    //         },
    //         {
    //             path: 'markdown',
    //             component: _import('components-demo/markdown'),
    //             name: 'markdown-demo',
    //             meta: {
    //                 title: 'markdown'
    //             }
    //         },
    //         {
    //             path: 'json-editor',
    //             component: _import('components-demo/jsonEditor'),
    //             name: 'jsonEditor-demo',
    //             meta: {
    //                 title: 'jsonEditor'
    //             }
    //         },
    //         {
    //             path: 'dnd-list',
    //             component: _import('components-demo/dndList'),
    //             name: 'dndList-demo',
    //             meta: {
    //                 title: 'dndList'
    //             }
    //         },
    //         {
    //             path: 'splitpane',
    //             component: _import('components-demo/splitpane'),
    //             name: 'splitpane-demo',
    //             meta: {
    //                 title: 'splitPane'
    //             }
    //         },
    //         {
    //             path: 'avatar-upload',
    //             component: _import('components-demo/avatarUpload'),
    //             name: 'avatarUpload-demo',
    //             meta: {
    //                 title: 'avatarUpload'
    //             }
    //         },
    //         {
    //             path: 'dropzone',
    //             component: _import('components-demo/dropzone'),
    //             name: 'dropzone-demo',
    //             meta: {
    //                 title: 'dropzone'
    //             }
    //         },
    //         {
    //             path: 'sticky',
    //             component: _import('components-demo/sticky'),
    //             name: 'sticky-demo',
    //             meta: {
    //                 title: 'sticky'
    //             }
    //         },
    //         {
    //             path: 'count-to',
    //             component: _import('components-demo/countTo'),
    //             name: 'countTo-demo',
    //             meta: {
    //                 title: 'countTo'
    //             }
    //         },
    //         {
    //             path: 'mixin',
    //             component: _import('components-demo/mixin'),
    //             name: 'componentMixin-demo',
    //             meta: {
    //                 title: 'componentMixin'
    //             }
    //         },
    //         {
    //             path: 'back-to-top',
    //             component: _import('components-demo/backToTop'),
    //             name: 'backToTop-demo',
    //             meta: {
    //                 title: 'backToTop'
    //             }
    //         }
    //     ]
    // },
    //
    // {
    //     path: '/charts',
    //     component: Layout,
    //     redirect: 'noredirect',
    //     name: 'charts',
    //     meta: {
    //         title: 'charts',
    //         icon: 'chart'
    //     },
    //     children: [{
    //             path: 'keyboard',
    //             component: _import('charts/keyboard'),
    //             name: 'keyboardChart',
    //             meta: {
    //                 title: 'keyboardChart',
    //                 noCache: true
    //             }
    //         },
    //         {
    //             path: 'line',
    //             component: _import('charts/line'),
    //             name: 'lineChart',
    //             meta: {
    //                 title: 'lineChart',
    //                 noCache: true
    //             }
    //         },
    //         {
    //             path: 'mixchart',
    //             component: _import('charts/mixChart'),
    //             name: 'mixChart',
    //             meta: {
    //                 title: 'mixChart',
    //                 noCache: true
    //             }
    //         }
    //     ]
    // },
    //
    // {
    //     path: '/example',
    //     component: Layout,
    //     redirect: '/example/table/complex-table',
    //     name: 'example',
    //     meta: {
    //         title: 'example',
    //         icon: 'example'
    //     },
    //     children: [{
    //             path: '/example/table',
    //             component: _import('example/table/index'),
    //             redirect: '/example/table/complex-table',
    //             name: 'Table',
    //             meta: {
    //                 title: 'Table',
    //                 icon: 'table'
    //             },
    //             children: [{
    //                     path: 'dynamic-table',
    //                     component: _import('example/table/dynamicTable/index'),
    //                     name: 'dynamicTable',
    //                     meta: {
    //                         title: 'dynamicTable'
    //                     }
    //                 },
    //                 {
    //                     path: 'drag-table',
    //                     component: _import('example/table/dragTable'),
    //                     name: 'dragTable',
    //                     meta: {
    //                         title: 'dragTable'
    //                     }
    //                 },
    //                 {
    //                     path: 'inline-edit-table',
    //                     component: _import('example/table/inlineEditTable'),
    //                     name: 'inlineEditTable',
    //                     meta: {
    //                         title: 'inlineEditTable'
    //                     }
    //                 },
    //                 {
    //                     path: 'complex-table',
    //                     component: _import('example/table/complexTable'),
    //                     name: 'complexTable',
    //                     meta: {
    //                         title: 'complexTable'
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             path: 'tab/index',
    //             icon: 'tab',
    //             component: _import('example/tab/index'),
    //             name: 'tab',
    //             meta: {
    //                 title: 'tab'
    //             }
    //         }
    //     ]
    // },
    //
    // {
    //     path: '/form',
    //     component: Layout,
    //     redirect: 'noredirect',
    //     name: 'form',
    //     meta: {
    //         title: 'form',
    //         icon: 'form'
    //     },
    //     children: [{
    //             path: 'create-form',
    //             component: _import('form/create'),
    //             name: 'createForm',
    //             meta: {
    //                 title: 'createForm',
    //                 icon: 'table'
    //             }
    //         },
    //         {
    //             path: 'edit-form',
    //             component: _import('form/edit'),
    //             name: 'editForm',
    //             meta: {
    //                 title: 'editForm',
    //                 icon: 'table'
    //             }
    //         }
    //     ]
    // },
    //
    // {
    //     path: '/error',
    //     component: Layout,
    //     redirect: 'noredirect',
    //     name: 'errorPages',
    //     meta: {
    //         title: 'errorPages',
    //         icon: '404'
    //     },
    //     children: [{
    //             path: '401',
    //             component: _import('errorPage/401'),
    //             name: 'page401',
    //             meta: {
    //                 title: 'page401',
    //                 noCache: true
    //             }
    //         },
    //         {
    //             path: '404',
    //             component: _import('errorPage/404'),
    //             name: 'page404',
    //             meta: {
    //                 title: 'page404',
    //                 noCache: true
    //             }
    //         }
    //     ]
    // },
    //
    // {
    //     path: '/error-log',
    //     component: Layout,
    //     redirect: 'noredirect',
    //     children: [{
    //         path: 'log',
    //         component: _import('errorLog/index'),
    //         name: 'errorLog',
    //         meta: {
    //             title: 'errorLog',
    //             icon: 'bug'
    //         }
    //     }]
    // },
    //
    // {
    //     path: '/excel',
    //     component: Layout,
    //     redirect: '/excel/export-excel',
    //     name: 'excel',
    //     meta: {
    //         title: 'excel',
    //         icon: 'excel'
    //     },
    //     children: [{
    //             path: 'export-excel',
    //             component: _import('excel/exportExcel'),
    //             name: 'exportExcel',
    //             meta: {
    //                 title: 'exportExcel'
    //             }
    //         },
    //         {
    //             path: 'export-selected-excel',
    //             component: _import('excel/selectExcel'),
    //             name: 'selectExcel',
    //             meta: {
    //                 title: 'selectExcel'
    //             }
    //         },
    //         {
    //             path: 'upload-excel',
    //             component: _import('excel/uploadExcel'),
    //             name: 'uploadExcel',
    //             meta: {
    //                 title: 'uploadExcel'
    //             }
    //         }
    //     ]
    // },
    //
    // {
    //     path: '/zip',
    //     component: Layout,
    //     redirect: '/zip/download',
    //     children: [{
    //         path: 'download',
    //         component: _import('zip/index'),
    //         name: 'exportZip',
    //         meta: {
    //             title: 'exportZip',
    //             icon: 'zip'
    //         }
    //     }]
    // },
    //
    // {
    //     path: '/theme',
    //     component: Layout,
    //     redirect: 'noredirect',
    //     children: [{
    //         path: 'index',
    //         component: _import('theme/index'),
    //         name: 'theme',
    //         meta: {
    //             title: 'theme',
    //             icon: 'theme'
    //         }
    //     }]
    // },
    //
    // {
    //     path: '/clipboard',
    //     component: Layout,
    //     redirect: 'noredirect',
    //     children: [{
    //         path: 'index',
    //         component: _import('clipboard/index'),
    //         name: 'clipboardDemo',
    //         meta: {
    //             title: 'clipboardDemo',
    //             icon: 'clipboard'
    //         }
    //     }]
    // },
    //
    // {
    //     path: '/i18n',
    //     component: Layout,
    //     children: [{
    //         path: 'index',
    //         component: _import('i18n-demo/index'),
    //         name: 'i18n',
    //         meta: {
    //             title: 'i18n',
    //             icon: 'international'
    //         }
    //     }]
    // },
]
