<template>
    <div class="cropper-content" :style="{width:width+'px',height: height+'px'}">
        <el-row type="flex" style="flex-direction: column">
            <vue-cropper ref="cropper" :style="{width:width+'px',height: height/2+'px'}" :img="option.img"
                         :output-size="option.size"
                         :canScale="option.canScale"
                         :output-type="option.outputType" :info="option.info" :full="option.full" :fixed="option.fixed"
                         :fixed-number="option.fixedNumber"
                         :can-move="option.canMove" :can-move-box="option.canMoveBox" :fixed-box="option.fixedBox"
                         :original="option.original"
                         :auto-crop="option.autoCrop" :auto-crop-width="option.autoCropWidth"
                         :auto-crop-height="option.autoCropHeight" :center-box="option.centerBox" :high="option.high"
                         :mode="option.mode" :maxImgSize="option.max" :enlarge="option.enlarge"
                         :info-true="option.infoTrue"></vue-cropper>
            <el-row type="flex" justify="space-between" style="margin-top: 10px; margin-bottom: 10px">
                <el-upload class="upload-demo" action=""
                           :auto-upload="false" :show-file-list="false" :on-change='changeUpload'>
                    <el-button type="success" icon="el-icon-upload">选择图片</el-button>
                </el-upload>
                <el-button type="success" icon="el-icon-view" @click="handlePreview">预览截图</el-button>
            </el-row>
            <label>
                <span>选择图片时是否显示原始宽高 (针对大图 可以铺满)</span>
                <el-checkbox v-model="option.original"></el-checkbox>
            </label>
            <label>
                <span>图片是否允许滚轮缩放</span>
                <el-checkbox v-model="option.canScale"></el-checkbox>
            </label>
            <label>
                <span>能否拖动图片</span>
                <el-checkbox v-model="option.canMove"></el-checkbox>
            </label>
            <label>
                <span>能否拖动截图框</span>
                <el-checkbox v-model="option.canMoveBox"></el-checkbox>
            </label>
            <label>
                <span>截图框固定大小</span>
                <el-checkbox v-model="option.fixedBox"></el-checkbox>
            </label>
            <label>
                <span>是否开启截图框宽高固定比例</span>
                <el-checkbox v-model="option.fixed"></el-checkbox>
            </label>
            <label>
                <span>是否自动生成截图框</span>
                <el-checkbox v-model="option.autoCrop"></el-checkbox>
            </label>
            <label>
                <span>是否根据dpr生成适合屏幕的高清图片</span>
                <el-checkbox v-model="option.high"></el-checkbox>
            </label>
            <label>
                <span>截图框是否限制在图片里(只有在自动生成截图框时才能生效)</span>
                <el-checkbox v-model="option.centerBox"></el-checkbox>
            </label>
            <label>
                <span>输出图片格式</span>
                <el-radio v-model="option.outputType" label="jpeg">jpg</el-radio>
                <el-radio v-model="option.outputType" label="png">png</el-radio>
                <el-radio v-model="option.outputType" label="webp">webp</el-radio>
            </label>
        </el-row>
        <!-- 查看大图   -->
        <el-dialog title="大图预览" :visible.sync="dialogImageVisible" append-to-body center>
            <img :src="dialogImageUrl" alt="大图" style="margin: 0 auto; display: block;">
        </el-dialog>
    </div>
</template>

<script>

    /**
     * 图片裁剪组件
     * @author 谢荣生
     * @version 1.0
     * @datetime 2021/2/22 15:45
     * @inheritDoc
     * */

    export default {
        name: "VueCropperCustom",
        data() {
            return {
                // 裁剪组件的基础配置option
                option: {
                    img: 'static/img/img.jpg',
                    info: true, // 裁剪框的大小信息
                    outputSize: 1, // 裁剪生成图片的质量
                    outputType: 'png', // 裁剪生成图片的格式
                    canScale: true, // 图片是否允许滚轮缩放
                    autoCrop: true, // 是否默认生成截图框
                    // 只有自动截图开启 宽度高度才生效
                    autoCropWidth: 200, // 默认生成截图框宽度
                    autoCropHeight: 200, // 默认生成截图框高度
                    fixedBox: false, // 固定截图框大小 不允许改变
                    fixed: false, // 是否开启截图框宽高固定比例
                    fixedNumber: [1, 1], // 截图框的宽高比例
                    full: false, // 是否输出原图比例的截图
                    canMoveBox: true, // 截图框能否拖动
                    canMove: false,//上传图片是否可以移动
                    original: false, // 上传图片按照原始比例渲染
                    centerBox: true, // 截图框是否被限制在图片里面
                    infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
                    maxImgSize: 2000,//限制图片最大宽度和高度
                    enlarge: 1,//图片根据截图框输出比例倍数
                    high: true, //是否按照设备的dpr 输出等比例图片,
                    mode: '100% auto' //图片默认渲染方式
                },
                dialogImageVisible: false,
                dialogImageUrl: null
            }
        },
        props: {
            src: {
                type: String,
                default: 'static/img/img.jpg'
            },
            width: {
                type: Number,
                default: 510
            },
            height: {
                type: Number,
                default: 510
            }
        },
        methods: {
            //限制图片大小及类型
            changeUpload(file) {
                const isLt5M = file.size / 1024 / 1024 < 5
                if (!isLt5M) {
                    this.$message.error('上传文件大小不能超过 5MB!')
                    return false
                }
                if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.raw.type)) {
                    this.$message.error('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
                    return false
                }
                this.option.img = URL.createObjectURL(file.raw);
            },
            //预览
            handlePreview() {
                this.$refs.cropper.getCropBlob((data) => {
                    this.dialogImageVisible = true;
                    this.dialogImageUrl = URL.createObjectURL(data);
                })
            }
        },
        created() {
        }
    }
</script>

<style scoped lang="less" type="text/less">

</style>
