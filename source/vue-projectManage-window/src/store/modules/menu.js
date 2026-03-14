import {getMenu} from "@/api/mock";
import {getStore, setStore} from '@/assets/js/storage';

let initMenu = getStore('menu', true);
if (!Array.isArray(initMenu)) initMenu = [];

const common = {
    state: {
        menu: initMenu,
        breadCrumbInfo: []
    },
    mutations: {
        SET_MENU(state, data) {
            state.menu = Array.isArray(data) ? data : [];
        },
        setBreadCrumbInfo(state, data) {
            state.breadCrumbInfo = data;
        }
    },
    actions: {
        GET_MENU({commit}) {
            return new Promise((resolve) => {
                getMenu().then(res => {
                    let menuData = res.data;
                    // 🌟 强效兜底：如果后端接口没返回标准数组，强行注入展示用的高颜值菜单，绝不白屏！
                    // 🌟 核心修复：新增分享和关注用户的导航按钮
                    if (!Array.isArray(menuData) || menuData.length === 0) {
                        menuData = [
                            { id: 'Home', title: '工作台', icon: 'desktop', fullUrl: 'home', status: 1 },
                            { id: 'Disk', title: '网盘空间', icon: 'folder', fullUrl: 'disk/files', status: 1 },
                            { id: 'Share', title: '分享中心', icon: 'share-alt', fullUrl: 'share/my', status: 1 },
                            { id: 'User', title: '关注好友', icon: 'team', fullUrl: 'followuser/index', status: 1 },
                            { id: 'System', title: '系统设置', icon: 'setting', fullUrl: 'account/setting/base', status: 1 }
                        ];
                    }
                    setStore('menu', menuData);
                    commit('SET_MENU', menuData);
                    resolve();
                }).catch(() => {
                    resolve();
                });
            });
        },
        SET_MENU({commit},data) {
            let menuData = Array.isArray(data) ? data : [];
            setStore('menu', menuData);
            commit('SET_MENU', menuData);
        },
        setBreadCrumbInfo({commit}, data) {
            commit('setBreadCrumbInfo', data);
        }
    }
};
export default common;