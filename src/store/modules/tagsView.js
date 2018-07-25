const tagsView = {
    state: {
        visitedViews: [],
        cachedViews: []
    },
    mutations: {
        ADD_VISITED_VIEWS: (state, view) => {
            if (state.visitedViews.some(v => v.path === view.path)) return
            state.visitedViews.push({
                name: view.name,
                path: view.path,
                title: view.meta.title || 'no-name'
            })
            if (!view.meta.noCache) {
                state.cachedViews.push(view.name)
            }
        },
        DEL_VISITED_VIEWS: (state, view) => {
            for (const [i, v] of state.visitedViews.entries()) {
                if (v.path === view.path) {
                    state.visitedViews.splice(i, 1)
                    break
                }
            }
            for (const i of state.cachedViews) {
                if (i === view.name) {
                    const index = state.cachedViews.indexOf(i)
                    state.cachedViews.splice(index, 1)
                    break
                }
            }
        },
        CLOSE_ALL_VIEWS: (state, view) => {
            state.visitedViews.splice(1)
            state.cachedViews.length = 0
        },
        CLOSE_THIS_VIEW: (state, vm) => {
            let currentName = vm.$route.name;
            let currentIndex = 0;
            state.visitedViews.forEach((item, index) => {
                if (item.name === currentName) {
                    currentIndex = index
                }
            })
            if (currentIndex === 0) {
                state.visitedViews.splice(1)
            } else {
                state.visitedViews.splice(currentIndex + 1)
                state.visitedViews.splice(1, currentIndex - 1)
            }
            let newCachepage = state.cachedViews.filter(item => {
                return item === currentName;
            })
            state.cachedViews = newCachepage
        }
    },
    actions: {
        addVisitedViews({
            commit
        }, view) {
            commit('ADD_VISITED_VIEWS', view)
        },
        delVisitedViews({
            commit,
            state
        }, view) {
            return new Promise((resolve) => {
                commit('DEL_VISITED_VIEWS', view)
                resolve([...state.visitedViews])
            })
        }
    }
}

export default tagsView
