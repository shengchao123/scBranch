<template>
  <div class='navbar-wrap center-align between-row'>
    <div class="left center-align">
      <!-- 折叠侧边栏 -->
      <div @click="onCollapseSidebar"
           class="pointer rotate-box ml24"
           :class="isFixedHeader && isCollapseSidebar ? 'ml8' : 'ml24'">
        <svg-icon :icon="iconClass" />
      </div>
      <!-- 快捷导航 -->
      <shortcut></shortcut>
    </div>

    <div class="right row">
      <!-- 组织管理 -->
      <div class="org-wrap center-align"
           v-if="navbar.showOrg">
        <span class="color-666">当前组织：</span>
        <el-cascader class="cascader-company"
                     v-model="orgId"
                     @change="changeOrg"
                     :show-all-levels='false'
                     ref="refCascader"
                     :style="{width: cascaderWidth}"
                     :options="orgs"
                     :props="cascaderProps"></el-cascader>
      </div>

      <!-- 其它设置 -->
      <ul class="center-align ml16">
        <li class="ft24 color-666 center pointer nav-right-item"
            :class="{'checked-li' : item.name === drawer.name && drawer.show}"
            v-for="item in navbar.rightItems"
            :key="item.name"
            @click="onOtherItem(item)">
          <div class="relative">
            <svg-icon class="icon item-icon color-999"
                      :icon="item.icon" />
            <span v-if="notice.unreadCount > 0 && item.name === 'NoticeManage'"
                  class="notice-sum">{{notice.unreadCount}}</span>
            <span v-if="notice.unreadCount === 0 && notice.showDot && item.name === 'NoticeManage'"
                  class="notice-dot"></span>
          </div>
        </li>
      </ul>
    </div>

    <!-- 抽屉显示 -->
    <el-drawer :visible.sync="drawer.show"
               custom-class='drawer'
               :modal="false"
               :with-header="false">
      <LogManage v-if="drawer.name === 'LogManage'"></LogManage>
      <NoticeManage v-if="drawer.name === 'NoticeManage'"></NoticeManage>
      <Theme v-show="drawer.name === 'ThemeSet'"></Theme>
    </el-drawer>
  </div>
</template>

<script>
import LogManage from './components/LogManage'
import NoticeManage from './components/notice-manage'
import Shortcut from '../shortcut/Top'
import Theme from './components/theme'
import { setGlobalParams, getGlobalParams } from '@u/login'
import config from '@/config'

export default {
  name: 'index',
  methods: {
    // 更改组织选择
    changeOrg (val) {
      this.$refs.refCascader.dropDownVisible = false
      const temData = this.$refs.refCascader.getCheckedNodes()[0].data
      this.$store.commit('app/SET_CURRENT_ORG', {
        id: temData.id,
        name: temData.name
      })
      setGlobalParams('orgId', val)
      setGlobalParams('moduleRoleId', temData.moduleRoleId)
      this.initSystem()
    },
    // 其它操作内容
    onOtherItem (item) {
      this.drawer.show = true
      this.drawer.name = item.name
    },
    // 折叠侧边栏
    onCollapseSidebar () {
      this.$store.commit('app/SET_COLLAPSE_SIDEBAR', !this.isCollapseSidebar)
    },
    updateCascaderWidth () {
      if (this.$refs.refCascader.getCheckedNodes()[0]) {
        const fontSize = 14
        const margin = 38
        const label = this.$refs.refCascader.getCheckedNodes()[0].label
        this.cascaderWidth = label.length * fontSize + margin + 'px'
      } else {
        setTimeout(() => {
          this.updateCascaderWidth()
        }, 100)
      }
    }
  },
  inject: ['initSystem'],
  data () {
    return {
      orgId: getGlobalParams('orgId'), // 初始赋值
      drawer: { // 抽屉相关
        show: false,
        name: 'name'
      },
      cascaderWidth: '',
      notice: { // 通知相关
        showDot: false,
        unreadCount: 0
      },
      navbar: config.navbar, // 导航条配置

      cascaderProps: {
        value: 'id',
        children: 'child',
        label: 'name',
        checkStrictly: true,
        emitPath: false
      }
    }
  },
  watch: {
    orgId () {
      this.updateCascaderWidth()
    }
  },
  mounted () {
    this.updateCascaderWidth()
  },
  computed: {

    orgs () {
      return this.$store.state.app.orgs
    },
    isCollapseSidebar () {
      return this.$store.state.app.isCollapseSidebar
    },
    isFixedHeader () {
      return this.$store.state.app.isFixedHeader
    },
    iconClass () {
      return this.isCollapseSidebar ? 'icon_zhankai' : 'icon_shouqi'
    }
  },
  components: {
    Shortcut, LogManage, NoticeManage, Theme
  }
}
</script>

<style lang='scss' scoped>
/deep/ .el-drawer__wrapper {
  top: $navbarHeight + 1px;
  height: calc(100vh - #{$navbarHeight} - 1px);
  color: #333;
}
/deep/ .el-drawer {
  width: 306px !important;
}

.navbar-wrap {
  border-bottom: 1px solid #e6e5ea;
  background-color: $color-f9;
  .nav-right-item {
    width: 56px;
    height: $navbarHeight;
    transition: all 0.25s ease;
  }
  .nav-right-item:hover {
    background: #eee;
  }
  .checked-li {
    background: #eee;
  }
  .rotate-box {
    text-align: center;
    line-height: 40px;
    font-size: 24px;
    width: 40px;
    height: 40px;
    border-radius: 4px;
    background: $primaryColor;
    color: #ffffff;
  }

  .other-item {
    font-size: 20px;
  }
  /deep/ .el-input__inner {
    background-color: transparent;
    border: none;
  }
  .cascader-company /deep/ .el-input__icon {
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
