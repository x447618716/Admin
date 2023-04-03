<template>
    <vue-tinymce :key="_uid" v-model="context" :setting="editConfig"></vue-tinymce>
</template>

<script>
    import axios from "../../axios"
    import VueTinymce from "@packy-tang/vue-tinymce/src/vue-tinymce";

    let defaultSetting = {
        theme: "silver",
        skin: 'oxide-dark', //皮肤
        language: 'zh_CN', //中文
        browser_spellcheck: true, // 拼写检查
        branding: false, // 去水印
        elementpath: true, //禁用编辑器底部的状态栏
        statusbar: true, // 隐藏编辑器底部的状态栏
        paste_data_images: true, // 是否允许粘贴图像
        menubar: true, // 隐藏最上方menu
        fontsize_formats: '14px 16px 18px 20px 24px 26px 28px 30px 32px 36px', //字体大小
        font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue;PingFang SC;sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun;serifsans-serif;Terminal=terminal;monaco;Times New Roman=times new roman;times', //字体
        file_picker_types: 'media',
        images_upload_credentials: true,
        content_style: "img {max-width:100%;}",
        insertdatetime_element: true,//启用此选项时，插入日期/时间时使用html5元素（time）包裹如<time datetime="2019-04-02">2019-04-02</time>
        insertdatetime_formats: ["%Y年%m月%d日", "%H时%M分", "%Y年%m月%d日 %H时%M分", "%Y-%m-%d", "%H:%M", "%Y-%m-%d %H:%M"],
        plugins: [
            'advlist', 'lists', 'wordcount', 'autolink', 'link', 'image', 'charmap', 'print', 'preview', 'anchor',
            'searchreplace', 'codesample', 'code', 'directionality', 'fullscreen', 'emoticons', 'help', 'hr', 'media',
            'insertdatetime', 'table','indent2em'
        ],
        removed_menuitems: "newdocument",
        toolbar: [
            'fontselect fontsizeselect restoredraft link lineheight forecolor backcolor bold italic underline strikethrough indent2em | alignleft aligncenter alignright alignjustify | image quicklink h2 h3 blockquote table numlist bullist preview fullscreen emoticons hr ltr rtl'
        ],
        // 图片上传三个参数，图片数据，成功时的回调函数，失败时的回调函数
        images_upload_handler: function (blobInfo, success, failure) {
            let formdata = new FormData();
            formdata.append("file", blobInfo.blob());
            // 上传图片接口，跟后端同事协调上传图片
            axios.post('/SXBS-INFORMATION/file/uploadFileTeaching', formdata)
                .then(res => {
                    if (!res.code) {
                        success(res.data);
                    } else {
                        failure(res.message);
                    }
                }).catch(() => {
                failure("图片上传失败");
            });
        },
        file_picker_callback: function (callback, value, meta) {
            if (meta.filetype == 'media') {
                let input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.onchange = function () {
                    let file = this.files[0];//只选取第一个文件。如果要选取全部，后面注意做修改
                    let formData = new FormData();
                    formData.append('file', file);
                    axios.post('/SXBS-INFORMATION/file/uploadFileTeaching', formData)
                        .then(res => {
                            if (!res.code) {
                                callback(res.data, {source2: file.name});
                            }
                        });
                    input.remove();
                };
                //触发点击
                input.click();

            }
        }
    };

    export default {
        name: "TinyMceEditor",
        components: {VueTinymce},
        data() {
            return {
                context: null,
            }
        },
        props: {
            value: String,
            placeholder: {
                type: String,
                default: "请输入"
            },
            height: {
                type: Number,
                default: 370
            }
        },
        watch: {
            context: {
                handler(val) {
                    this.$emit('input', val)
                }
            },
            value: {
                handler(val) {
                    if (val == null || val.trim() == '') {
                        this.context = '';
                    } else {
                        this.context = val;
                    }
                },
                deep: false,
                immediate: true
            },
        },
        computed: {
            editConfig() {
                let height = this.height;
                let placeholder = this.placeholder;
                return Object.assign({}, defaultSetting, {
                    height,
                    placeholder
                })
            }
        },
        methods: {},
        created() {
        }
    }
</script>

<style scoped lang="less" type="text/less">

</style>
