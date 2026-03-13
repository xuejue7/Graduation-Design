<template>
  <div class="members-index">
    <div class="layout-item left">
      <div class="left-content">
        <div class="search-content">
          <a-input size="large" v-model="keyword" ref="keywordInput" placeholder="搜索（文件名）">
            <a-icon slot="prefix" class="muted" type="search"/>
            <a-icon v-if="keyword" slot="suffix" class="muted" type="close-circle" @click="emitEmpty"/>
          </a-input>
        </div>
        <div class="menus">
          <a-menu mode="inline" v-model="selectedKeys" @click="handleMenuClick">
            <a-menu-item :key="index.toString()" v-for="(item,index) in menus">
              <a-icon type="file"/>
              <span>{{item.name}}</span>
            </a-menu-item>
          </a-menu>
        </div>
      </div>
    </div>
    <div class="layout-item right">
      <div class="header">
        <div class="title">
          <span>{{currentMenu.name || '全部文件'}} · {{pagination.total}}</span>
        </div>
      </div>
      <div class="members-content">
        <vue-scroll ref="contentscroll">

          <div class="list-content">
            <a-list :loading="loading">
              <a-list-item class="list-item-title">
                <a-list-item-meta>
                  <div class="muted" slot="title">名称</div>
                </a-list-item-meta>
                <div class="other-info muted">
                  <div class="info-item"  style="padding-right: 20px;"><span>大小</span></div>
                  <div class="info-item"><span>创建日期</span></div>
                  <div class="info-item">
                    <span>创建人</span>
                  </div>
                </div>
                <span slot="actions" :key="item" v-for="item in 3">
                                    <span>位</span>
                                </span>
              </a-list-item>
              <a-list-item class="list-item" :key="index" v-for="(item, index) in files">
                <a-list-item-meta>
                  <div slot="avatar" style="font-size: 38px; line-height: 1; margin-right: 10px;">
                    <a-icon v-if="['jpg','jpeg','png','gif','bmp'].includes((item.extension||'').toLowerCase())" type="picture" theme="twoTone" twoToneColor="#52c41a" />
                    <a-icon v-else-if="(item.extension||'').toLowerCase() === 'pdf'" type="file-pdf" theme="twoTone" twoToneColor="#ff4d4f" />
                    <a-icon v-else-if="['doc','docx'].includes((item.extension||'').toLowerCase())" type="file-word" theme="twoTone" twoToneColor="#1890ff" />
                    <a-icon v-else-if="['xls','xlsx'].includes((item.extension||'').toLowerCase())" type="file-excel" theme="twoTone" twoToneColor="#52c41a" />
                    <a-icon v-else-if="['mp4','avi','mov'].includes((item.extension||'').toLowerCase())" type="video-camera" theme="twoTone" twoToneColor="#eb2f96" />
                    <a-icon v-else-if="['mp3','wav'].includes((item.extension||'').toLowerCase())" type="customer-service" theme="twoTone" twoToneColor="#13c2c2" />
                    <a-icon v-else-if="['zip','rar','7z'].includes((item.extension||'').toLowerCase())" type="file-zip" theme="twoTone" twoToneColor="#722ed1" />
                    <a-icon v-else-if="(item.extension||'').toLowerCase() === 'txt'" type="file-text" theme="twoTone" twoToneColor="#8c8c8c" />
                    <a-icon v-else type="file-unknown" theme="twoTone" twoToneColor="#bfbfbf" />
                  </div>
                  <div slot="title">
                    <a-tooltip :mouseEnterDelay="0.3">
                      <template slot="title">
                        <span>{{item.originalName}}</span>
                      </template>
                      <a-input
                          :ref="`inputTitle${index}`"
                          :auto-focus="true"
                          v-model="item.name"
                          v-show="item.viewFlag"
                          @pressEnter="onCellChange(item)"
                          @blur="onCellChange(item)"></a-input>
                      <a class="text-default" v-show="!item.viewFlag" @click="seeBox(item)">{{item.originalName}}</a>
                    </a-tooltip>
                  </div>
                </a-list-item-meta>
                <div class="other-info muted">
                  <div class="info-item" style="padding-right: 20px;">
                    <span>{{item.length}}</span>
                  </div>
                  <div class="info-item">
                    <a-tooltip :title="item.createTime">
                      <span>{{ formatTime(item.createTime) }}</span>
                    </a-tooltip>
                  </div>
                  <div class="info-item">
                    <span>{{item.createUser}}</span>
                  </div>
                </div>
                <span slot="actions">
                                    <a-tooltip title="下载">
                                        <a class="muted" @click="downLoad(item)"><a-icon type="download"/></a>
                                    </a-tooltip>
                                </span>
                <span slot="actions" @click="editFile(item,index)">
                                    <a-tooltip title="编辑">
                                        <a-icon type="edit"/>
                                    </a-tooltip>
                                </span>
                <a class="muted" slot="actions">
                  <a-dropdown :trigger="['click']" placement="bottomCenter">
                    <a-tooltip :mouseEnterDelay="0.5">
                      <template slot="title">
                        <span>更多操作</span>
                      </template>
                      <a class="action-item muted">
                        <a-icon type="down"/>
                      </a>
                    </a-tooltip>
                    <a-menu class="field-right-menu"
                            @click="copyUrl(item.fileUrl)"
                            slot="overlay">
                      <a-menu-item key="copy" v-clipboard="item.fileUrl">
                        <a-icon type="link"/>
                        <span>复制链接</span>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </a>
              </a-list-item>
              <div v-if="files.length === 0 && !loading" style="text-align: center; padding: 40px; color: #999;">
                <a-icon type="inbox" style="font-size: 48px; margin-bottom: 16px; color: #d9d9d9;" />
                <p>该分类下暂无文件</p>
              </div>
            </a-list>
          </div>
        </vue-scroll>
      </div>
    </div>
    <box v-model="showInviteMember" v-if="showInviteMember" :seeUrl="seeUrl"></box>
  </div>
