<template>
  <div class='sidebar-wrap'
       :class="isCollapseSidebar ? 'collapse': ''">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <Avatar v-show="!isCollapseSidebar"></Avatar>
      <div class="logo center"
           v-show="isCollapseSidebar">
        <!-- TODO: 【初始化】：4.修改收起菜单栏图标 -->
        <img src="@/assets/sidebar/logo.png"
             height="28">
      </div>
      <el-menu :collapse="isCollapseSidebar"
               :default-active="activeMenu"
               :unique-opened="true"
               :text-color="sidebar.sidebarTextColor"
               :background-color="sidebar.sidebarBgColor"
               :collapse-transition="false"
               ref="elMenu"
               mode="vertical">
        <sidebar-item v-for="(route, index) in systemMenu"
                      :key="index"
                      :item="route" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import SidebarItem from './SidebarItem'
import Avatar from '../avatar/index'
import sidebar from '@/styles/sidebar.scss'

export default {
  name: 'Sidebar',
  data () {
    return {
      sidebar
    }
  },
  computed: {
    isCollapseSidebar () {
      return this.$store.state.app.isCollapseSidebar
    },
    systemMenu () {
      return this.$store.state.app.systemMenu
    },
    activeMenu () {
      const route = this.$route
      const { meta, name } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return name
    }
  },
  components: {
    SidebarItem, Avatar
  }
}
</script>

<style lang='scss'>
@import "@/styles/sidebar.scss";

.sidebar-wrap {
  transition: all 0.28s;
  position: fixed;
  width: $sidebarWidth;
  height: 100%;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

.collapse {
  width: $sidebarCollapseWidth;
}

.logo {
  height: $navbarHeight;
  width: 100%;
  background: $sidebarOpenedBgColor;
}
</style>
