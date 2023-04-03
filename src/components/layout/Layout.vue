<template>
    <el-container direction="vertical">
        <v-header></v-header>
        <el-container style="height: calc(100% - 60px)">
            <v-sidebar></v-sidebar>
            <el-container direction="vertical">
                <v-tags :is-refresh="isRefresh"></v-tags>
                <el-main id="pdfDom" style="position: relative">
                    <transition name="effect">
                        <keep-alive>
                            <router-view
                                    v-if="($route.meta.keepAlive==undefined || $route.meta.keepAlive) && !isRefresh"
                                    :key="$route.fullPath"></router-view>
                        </keep-alive>
                    </transition>
                    <transition name="effect">
                        <router-view v-if="$route.meta.keepAlive !=undefined && !$route.meta.keepAlive && !isRefresh"
                                     :key="$route.fullPath"></router-view>
                    </transition>
                    <el-backtop target="#pdfDom" :bottom="20" :right="20"></el-backtop>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import vHeader from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import vTags from './Tags.vue';
    import {mapState} from 'vuex'

    export default {
        name: "Layout",
        data() {
            return {
                collapse: false,
                isRefresh: false,
            }
        },
        provide() {
            return {
                reload: this.reload
            }
        },
        computed: {
            ...mapState({
                themeColor: state => state.themeColor
            })
        },
        components: {
            vHeader, vSidebar, vTags
        },
        methods: {
            reload() {
                this.isRefresh = true;
                this.$nextTick(function () {
                    this.isRefresh = false;
                })
            }
        }
    }
</script>

<style scoped>
    .el-container {
        height: 100%;
    }

    .effect-enter {
        position: absolute;
        width: 100%;
        top: 0;
        transform: translateX(100%);
        opacity: 0;
    }

    .effect-enter-active {
        position: absolute;
        width: 100%;
        top: 20px;
        transition: all 0.5s ease;
    }

    .effect-enter-to {
        transform: translateX(0);
        opacity: 1;
    }

    .effect-leave {
        transform: translateX(0);
        opacity: 1;
    }

    .effect-leave-active {
        transition: all 0.5s ease;
    }

    .effect-leave-to {
        transform: translateX(-100%);
        opacity: 0;
    }
</style>
