<template>
  <div class="home-container">
    <a-card class="welcome-card" :bordered="false">
      <a-row type="flex" align="middle">
        <a-col :flex="1">
          <div class="user-greeting">
            <a-avatar :size="72" :src="userInfo.imgPath" icon="user" class="glow-avatar" />
            <div class="text-box">
              <h1 class="welcome-title">{{ helloTime }}{{ userInfo.username }}，欢迎回来！</h1>
              <p class="welcome-subtitle">
                <a-tag color="blue">核心开发者</a-tag>
                <span class="muted">星云网盘安全防护中 | 当前节点：Hadoop-Cluster-01</span>
              </p>
            </div>
          </div>
        </a-col>
        <a-col>
          <div class="header-stats">
            <div class="stat-item">
              <p class="stat-label">累计分享</p>
              <p class="stat-value orange">{{ shareNum }}</p>
            </div>
            <a-divider type="vertical" style="height: 40px" />
            <div class="stat-item">
              <p class="stat-label">云端文件</p>
              <p class="stat-value green">{{ fileNum }}</p>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <a-row :gutter="20">
      <a-col :span="8">
        <a-card title="存储集群状态" :bordered="false" class="info-card side-card">
          <div class="chart-box">
            <a-progress type="dashboard" :percent="35" :stroke-width="10" :width="140" stroke-color="#52c41a" />
            <div class="chart-desc">
              <div class="desc-title">存储空间负载均衡</div>
              <div class="desc-status"><a-badge status="processing" text="NameNode 运行正常" /></div>
            </div>
          </div>
          <a-divider style="margin: 12px 0" />
          <div class="type-distribution">
            <h4 class="sub-title">文件类型分布</h4>
            <div class="type-item"><span class="type-dot img"></span> 图片文件 <span class="pull-right">45%</span></div>
            <a-progress :percent="45" size="small" stroke-color="#1890ff" :show-info="false" />
            <div class="type-item"><span class="type-dot doc"></span> 文档资料 <span class="pull-right">30%</span></div>
            <a-progress :percent="30" size="small" stroke-color="#52c41a" :show-info="false" />
            <div class="type-item"><span class="type-dot video"></span> 多媒体 <span class="pull-right">25%</span></div>
            <a-progress :percent="25" size="small" stroke-color="#fa8c16" :show-info="false" />
          </div>
        </a-card>
      </a-col>

      <a-col :span="16">
        <a-card title="系统操作流水 (2026年)" :bordered="false" class="info-card main-card">
          <a-timeline>
            <a-timeline-item v-for="(item, index) in operateLogs" :key="index" :color="index === 0 ? 'green' : 'gray'">
              <a-icon v-if="index === 0" slot="dot" type="check-circle-o" style="font-size: 16px;" />
              <div class="log-item">
                <div class="log-header">
                  <span class="log-op">{{ item.operation }}</span>
                  <span class="log-time">{{ item.createTime }}</span>
                </div>
                <div class="log-user"><a-icon type="user" /> 操作员：{{ item.userName }}</div>
              </div>
            </a-timeline-item>
          </a-timeline>
        </a-card>

        <a-card title="快捷功能入口" :bordered="false" style="margin-top: 20px; border-radius: 8px;">
          <a-row :gutter="16">
            <a-col :span="6" v-for="link in quickLinks" :key="link.title">
              <div class="quick-link-box" @click="$router.push(link.path)">
                <div class="link-icon" :style="{ background: link.bg }"><a-icon :type="link.icon" /></div>
                <div class="link-title">{{ link.title }}</div>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { showHelloTime } from "../../assets/js/dateTime"

export default {
  data() {
    return {
      shareNum: 3268,
      fileNum: 12580,
      operateLogs: [
        { operation: '上传了核心组件 [Hadoop-v3.3.6-Final.zip]', userName: 'front', createTime: '2026-03-12 11:20' },
        { operation: '创建了分布式分享链接 [毕业设计成果展示]', userName: 'front', createTime: '2026-03-12 09:45' },
        { operation: '系统自动执行：Hadoop 数据块负载均衡', userName: 'system', createTime: '2026-03-11 23:00' },
        { operation: '管理员登录：执行了系统配置备份', userName: 'admin', createTime: '2026-03-11 14:10' }
      ],
      quickLinks: [
        { title: '网盘中心', icon: 'folder-open', bg: '#e6f7ff', path: '/disk/files' },
        { title: '我的分享', icon: 'share-alt', bg: '#f6ffed', path: '/share/my' },
        { title: '资源统计', icon: 'line-chart', bg: '#fff7e6', path: '/disk/overview' },
        { title: '账户设置', icon: 'setting', bg: '#f9f0ff', path: '/account/setting' }
      ]
    }
  },
  computed: {
    ...mapState({ userInfo: state => state.userInfo }),
    helloTime() { return showHelloTime() }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;

  .welcome-card { border-radius: 8px; margin-bottom: 20px;
    .user-greeting { display: flex; align-items: center;
      .text-box { margin-left: 24px;
        .welcome-title { font-size: 24px; font-weight: 600; margin-bottom: 8px; }
      }
    }
    .header-stats { display: flex; align-items: center;
      .stat-item { padding: 0 24px; text-align: right;
        .stat-label { color: #8c8c8c; margin-bottom: 4px; }
        .stat-value { font-size: 30px; font-weight: bold; }
        .orange { color: #fa8c16; } .green { color: #52c41a; }
      }
    }
  }

  .info-card { border-radius: 8px; }
  .side-card { height: 500px; }
  .main-card { height: 350px; overflow-y: auto; }

  .chart-box { text-align: center; padding: 10px 0;
    .chart-desc { margin-top: 10px; .desc-title { font-size: 15px; color: #555; } }
  }

  .type-distribution { padding: 0 10px;
    .sub-title { font-weight: 600; margin-bottom: 15px; color: #333; }
    .type-item { margin-bottom: 8px; font-size: 13px; color: #666;
      .type-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; }
      .img { background: #1890ff; } .doc { background: #52c41a; } .video { background: #fa8c16; }
    }
  }

  .log-item { background: #fafafa; padding: 10px; border-radius: 4px; border: 1px solid #f0f0f0; margin-bottom: 5px;
    .log-header { display: flex; justify-content: space-between;
      .log-op { font-weight: 600; font-size: 13px; }
      .log-time { color: #bfbfbf; font-size: 11px; }
    }
    .log-user { color: #8c8c8c; font-size: 12px; }
  }

  .quick-link-box { text-align: center; cursor: pointer; transition: all 0.3s;
    &:hover { transform: translateY(-3px); .link-title { color: #1890ff; } }
    .link-icon { width: 48px; height: 48px; line-height: 48px; border-radius: 12px; margin: 0 auto 8px; font-size: 24px; }
    .link-title { font-size: 13px; color: #555; }
  }

  .glow-avatar { box-shadow: 0 0 15px rgba(24, 144, 255, 0.3); border: 2px solid #fff; }
}
</style>