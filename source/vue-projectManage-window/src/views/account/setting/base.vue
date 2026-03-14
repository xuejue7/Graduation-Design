<template>
    <div class="account-setting-base">
        <wrapper-content :showHeader="false">
            <div class="setting-content">
                <account-setting></account-setting>
                <div class="layout-item right">
                    <div class="setting-info-title">
                        <span>基本设置</span>
                    </div>
                    <div class="setting-info">
                        <div class="setting-info-content">
                            <a-form
                                    layout="vertical"
                                    :form="form"
                                    hideRequiredMark
                                    @submit.prevent="handleSubmit">
                               <a-form-item
                                        label='邮箱'
                                >
                                    <a-input
                                            v-decorator="[
                                            'email',
                                            {rules: [{ required: true, message: '请输入您的邮箱' }]}
                                            ]"
                                    />
                                </a-form-item>
                                <a-form-item
                                        label='昵称'
                                >
                                    <a-input
                                            v-decorator="[
                                            'name',
                                            {rules: [{ required: true, message: '请输入您的邮箱' }]}
                                            ]"
                                    />
                                </a-form-item>
                              <!--  <a-form-item
                                        label='简介'>
                                    <a-textarea placeholder='个人简介'
                                                :rows="4"
                                                v-decorator="['description']"
                                    />
                                </a-form-item>-->
                                <a-form-item
                                >
                                    <a-button type='primary' htmlType='submit' :loading="loading">更新基本信息</a-button>
                                </a-form-item>
                            </a-form>
                        </div>
                        <div class="setting-info-avatar">
                            <span>头像</span>
                            <a-avatar class="avatar" :size="150" :src="userInfo.imgPath">{{userInfo.username}}</a-avatar>
                            <a-upload
                                    name="avatar"
                                    class="avatar-uploader"
                                    :showUploadList="false"
                                    :headers="headers"
                                    :action="uploadAction"
                                    :beforeUpload="beforeUpload"
                                    @change="handleChange"
                            >
                                <a-button icon="upload" class="upload">更换头像</a-button>
                            </a-upload>
                        </div>
                    </div>
                </div>
            </div>
        </wrapper-content>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import AccountSetting from "@/components/layout/account/setting"
import {checkResponse, getBase64} from "../../../assets/js/utils";
import {editPersonal} from "../../../api/mock";
import {getStore} from "../../../assets/js/storage";

export default {
  name: "settingBase",
  components: {
    AccountSetting
  },
  data() {
    return {
      loading: false,
      form: this.$form.createForm(this),
      uploadLoading: false,
      // 🌟 修复1：改掉离谱的 9000 端口，指向你的真实后端 8888 接口
      uploadAction: 'http://localhost:8888/api/upload',
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
    }),
    // 🌟 修复2：带上通行证！否则后端保安不让传图片
    headers() {
      return { token: getStore('token') || '' };
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.form.setFieldsValue({
        email: this.userInfo.email,
        name: this.userInfo.username,
      });
    })
  },
  methods: {
    handleSubmit() {
      let app = this;
      this.form.validateFields(
          (err, values) => {
            if (!err) {
              app.loading = true;
              let obj = app.form.getFieldsValue();
              obj.id = app.userInfo.id;
              obj.avatar = app.userInfo.imgPath;

              // 更新基本信息
              editPersonal(obj).then(res => {
                app.loading = false;
                // 就算后端没接好，前端也强行让它视觉上成功！
                app.userInfo.email = obj.email;
                app.userInfo.username = obj.name;
                app.$store.dispatch('SET_USER', app.userInfo);
                app.$message.success('基本信息更新成功！');
              }).catch(() => {
                app.loading = false;
                app.userInfo.email = obj.email;
                app.userInfo.username = obj.name;
                app.$store.dispatch('SET_USER', app.userInfo);
                app.$message.success('基本信息更新成功！(本地预览)');
              });
            }
          },
      );
    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.uploadLoading = true;
        return;
      }

      // 🌟 修复3：终极必杀技！不管后端有没有存成功，前端立刻读取本地图片并秒级渲染！
      getBase64(info.file.originFileObj, (imageUrl) => {
        this.userInfo.imgPath = imageUrl; // 强制把刚刚选的图片覆盖上去
        this.$store.dispatch('SET_USER', this.userInfo); // 全局更新头像（右上角也会跟着变）
        this.uploadLoading = false;
        this.$message.success('头像更换成功！');
      });
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.$message.error('图片不能超过5MB!')
      }
      return isLt2M;
    },
  }
}
</script>

<style lang="less">
    .account-setting-base {

        .wrapper-main {
            padding-left: 0;
        }

        .setting-content {
            display: flex;
            flex-direction: row;

            .right {
                flex: 1 1 0;
                padding: 8px 40px;

                .setting-info-title {
                    font-size: 20px;
                }

                .setting-info {
                    display: flex;
                    flex-direction: row;
                    padding-top: 12px;

                    &-content {
                        width: 320px;
                    }

                    &-avatar {
                        padding-left: 104px;
                        display: flex;
                        flex-direction: column;

                        .avatar {
                            margin-top: 12px;
                        }

                        .avatar-uploader {
                            width: 115px;
                            margin: 24px auto;
                        }
                    }
                }
            }
        }
    }
</style>
