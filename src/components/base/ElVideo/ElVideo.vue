<template>
    <div>
        <!--视频展示-->
        <div style="position:relative; width: 100%; height: 100%" @click="videoDialog=true">
            <video style="width: 100%; height: 100%" :src="src"></video>
            <div style="position: absolute; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; top: 0; left: 0; background-color: rgba(0,0,0,0.6); cursor: pointer">
                <i class="sx-icon-video" style="color:#ffffff; font-size: 35px;"></i>
            </div>
        </div>
        <!--观看视频-->
        <el-dialog :visible.sync="videoDialog" :before-close="handlePause" append-to-body>
            <video ref="video" :src="src" style="width: 100%; height: 100%; display: block; outline: none;"
                   controls
                   autoplay>
            </video>
        </el-dialog>
    </div>

</template>

<script>
    /**
     * 视频展示组件
     * @author 谢荣生
     * @version 1.0
     * @datetime 2021/2/22 14:36
     * @inheritDoc
     * */

    export default {
        name: "ElVideo",
        data() {
            return {
                videoDialog: false
            }
        },
        props: {
            src: String,
        },
        methods: {
            //暂停
            handlePause() {
                this.$refs['video'].pause();
                this.videoDialog = false;
            },
        },
        created() {
        }
    }
</script>

<style scoped lang="less" type="text/less">

</style>
