<template>
    <div>
        <el-upload :class="(listType=='single' && !$slots.default)? 'avatar-uploader':''" :action="url"
                   :headers="headersCustom" :data="data" :multiple="multiple" :name="name" :drag="drag"
                   :with-credentials="withCredentials" :disabled="disabled" :limit="limit"
                   :show-file-list="isShowFileList" :list-type="customListType" :fileList="fileList"
                   :auto-upload="autoUpload" :http-request="httpRequest"
                   :before-upload="handleBeforeUpload"
                   :on-success="handleSuccess"
                   :on-exceed="handleExceed"
                   :on-error="handleError"
                   :on-preview="handlePreview"
                   :on-change="handleChange"
                   :on-progress="handleProgress"
                   :before-remove="handleBeforeRemove"
                   :on-remove="handleRemove">
            <template v-if="drag && !$slots.default">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    {{$t('components.ElUploadCustom.dragFilesHere')}}<em>{{$t('components.ElUploadCustom.clickUpload')}}</em></div>
            </template>
            <!--单图片上传-->
            <template v-else-if="listType=='single' && !$slots.default">
                <el-image v-if="imageUrl" :src="imageUrl" class="avatar"></el-image>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </template>
            <template v-else-if="(listType=='picture-card' || listType=='video') && !$slots.default">
                <i class="el-icon-plus"></i>
            </template>
            <template v-else-if="!$slots.default">
                <el-button size="small" type="primary">{{$t('components.ElUploadCustom.clickUpload')}}</el-button>
            </template>
            <slot></slot>
            <!--  定义插槽2.6.0以后
            <slot name='default'></slot>
            使用插槽
            <div v-slot:default></div>
            <div #default></div>
            定义插槽2.6.0以前
            <slot name='default'></slot>
            使用插槽
            <div slot='default'></div>
            作用域插槽2.6.0以后
            <slot name='default' :user="user"></slot>
            使用作用域插槽
            <div #default='user'>{{user.name}}</div>
            作用域插槽2.6.0以前
            <slot name='default' :user="user"></slot>
            使用作用域插槽
            <div slot='default' slot-scope="user">{{user.name}}</div>
            -->
            <template slot="file" slot-scope="{file}" v-if="listType=='video'">
                <el-progress v-if="file.status === 'uploading'" type="circle"
                             :stroke-width="6"
                             :percentage="parsePercentage(file.percentage)">
                </el-progress>
                <div class="el-upload-list__item-thumbnail" v-if="file">
                    <video class="el-upload-list__item-thumbnail" :src="file.url"></video>
                    <span class="el-upload-list__item-actions">
                      <span class="el-upload-list__item-preview"
                            @click="handlePreview(file)">
                        <i class="sx-icon-video" style="font-size: 19px"></i>
                      </span>
                      <span class="el-upload-list__item-delete">
                        <i class="el-icon-delete" @click="handleRemove(file,fileList)"></i>
                      </span>
                    </span>
                </div>
            </template>
        </el-upload>
        <!-- 查看大图   -->
        <el-dialog :title="$t('components.ElUploadCustom.largePreview')" :visible.sync="dialogImageVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl">
        </el-dialog>
        <!--观看视频-->
        <el-dialog :title="$t('components.ElUploadCustom.appreciationVideo')" :visible.sync="dialogVideoVisible" @close="handlePause" append-to-body>
            <video ref="video" style="width: 100%; height: 100%; display: block; outline: none;" :src="dialogVideoUrl"
                   controls
                   autoplay></video>
        </el-dialog>
        <!--试听音频-->
        <el-dialog :title="$t('components.ElUploadCustom.listenToTheAudio')" :visible.sync="dialogAudioVisible" @close="handlePause" append-to-body>
            <audio ref="audio" style="width: 100%; height: 50px; display: block; outline: none;" :src="dialogAudioUrl"
                   controls
                   autoplay></audio>
        </el-dialog>
    </div>
</template>