</template>

<script>
import _ from 'lodash'
import box from '../../components/file/box'
import pagination from "../../mixins/pagination";
import {getSource, fileRename, getSourceType} from "../../api/mock";
import {relativelyTime} from "../../assets/js/dateTime";
import {notice} from "../../assets/js/notice";
import {checkResponse} from "../../assets/js/utils";

export default {
  name: "members",
  components: {
    'box':box
  },
  mixins: [pagination],
  data() {
    return {
      keyword: '',
      selectedKeys: ['0'],
      menus: [],
      currentMenu: {},
      type: 0,
      files: [],
      loading: false,
      showLoadingMore: false,
      loadingMore: false,
      showInviteMember: false,
      seeUrl: '',
    }
  },
  watch: {
    keyword() {
      this.search();
    },
  },
  created() {
    this.getSourceType();
  },
  methods: {
    // 🌟 核心修复2：菜单点击触发器，绝对不漏接任何一次点击
    handleMenuClick(e) {
      let key = e.key;
      let item = this.menus[key];
      this.getSource(item);
    },

    // 🌟 核心修复3：霸道前端过滤，无视后台分页
    getSource(item) {
      let app = this;
      if (item != undefined) {
        this.currentMenu = item;
      }

      let fetchParams = {
        keyword: app.keyword || '',
        searchType: 0,
        page: 1,
        pageSize: 1000
      };

      app.loading = true;
      getSource(fetchParams).then(res => {
        if (checkResponse(res)) {
          let rawList = res.data.list || [];

          let menuName = app.currentMenu.name || '文件';

          if (menuName === '图片') {
            rawList = rawList.filter(f => f.extension && ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(f.extension.toLowerCase()));
          } else if (menuName === '视频') {
            rawList = rawList.filter(f => f.extension && ['mp4', 'avi', 'mov', 'rmvb'].includes(f.extension.toLowerCase()));
          } else if (menuName === '音乐' || menuName === '音频') {
            rawList = rawList.filter(f => f.extension && ['mp3', 'wav', 'flac'].includes(f.extension.toLowerCase()));
          } else if (menuName === '文档') {
            rawList = rawList.filter(f => f.extension && ['doc', 'docx', 'xls', 'xlsx', 'pdf', 'txt', 'ppt'].includes(f.extension.toLowerCase()));
          }

          app.files = rawList;
          app.files.forEach((v) => {
            v.viewFlag = false;
          });
          app.pagination.total = rawList.length;
          app.loading = false;
        }
      });
    },
    getSourceType() {
      let app = this;
      getSourceType().then(res => {
        app.menus = res.data.list;
        if(app.menus.length > 0){
          app.currentMenu = app.menus[0];
          app.getSource(app.currentMenu);
        }
      });
    },
    search: _.debounce(
        function () {
          this.getSource(this.currentMenu);
        }, 500
    ),
    seeBox(file) {
      var downloadUrl = "http://127.0.0.1:8888/api/fileDownload?fileId=" + file.id + "&fullfilename=" + encodeURIComponent(file.originalName);
      var ext = (file.extension || '').toLowerCase();

      if (['png', 'jpg', 'jpeg', 'gif', 'pdf', 'txt'].includes(ext)) {
        this.seeUrl = downloadUrl;
        this.showInviteMember = true;
        return;
      }
      var base64Url = window.btoa(unescape(encodeURIComponent(downloadUrl)));
      this.seeUrl = 'http://127.0.0.1:8012/onlinePreview?url=' + encodeURIComponent(base64Url);
      this.showInviteMember = true;
    },
    onCellChange(file) {
      let currentFile = this.files[this.currentFileIndex];
      this.files.forEach((v) => {
        v.viewFlag = false;
      });
      const fullName = `${file.name}.${file.extension}`;
      if (fullName != currentFile.originalName) {
        fileRename({fileName: fullName, fileId: currentFile.id}).then(res => {
          const result = checkResponse(res);
          if (!result) {
            return false;
          }
          currentFile.name = file.name;
          currentFile.originalName = fullName;
          notice({
            title: '重命名成功',
          }, 'notice', 'success');
        });
      }
    },
    downLoad(file) {
      window.location.href = "http://localhost:8888/api/fileDownload?fileId="+file.id;
    },
    copyUrl(url) {
      notice({
        title: '复制成功',
      }, 'notice', 'success');
    },
    editFile(file, index) {
      let app = this;
      this.files.forEach((v) => {
        v.viewFlag = false;
      });
      this.files[index].viewFlag = true;
      this.$nextTick(() => {
        app.$refs[`inputTitle${index}`][0].focus();
      });
      this.currentFileIndex = index;
    },
    emitEmpty() {
      this.keyword = '';
      this.getSource(this.currentMenu);
    },
    formatTime(time) {
      return relativelyTime(time);
    },
  }
}
</script>

