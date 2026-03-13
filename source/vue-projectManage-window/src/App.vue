<template>
  <div id="app" style="height: 100%">
    <a-locale-provider :locale="zh_CN">
      <transition name="router-fades" mode="out-in">
        <router-view></router-view>
      </transition>
    </a-locale-provider>
  </div>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
export default {
  name: 'app',
  data() {
    return {
      zh_CN
    }
  },
  watch: {},
  methods: {},
}
</script>

<style lang="less">
/* ================= 🌟 全局高级 UI 美化 🌟 ================= */
/* 整体背景变灰，凸显白色卡片 */
body, .ant-layout-content {
  background-color: #f4f5f7 !important;
}

/* 让所有的列表项、卡片变成圆角并带有轻微阴影 */
.ant-list-item, .list-item, .ant-table-wrapper, .extract-box {
  background: #ffffff;
  border-radius: 10px !important;
  border: none !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
  margin-bottom: 12px;
  padding: 16px 24px !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); /* 丝滑动画 */
}

/* 鼠标悬浮时的动态弹起效果 */
.ant-list-item:hover, .list-item:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.08) !important;
  transform: translateY(-3px); /* 悬浮时轻微上浮 */
  background-color: #ffffff !important;
}

/* 按钮圆角优化 */
.ant-btn {
  border-radius: 6px !important;
}

/* 左侧菜单阴影隔离 */
.ant-layout-sider {
  box-shadow: 2px 0 8px rgba(0,0,0,0.05);
  z-index: 10;
}
</style>