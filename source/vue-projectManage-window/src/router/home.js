/**
 * Home 自定义路由
 */
export default [
    { name: 'home', path: '/home', component: resolve => require(['@/views/home/index'], resolve), meta: {model: 'Home', info: {title: '首页'}} },
    { name: 'files', path: '/disk/files', component: resolve => require(['@/views/disk/files'], resolve), meta: {model: 'Disk', info:{title: '我的文件'}} },
    { name: 'overview', path: '/disk/overview', component: resolve => require(['@/views/disk/overview'], resolve), meta: {model: 'Disk', info:{title: '资源统计'}} },
    { name: 'settingBase', path: '/account/setting/base', component: resolve => require(['@/views/account/setting/base'], resolve), meta: {model: 'System', info:{title: '基本设置'}} },
    { name: 'settingSecurity', path: '/account/setting/security', component: resolve => require(['@/views/account/setting/security'], resolve), meta: {model: 'System', info:{title: '安全设置'}} },

    // 🌟 核心修复：把丢失的分享和好友路由补上！
    { name: 'shareIndex', path: '/share/my', component: resolve => require(['@/views/share/index'], resolve), meta: {model: 'Share', info:{title: '我的分享'}} },
    { name: 'followUser', path: '/followuser/index', component: resolve => require(['@/views/followuser/index'], resolve), meta: {model: 'User', info:{title: '关注用户'}} },

    // 隐藏页面
    { name: 'inviteFromLink', path: '/invite_from_link/:code', component: resolve => require(['@/views/common/inviteFromLink'], resolve), meta: {model: 'Common'} },
    { name: 'demo', path: '/demo', component: resolve => require(['@/views/member/demo'], resolve), meta: {model: 'Disk'} },
    { name: 'detail', path: '/followuser/detail', component: resolve => require(['@/views/followuser/detail'], resolve), meta: {model: 'User'} },
    { name: 'link', path: '/share/link', component: resolve => require(['@/views/share/link'], resolve), meta: {model: 'Share'} }
];