<script>

    /**
     * *自定义上传 - element-ui上传再封装
     * @author 谢荣生
     * @version 1.0
     * @datetime 2021/2/22 14:36
     * @inheritDoc
     * */

    import isEqual from 'lodash/isEqual'
    import {mapState} from 'vuex'

    export default {
        name: "ElUploadCustom",
        data() {
            return {
                dialogImageVisible: false,
                dialogImageUrl: null,
                dialogVideoVisible: false,
                dialogVideoUrl: null,
                dialogAudioVisible: false,
                dialogAudioUrl: null,
                imageUrl: ''
            }
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            value:{
                type: Array,
                default() {
                    return [];
                }
            },
            action: {
                type: String,
                required: true
            },
            headers: {
                type: Object,
                default() {
                    return {
                    };
                }
            },
            data: Object,
            multiple: Boolean,
            name: {
                type: String,
                default: 'file'
            },
            drag: Boolean,
            accept: String,
            fileSize: Number,
            withCredentials: Boolean,
            showFileList: {
                type: Boolean,
                default: true
            },
            listType: {
                type: String,
                default: 'text' // text,picture,picture-card single:单图片上传 video：上传视频 audio: 上传音频
            },
            disabled: Boolean,
            limit: Number,
            fileList: {
                type: Array,
                default() {
                    return [];
                }
            },
            autoUpload: {
                type: Boolean,
                default: true
            },
            httpRequest: Function,
            beforeUpload: Function,
            beforeRemove: Function,
            onRemove: Function,
            onChange: Function,
            onPreview: Function,
            onSuccess: Function,
            onProgress: Function,
            onError: Function,
            onExceed: Function
        },
        watch: {
            fileList: {
                handler: function (val) {
                    if (this.listType == 'single') {
                        this.imageUrl = val.length ? val[0].url : '';
                    }
                },
                immediate: true
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo
            }),
            url() {
                if (/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/.test(this.action)) {
                    return this.action
                } else {
                    if (typeof this.httpRequest == "function") {
                        return '#';
                    } else {
                        return this.$http.defaults.baseURL + this.action;
                    }
                }
            },
            headersCustom() {
                return Object.assign({ userId: this.userInfo.id},this.headers)
            },
            isShowFileList() {
                if (this.listType == 'single') {
                    return false;
                } else {
                    return this.showFileList;
                }
            },
            customListType() {
                if (this.listType == 'single' || this.listType == 'audio') {
                    return 'text';
                } else if (this.listType == 'video') {
                    return 'picture-card';
                } else {
                    return this.listType
                }
            }
        },
        methods: {
            //文件上传前事件
            handleBeforeUpload(file) {
                if (this.beforeUpload) {
                    return this.beforeUpload(file);
                } else {
                    //判断文件类型
                    const typeLimit = this.accept ? this.accept.split(',').includes(file.type) : true;
                    //判断文件大小
                    const sizeLimit = this.fileSize ? file.size / 1024 < this.fileSize : true;
                    if (!typeLimit) {
                        this.$message.error(this.$t('components.ElUploadCustom.uploadFileType', {type: this.accept}));
                    }
                    if (!sizeLimit) {
                        let fileSize = this.fileSize > 1024 ? Math.ceil(this.fileSize / 1024) + 'M' + this.fileSize % 1024 : this.fileSize;
                        this.$message.error(this.$t('components.ElUploadCustom.uploadFileSize', {size: fileSize}));
                    }
                    return typeLimit && sizeLimit;
                }
            },
            //文件上传超出限制事件
            handleExceed(files, fileList) {
                if (this.onExceed) {
                    this.onExceed(files, fileList);
                } else {
                    this.$message.error(this.$t('components.ElUploadCustom.uploadFileNumber', {number: this.limit}))
                }
            },
            //上传进度事件
            handleProgress(event, file, fileList) {
                if (this.onProgress) {
                    this.onProgress(event, file, fileList)
                }
            },
            //上传成功事件
            handleSuccess(res, file, fileList) {
                if (this.onSuccess) {
                    this.onSuccess(res, file, fileList);
                } else {
                    if (!res.code) {
                        if (this.listType == 'single') {
                            file.url = res.data;
                            this.imageUrl = res.data;
                            this.$emit('change', [file]);
                        } else {
                            fileList.forEach(item => {
                                if (isEqual(item, file)) {
                                    item.url = res.data
                                }
                            });
                            this.$emit('change', fileList);
                        }
                    } else {
                        this.handleRemove(file, fileList);
                        this.$message.error(this.$t('components.ElUploadCustom.uploadFileError'));
                    }
                }
            },
            //预览事件
            handlePreview(file) {
                if (this.onPreview) {
                    this.onPreview(file);
                } else {
                    if (this.listType == 'audio') {
                        this.dialogAudioUrl = file.url;
                        this.dialogAudioVisible = true;
                        if (this.$refs.video) {
                            this.$refs.video.remove()
                        }
                    } else if (this.listType == 'video') {
                        this.dialogVideoUrl = file.url;
                        this.dialogVideoVisible = true;
                        if (this.$refs.audio) {
                            this.$refs.audio.remove()
                        }
                    } else {
                        //没有提供文件类型就下载判定
                        if (!file.raw) {
                            let xhr = new XMLHttpRequest();
                            xhr.open("GET", file.url, true);
                            xhr.responseType = "blob";
                            xhr.onload = () => {
                                file.raw = xhr.response
                                //判断当前点击文件是否为图片类型 是显示大图预览
                                if (['image/png', 'image/jpeg', 'image/gif', 'application/x-jpg', 'application/x-png'].includes(file.raw.type)) {
                                    this.dialogImageUrl = file.url;
                                    this.dialogImageVisible = true;
                                }
                                //判断当前点击文件是否为音频类型 是显示试听音频
                                if (['audio/mp3'].includes(file.raw.type)) {
                                    this.dialogAudioUrl = file.url;
                                    this.dialogAudioVisible = true;
                                }
                                //判断当前点击文件是否为视频类型 是显示赏析视频
                                if (['video/mp4'].includes(file.raw.type)) {
                                    this.dialogVideoUrl = file.url;
                                    this.dialogVideoVisible = true;
                                }
                            };
                            xhr.send();
                        } else {
                            //判断当前点击文件是否为图片类型 是显示大图预览
                            if (['image/png', 'image/jpeg', 'image/gif'].includes(file.raw.type)) {
                                this.dialogImageUrl = file.url;
                                this.dialogImageVisible = true;
                            }
                            //判断当前点击文件是否为音频类型 是显示试听音频
                            if (['audio/mp3'].includes(file.raw.type)) {
                                this.dialogAudioUrl = file.url;
                                this.dialogAudioVisible = true;
                            }
                            //判断当前点击文件是否为视频类型 是显示赏析视频
                            if (['video/mp4'].includes(file.raw.type)) {
                                this.dialogVideoUrl = file.url;
                                this.dialogVideoVisible = true;
                            }
                        }
                    }
                }
            },
            //上传失败事件
            handleError(err, file, fileList) {
                if (this.onError) {
                    this.onError(err, file, fileList);
                } else {
                    this.handleRemove(file, fileList);
                    this.$message.error(this.$t('components.ElUploadCustom.uploadFileError'));
                }
            },
            //文件移除前事件
            handleBeforeRemove(file, fileList) {
                if (this.beforeRemove) {
                    this.beforeRemove(file, fileList);
                }

            },
            //删除事件
            handleRemove(file, fileList) {
                if (this.onRemove) {
                    this.onRemove(file, fileList);
                } else {
                    let index = fileList.findIndex(item => item.uid == file.uid);
                    if (index != -1) {
                        fileList.splice(index, 1);
                    }
                    this.$emit('change', fileList);
                }
            },
            //文件状态改变事件
            handleChange(file, fileList) {
                if (this.onChange) {
                    this.onChange(file, fileList);
                }
            },
            //暂停播放音频视频
            handlePause() {
                if (this.$refs.audio) {
                    this.$refs.audio.pause();
                    this.dialogAudioVisible = false;
                }
                if (this.$refs.video) {
                    this.$refs.video.pause();
                    this.dialogVideoVisible = false;
                }
            },
            //进度百分比
            parsePercentage(val) {
                return parseInt(val, 10);
            },
        },
        mounted(){
            console.log(this)
        },
        created() {

        }
    }
</script>

<style scoped>
    .avatar-uploader >>> .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