<style lang="less">
.members-index {
  margin: 24px auto;
  display: flex;
  flex-direction: row;
  width: 1100px;
  padding: 0 12px;

  .layout-item {
    background: #FFF;
    width: 100%;
  }

  .left {
    padding: 12px 24px 12px 0;
    width: 280px;
    height: 85vh;

    .left-content {
      width: 255px;
      height: 100%;
      border-right: 1px solid #e8e8e8;

      .search-content {
        padding: 12px;

        .anticon-close-circle {
          cursor: pointer;
          color: #ccc;
          transition: color 0.3s;
          font-size: 12px;
        }

        .anticon-close-circle:hover {
          color: #999;
        }
      }

      .menus {
        /* 给菜单区域添加一点间距 */
        padding-right: 12px;
      }
    }

    .ant-menu-root {
      border-right: none;
    }
  }

  .right {
    padding: 24px 12px 12px 0;

    .header {
      padding-right: 12px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e8e8e8;
      padding-bottom: 24px;

      .title {
        font-size: 18px;
      }
    }

    .members-content {
      height: 75vh;

      .list-content {
        .list-item-title {
          padding: 10px 20px;
        }

        .list-item {
          border-bottom: none;
          margin-bottom: 2px;
          padding: 10px 20px;
          transition: background-color 218ms;

          &:hover {
            background-color: #f5f5f5;
          }

          .ant-list-item-meta-title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
            margin-bottom: 0;
            line-height: 42px;
          }
        }

        .other-info {
          display: flex;

          .info-item {
            display: flex;
            flex-direction: column;
            padding-left: 0;
            width: 100px;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>