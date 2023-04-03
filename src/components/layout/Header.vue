<template>
    <el-header :style="{ backgroundColor: '#'+themeColor[0] ,color: themeColor[10]}">
        <el-row type="flex" justify="space-between">
            <div class="header-left">
                <!-- 折叠按钮 -->
                <div class="pucker-btn" @click="collapseChage">
                    <i class="el-icon-menu"></i>
                </div>
                <!-- 后台系统名称 -->
                <div class="admin-title">{{$t("system.name")}}</div>
            </div>
            <div class="header-right">
                <div class="header-user-con">
                    <!-- 语言选择 -->
                    <language class="header-user-con__margin"></language>
                    <!-- 主题选择 -->
                    <theme-choice class="header-user-con__margin"></theme-choice>
                    <!-- 全屏显示 -->
                    <el-tooltip class="header-user-con__margin " effect="dark"
                                :content="fullscreen?$t('system.cancelFullScreen'):$t('system.fullScreen')"
                                placement="bottom">
                        <i class="el-icon-rank" style="transform: rotate(45deg); font-size: 24px;"
                           @click="handleFullScreen"></i>
                    </el-tooltip>
                    <!-- 输出成PDF -->
                    <el-tooltip class="header-user-con__margin " effect="dark" content="PDF" placement="bottom">
                        <i class="sx-icon-pdf" style="font-size: 24px;" @click="getPdf($route.meta.title)"></i>
                    </el-tooltip>
                    <!-- 消息中心 -->
                    <el-badge class="header-user-con__margin" type="danger" is-dot :hidden="message?false:true">
                        <el-tooltip effect="dark" :content="$tc('system.message',message,{message:message})"
                                    placement="bottom">
                            <router-link to="/tabs">
                                <i class="el-icon-bell" style="color: #fff; font-size: 20px;"></i>
                            </router-link>
                        </el-tooltip>
                    </el-badge>
                    <!-- 用户头像 -->
                    <el-avatar class="header-user-con__margin" :src="avatar">
                        <!--图片加载失败用图-->
                        <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                    </el-avatar>
                    <!-- 用户名下拉菜单 -->
                    <el-dropdown class="header-user-con__margin" trigger="click" @command="handleCommand">
                        <div>{{account}} <i class="el-icon-caret-bottom"></i></div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item divided command="password">{{$t("system.changePassword")}}
                            </el-dropdown-item>
                            <el-dropdown-item divided command="avatar">{{$t("system.changeAvatar")}}</el-dropdown-item>
                            <el-dropdown-item divided command="loginout">{{$t("system.signOut")}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </el-row>
        <el-dialog title="图片剪裁" :visible.sync="dialogVisible" width="550px" append-to-body>
            <vue-cropper-custom ref="cropper"></vue-cropper-custom>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="loading">确认</el-button>
            </div>
        </el-dialog>
    </el-header>
</template>
<script>

    import {mapState, mapMutations} from 'vuex'

    export default {
        name: "Header",
        data() {
            return {
                fullscreen: false,
                message: 0,

                dialogVisible: false,
                // 裁剪组件的基础配置option
                option: {
                    img: 'static/img/img.jpg', // 裁剪图片的地址
                    info: true, // 裁剪框的大小信息
                    outputSize: 0.8, // 裁剪生成图片的质量
                    outputType: 'jpeg', // 裁剪生成图片的格式
                    canScale: true, // 图片是否允许滚轮缩放
                    autoCrop: true, // 是否默认生成截图框
                    // 只有自动截图开启 宽度高度才生效
                    autoCropWidth: 300, // 默认生成截图框宽度
                    autoCropHeight: 200, // 默认生成截图框高度
                    fixedBox: false, // 固定截图框大小 不允许改变
                    fixed: true, // 是否开启截图框宽高固定比例
                    fixedNumber: [5, 5], // 截图框的宽高比例
                    full: true, // 是否输出原图比例的截图
                    canMoveBox: true, // 截图框能否拖动
                    canMove: true,//上传图片是否可以移动
                    original: false, // 上传图片按照原始比例渲染
                    centerBox: true, // 截图框是否被限制在图片里面
                    infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
                    maxImgSize: 2000,//限制图片最大宽度和高度
                    enlarge: 1,//图片根据截图框输出比例倍数
                    high: true, //是否按照设备的dpr 输出等比例图片,
                    mode: 'contain' //图片默认渲染方式
                },
                picsList: [],  //页面显示的数组
                // 防止重复提交
                loading: false
            }
        },
        computed: {
            ...mapState({
                account: state => state.userInfo.account,
                avatar: state => state.avatar,
                themeColor: state => state.themeColor
            })
        },
        methods: {
            ...mapMutations([
                'OUT_LOGIN',
                'SET_COLLAPSE',
                'RETSET_AVATAR'
            ]),
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                switch (command) {
                    case 'loginout':
                        this.$api.signOut().then(()=>{});
                        this.OUT_LOGIN();
                        this.$router.replace('/login');
                        break;
                    case 'password':
                        this.$router.push('/password');
                        break;
                    case 'avatar':
                        this.dialogVisible = true;
                        break;
                    default:
                        this.$message.error("非法选择");
                }
            },
            // 侧边栏折叠
            collapseChage() {
                this.SET_COLLAPSE();
            },
            // 全屏事件
            handleFullScreen() {
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },
            //提交
            handleSubmit() {
                this.loading = true;
                this.$refs.cropper.$refs.cropper.getCropBlob((data) => {
                    let reader = new FileReader();
                    reader.readAsDataURL(data);
                    reader.onload = () => {
                        this.RETSET_AVATAR(reader.result)
                    }
                    this.loading = false;
                    this.dialogVisible = false;
                });
            },
        },
        created() {
            if (document.body.clientWidth < 1300) {
                this.collapseChage();
            }
        }
    }
</script>
<style scoped lang="less" type="text/less">
    .header-left {
        font-size: 22px;
        display: flex;
    }

    .pucker-btn {
        padding: 0 21px;
        cursor: pointer;
        line-height: 60px;
    }

    .admin-title {
        line-height: 60px;
    }

    .header-user-con {
        display: flex;
        height: 60px;
        align-items: center;
    }

    .header-user-con__margin {
        margin-right: 10px;
        color: #fff;
        cursor: pointer;
    }
</style>
