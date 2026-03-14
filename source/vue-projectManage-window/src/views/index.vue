<template>
  <div class="index">
    <a-spin :spinning="windowLoading">
      <a-layout id="layout" :class="layoutClass">
        <a-layout-header>
          <div class="logo" @click="()=>{this.$router.push(config.HOME_PAGE)}">
            <img class="logo-img" src="../assets/image/common/logo.png" alt="">
            <span class="title">星云网盘</span>
          </div>
          <a-menu mode="horizontal" v-model="selectedModelKeys" @click="menuModelClick" :style="{ lineHeight: '63px',paddingLeft:'15px' }">
            <a-menu-item v-for="(model,index) in menu" :key="model.id.toString()" :disabled="!model.status">
              <a-icon v-if="model.icon" :type="model.icon"/><span>{{model.title}}</span>
            </a-menu-item>
          </a-menu>
          <div class="right-menu">
            <div class="action"><header-notice></header-notice></div>
            <div class="action action-avatar"><header-avatar></header-avatar></div>
          </div>
        </a-layout-header>

        <a-layout style="padding-top: 65px;">
          <a-layout class="main-content" style="padding-left: 0;">
            <a-layout-content>
              <transition name="router-fade" mode="out-in">
                <a-spin :spinning="pageLoading">
                  <router-view></router-view>
                </a-spin>
              </transition>
            </a-layout-content>
            <a-footer style="text-align: center">
              <template><span @click="footerClick">Copyright © 2026 吉林财经大学 xue702</span></template>
            </a-footer>
          </a-layout>
        </a-layout>
      </a-layout>
    </a-spin>
    <v-uploader></v-uploader>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import ALayout from 'ant-design-vue/es/layout'
import HeaderNotice from '../components/layout/header/HeaderNotice';
import HeaderAvatar from '../components/layout/header/HeaderAvatar';
import HeaderSelect from '../components/layout/header/HeaderSelect';
import VUploader from '../components/tools/VUploader';
import Socket from '../components/websocket/socket';
import config from "../config/config";

const ASider = ALayout.Sider;
const AFooter = ALayout.Footer;

export default {
  name: 'index',
  components: { HeaderNotice, HeaderAvatar, HeaderSelect, ALayout, ASider, AFooter, Socket, VUploader },
  data() {
    return {
      menus: [], collapsed: false, inline: 1, openKeys: [], openKeysTemp: [],
      selectedKeys: [], selectedModelKeys: [], breadCrumbInfo: [], config: config, online: 0,
    }
  },
  computed: {
    ...mapState({
      theme: state => state.theme, logged: state => state.logged, menu: state => state.menu.menu,
      pageLoading: state => state.pageLoading, windowLoading: state => state.windowLoading, socketAction: state => state.socketAction,
    }),
    layoutClass() {
      let className = 'layout-' + this.theme;
      if (this.$route.meta && this.$route.meta.info && !this.$route.meta.info.show_slider) { className += ' hide'; }
      return className;
    }
  },
  created() { this.checkLayout(); },
  watch: {
    $route: function () { this.checkLayout(); },
    collapsed(v) {
      if (v) { this.openKeysTemp = JSON.parse(JSON.stringify(this.openKeys)); this.openKeys = []; }
      else { this.openKeys = JSON.parse(JSON.stringify(this.openKeysTemp)); }
    },
    logged(val) { if (!val) { this.$router.push({name: 'login'}) } },
    socketAction(val) { if (val.action === 'connect' || val.action === 'onClose') { this.online = val.data.online; } }
  },
  methods: {
    footerClick() {
      this.$websocket && this.$websocket.send(JSON.stringify({uid: this.$store.state.userInfo.id}));
    },
    checkLayout() {
      let that = this;
      const path = this.$route.path;
      const meta = this.$route.meta || {};
      const info = meta.info || { title: '系统页面', is_inner: false, fullUrl: path.substring(1) };

      that.breadCrumbInfo = [];
      that.breadCrumbInfo.push({title: info.title, 'path': '/' + (info.fullUrl || '')});
      if (!info.is_inner) { that.openKeys = []; that.selectedKeys = []; }
      let openKey = null;

      function getArray(data, id) {
        if(!data || !Array.isArray(data)) return;
        data.forEach(function (v) {
          if (v.id == id) { openKey = v; }
          if (v.children) { getArray(v.children, id); }
        });
      }

      if (meta.model) {
        getArray(that.menu, meta.model);
        if (openKey && openKey.pid) { getArray(that.menu, openKey.pid); }
      } else {
        getArray(that.menu, info.id);
      }

      if (!openKey) {
        if (that.menu && that.menu.length > 0) { openKey = that.menu[0]; }
        else { openKey = { title: info.title, id: 'default', fullUrl: info.fullUrl, children: [] }; }
      }

      that.breadCrumbInfo.push({title: openKey.title, 'path': '/' + openKey.fullUrl});
      this.selectedModelKeys = [(openKey.id || '').toString()];
      if (!openKey.children) { that.menus = []; return false; }
      that.menus = openKey.children;
      if (info.is_inner) return false;

      that.menus.forEach(function (v) {
        if (v.pid == that.selectedModelKeys) {
          if (v.children) {
            v.children.forEach(function (v2) {
              if ('/' + v2.fullUrl == path) {
                that.selectedKeys.push(v2.id.toString());
                if (!that.collapsed) { that.openKeys.push(v2.pid.toString()); }
                else { that.openKeysTemp = [v2.pid.toString()]; }
              }
            })
          } else { that.selectedKeys.push(v.id.toString()); }
        }
      });
      that.$store.dispatch('setBreadCrumbInfo', that.breadCrumbInfo);
    },
    menuClick(event, menu) {
      let that = this; let openKeys = [];
      if (!this.openKeys.length) { openKeys = [menu.id.toString()]; }
      else { openKeys = JSON.parse(JSON.stringify(that.openKeys)); }
      that.menus.forEach(function (v) {
        if (v.id == openKeys) {
          let turnPath = '/';
          if (v.children) {
            v.children.forEach(function (v2) { if (v2.id == event.key) turnPath += v2.fullUrl; })
          } else { turnPath += v.fullUrl; }
          that.$router.push(turnPath);
        }
      });
    },
    menuModelClick(event) {
      let that = this;
      that.menu.forEach(function (v) {
        if (v.id == event.key) {
          that.menus = v.children; let turnPath = '/';
          if (!v.children) { turnPath += v.fullUrl; }
          else if (!v.children[0].children) { turnPath += v.children[0].fullUrl; }
          else { turnPath += v.children[0].children[0].fullUrl; }
          if (turnPath != '/#') { that.$router.push(turnPath); }
        }
      });
    },
    onModelOpenChange() {},
    onOpenChange(openKeys) {
      let that = this;
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
      let hasOpenKey = false;
      this.menus.forEach(function (v) {
        if (v.id == latestOpenKey) { that.openKeys = latestOpenKey ? [latestOpenKey] : []; hasOpenKey = true; }
      });
      if (!hasOpenKey) { that.openKeys = openKeys }
    },
  },
}
</script>
<style lang="less">
</style>