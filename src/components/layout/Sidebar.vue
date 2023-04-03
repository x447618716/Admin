<template>
    <el-aside class="sidebar-el-menu" width="auto">
        <el-menu class="sidebar-menu" :default-active="onRoutes" :collapse="collapse" :background-color="themeColor[11]"
                 :text-color="themeColor[10]" :active-text-color="themeColor[7]" @select="handleSelect" unique-opened>
            <template v-for="item in sidebarMenu">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="subItem in item.subs" :key="subItem.index" :index="subItem.index">
                            <span>{{ subItem.title }}</span>
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </el-aside>
</template>
<script>

    import {mapState} from 'vuex'

    export default {
        name: "Sidebar",
        data() {
            return {}
        },
        computed: {
            ...mapState('permissionRoutre', {
                sidebarMenu: state => state.sidebarMenu,
            }),
            ...mapState([
                'collapse',
                'themeColor'
            ]),
            onRoutes() {
                let path = this.$route.path;
                return path.substring(this.$route.path.lastIndexOf('/'), path.length);
            }
        },
        methods: {
            handleSelect(index) {
                if (this.onRoutes != index) {
                    this.$router.push(index);
                }
            }
        }
    }
</script>

<style scoped>
    .sidebar-el-menu::-webkit-scrollbar {
        display: none;
    }

    .sidebar-menu {
        height: 100%;
    }

    .sidebar-menu:not(.el-menu--collapse) {
        width: 250px;
    }
</style>
