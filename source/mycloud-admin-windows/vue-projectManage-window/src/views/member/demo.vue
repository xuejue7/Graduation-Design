<template>
    <div class="inviteFromLink" style="height: 100%;">
        <div class="content">
            <a-spin :spinning="loading">
                <a-card :title="`来自 ${inviteLink.member.name} 的分享`">
                    <div class="header">
                    <span>
                        {{inviteLink.member.name}} 邀请你
                    </span>
                    </div>
                    <div class="member-info">
                        <div class="avatar">
                            <a-avatar size="large" :src="inviteLink.member.avatar"></a-avatar>
                        </div>
                        <div class="info">
                            <p>{{inviteLink.member.name}}</p>
                            <p class="muted">{{inviteLink.member.email}}</p>
                        </div>
                    </div>
                    <a-button type="primary" block size="large" class="middle-btn" @click="acceptFile">
                        <span>提取文件</span>
                    </a-button>
                </a-card>
            </a-spin>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import {checkResponse} from "@/assets/js/utils";
    import {getLinkInfo} from "../../api/mock";

    export default {
        data() {
            return {
                loading: false,
                inviteLink: {
                    member: {
                        name: 11,
                        email: '341'
                    }
                },
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo,
            })
        },
        created() {
            //this.getInviteInfo();
        },
        methods: {
            getInviteInfo() {
                this.loading = true;
                getLinkInfo(this.$route.params.code).then(res => {
                    this.inviteLink = res.data;
                    this.loading = false;
                });
            },
            acceptFile() {

            }
        }
    }
</script>
<style lang="less">
    .inviteFromLink {
        .content {
            width: 600px;
            margin: 50px auto;

            .header {
                font-size: 18px;
            }

            .member-info {
                margin: 36px 0;
                display: flex;
                align-items: center;

                .avatar {
                    margin-right: 12px;
                }

                .info {
                    p {
                        margin: 0;
                    }
                }
            }
        }
    }
</style>
