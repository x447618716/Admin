<template>
    <el-breadcrumb v-if="breadcrumb.length>1" separator="/" style="padding-left: 10px; padding-bottom: 20px">
        <el-breadcrumb-item v-for="item in breadcrumb" :key="item.index">{{item.title}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
    import {mapState} from 'vuex'
    import {searchRouter} from "@/utils";

    export default {
        name: "Breadcrumb",
        data() {
            return {
                breadcrumb: []
            }
        },
        computed: {
            ...mapState('permissionRoutre', {
                sidebarMenu: state => state.sidebarMenu
            }),
        },
        watch: {
            $route(to) {
                this.breadcrumb = searchRouter(this.sidebarMenu, to.fullPath);
            }
        },
        methods: {},
        created() {
            this.breadcrumb = searchRouter(this.sidebarMenu, this.$route.fullPath);
        }
    }
</script>

<style scoped lang="less" type="text/less">

</style>
