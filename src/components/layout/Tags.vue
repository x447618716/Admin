<template>
  <div style="position:relative;">
    <!-- 标签页 -->
    <el-tabs ref="tabs" v-model="activeName" :closable="tagsList.length!==1" @tab-remove="handleRemove"
             @tab-click="handleClick" style="display: flex; flex-direction: column; width: calc(100% - 100px)">
      <el-tab-pane v-for="item in tagsList" :key="item.path" :name="item.path">
                <span slot="label" style="padding: 0 5px">{{ item.title }} <i class="el-icon-refresh"
                                                                              @click.stop="handleRefresh(item.path)"
                                                                              v-if="tagsList.length!==1"
                                                                              style="padding-left: 10px; padding-right: 5px;"></i></span>
        <breadcrumb></breadcrumb>
      </el-tab-pane>
    </el-tabs>
    <!-- 标签选项 -->
    <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button style="height: 40px" type="primary">
          {{ $t('system.tabOptions') }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="other">{{ $t('system.closeOther') }}</el-dropdown-item>
          <el-dropdown-item command="all">{{ $t('system.closeAll') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import Breadcrumb from "./Breadcrumb";
import {mapState, mapMutations} from 'vuex'

export default {
  name: "Tags",
  components: {Breadcrumb},
  data() {
    return {
      activeName: null
    }
  },
  inject: ['reload'],
  computed: {
    ...mapState({
      tagsList: state => state.tagsList
    }),
  },
  methods: {
    ...mapMutations([
      'SET_TABS_LIST',
      'CLOSE_OTHER_TABS',
      'REMOVE_TABS'
    ]),
    //关闭全部标签
    closeAll() {
      //清除所有keepalive缓存
      this.tagsList.forEach(item => {
        //当前显示路由
        if (item.path === this.activeName) {
          // 此处加延时是防止嵌套路由实例过早被销毁
          this.$nextTick(function () {
            this.$utils.clearKeepAlive(item.route.matched[1].instances.default, item.key)
            this.REMOVE_TABS(item.path);
            if (!this.tagsList.length) {
              if (this.$route.path == '/manageCenter') {
                this.SET_TABS_LIST(this.$route)
                this.activeName = this.$route.path;
              } else {
                this.$router.push('/');
              }
            }
          })
        } else {
          this.$utils.clearKeepAlive(item.route.matched[1].instances.default, item.key)
          this.REMOVE_TABS(item.path);
        }
      });
      // this.REMOVE_TABS('ALL');
      if (!this.tagsList.length) {
        if (this.$route.path == '/manageCenter') {
          this.SET_TABS_LIST(this.$route)
          this.activeName = this.$route.path;
        } else {
          this.$router.push('/');
        }
      }
    },
    //关闭其他标签
    closeOther() {
      //清除其他标签的keepalive缓存
      this.tagsList.forEach(item => {
        if (item.path !== this.activeName) {
          this.$utils.clearKeepAlive(item.route.matched[1].instances.default, item.key)
        }
      });
      this.CLOSE_OTHER_TABS(this.activeName);
    },
    //设置标签
    setTags(route) {
      const isExist = this.tagsList.some(item => {
        return item.path === route.fullPath;
      });
      if (!isExist) {
        this.$nextTick(function () {
          this.SET_TABS_LIST(route);
          if (this.$refs.tabs.$refs.nav) {
            this.$nextTick(() => {
              this.$refs.tabs.$refs.nav.$nextTick(() => {
                this.$refs.tabs.$refs.nav.scrollToActiveTab();
              });
            });
          }
        })
      }
    },
    //标签选项
    handleTags(command) {
      switch (command) {
        case 'other':
          this.closeOther();
          break;
        case 'all':
          this.closeAll();
          break;
        default:
          this.$message.error("操作错误");
          break;
      }
    },
    //移除标签页
    handleRemove(targetName) {
      let tabs = this.tagsList;
      let nextActivePath = null;
      let activeName = this.activeName;
      //判断关闭的是否是当前活动的tab页（是：选择相邻的一个tab页作为下一个活动页）
      if (activeName === targetName) {
        this.tagsList.forEach((tab, index) => {
          if (tab.path === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              nextActivePath = nextTab;
              activeName = nextTab.path;
            }
          }
        });
      }

      //获取当前标签对象
      let currentTab = this.tagsList.find(tab => tab.path == targetName);
      if (currentTab) {
        //清除当前关闭的标签的keepalive缓存
        this.$utils.clearKeepAlive(currentTab.route.matched[1].instances.default, currentTab.key)
      }

      //移除tab页
      this.REMOVE_TABS(targetName);

      //移除的是当前活动页时切换路由
      if (this.activeName === targetName) {
        this.activeName = activeName;
        this.$router.push(nextActivePath.path);
      }
    },
    //点击或选中标签页
    handleClick(tab) {
      if (this.$route.fullPath != tab.name) {
        this.$router.push(tab.name)
      }
    },
    //刷新路由
    handleRefresh(target) {
      if (this.activeName == target) {
        let active = this.tagsList.find(item => item.path === this.activeName);
        if (active) {
          this.$utils.clearKeepAlive(active.route.matched[1].instances.default, active.key);
          this.reload();
        }
      }
    }
  },
  watch: {
    $route(to) {
      switch (to.name) {
        case '404':
          break;
        case '403':
          break;
        case 'login':
          break;
        default:
          if (!to.meta.isLeaf) {
            this.activeName = to.fullPath;
            if (!this.tagsList.some(tab => tab.path == this.activeName)) {
              this.setTags(to);
            }
          }
      }
    }
  },
  created() {
    if (!this.$route.meta.isLeaf) {
      this.activeName = this.$route.fullPath;
      this.setTags(this.$route);
    }
  }
}

</script>


<style>
.el-tabs__header {
  padding-right: 100px;
}

.el-tabs__content {
  flex: 1;
  overflow-x: hidden;
  overflow-y: scroll;
}

.el-tabs__content::-webkit-scrollbar {
  display: none;
}

.tags-close-box {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  text-align: center;
  width: 100px;
  height: 38px;
  background: transparent;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
  z-index: 10;
}

.el-tabs__nav-scroll {
  overflow-y: hidden !important;
  overflow-x: scroll !important;
}

.el-tabs__nav-scroll::-webkit-scrollbar {
  display: none;
}
</style>
