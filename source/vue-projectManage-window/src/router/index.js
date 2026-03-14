import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'
import Index from '@/views/index'
import Home from './home';
import {getStore, setStore} from "../assets/js/storage";
import {createRoute, isTokenExpired} from "../assets/js/utils";
import config from "../config/config";
import {refreshAccessToken} from "../api/common/common";

Vue.use(Router);
const routes = [].concat(Home);

const menu = getStore('menu', true);
// 🌟 安全注入动态路由，过滤无 path 的空壳，保护 Vue Router 不死
if (menu && Array.isArray(menu)) {
    const safePush = (v) => {
        if (!v) return;
        try {
            let r = createRoute(v);
            if (r && r.path) routes.push(r);
        } catch (e) {}
    };
    menu.forEach(function (v) {
        safePush(v);
        if (v.children) {
            v.children.forEach(function (v2) {
                safePush(v2);
                if (v2.children) {
                    v2.children.forEach(function (v3) { safePush(v3); });
                }
            });
        }
    });
}

const router = new Router({
    routes: [
        { path: '/', name: 'index', component: Index, children: routes },
        {
            name: 'member', path: '/member', component: resolve => require(['@/components/layout/UserLayout'], resolve), meta: {model: 'Login'},
            children: [
                { path: 'login', name: 'login', component: () => import('@/views/member/login'), meta: {model: 'Login'} },
                { path: 'register', name: 'register', component: () => import('@/views/member/Register'), meta: {model: 'Login'} },
                { path: 'forget', name: 'forget', component: () => import('@/views/member/forget'), meta: {model: 'Login'} }
            ]
        },
        { name: 'install', path: '/install', component: resolve => require(['@/views/error/install'], resolve), meta: {model: 'error'} },
        { name: 'resetEmail', path: '/reset/email', component: resolve => require(['@/views/reset/email'], resolve), meta: {model: 'error'} },
        { name: '404', path: '/404', component: resolve => require(['@/views/error/404'], resolve), meta: {model: 'error'} },
        { name: '403', path: '/403', component: resolve => require(['@/views/error/403'], resolve), meta: {model: 'error'} }
    ]
});

router.beforeEach((to, from, next) => {
    let tokenList = getStore('tokenList', true);
    if (tokenList && tokenList.accessTokenExp && isTokenExpired(tokenList.accessTokenExp)) {
        refreshAccessToken(tokenList.refreshToken).then(res => {
            tokenList.accessToken = res.data.accessToken;
            tokenList.accessTokenExp = res.data.accessTokenExp;
            setStore('tokenList', tokenList);
        }).catch(()=>{});
    }
    const HOME_PAGE = config.HOME_PAGE || '/home';
    if (to.path === '/' || to.path === '/index') { return next({path: HOME_PAGE}); }
    if (!to.name && from.meta.model !== 'Login' && to.path !== HOME_PAGE) { return next({path: '/404'}); }
    if (to.meta.model === 'Login' && store.state.logged) { return next({path: HOME_PAGE}); }
    if (!store.state.logged && to.meta.model !== 'Login' && to.meta.model !== 'error') {
        return next({ name: 'login', query: {redirect: to.fullPath} });
    }
    next();
});

router.afterEach(() => {});
export default router;