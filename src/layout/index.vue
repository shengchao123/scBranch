<template>
  <div class='layout-wrap'
       :class="wrapClass">
    <navbar class="navbar"></navbar>
    <sidebar class="sidebar"></sidebar>
    <div class="content">
      <tags-view />
      <div class="main-container">
        <app-main></app-main>

        <div class="login-time between-row color-666">
          <span>当前登录：{{loginTime}}</span>
          <span>©杭州商旅数字经济发展有限公司 浙ICP备19051069号-1</span>
        </div>
      </div>
    </div>
    <theme></theme>

    <first-login ref="firstLogin"></first-login>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView, FirstLogin } from './components'
import Theme from './components/navbar/components/theme/Theme'
import { getGlobalParams, setGlobalParams } from '@u/login'
import config from '@/config'
export default {
  name: 'index',
  methods: {
    // 初始化系统操作
    initSystem (val, temData) {
      this.$router.push('/')
      this.$store.dispatch('tags/delAllViews')
      this.initRequest()
    },
    // 系统初始化请求
    initRequest () {
      config.request.forEach(req => {
        this.$store.dispatch(req)
      })
    }
  },
  created () {
    const loginTime = window.localStorage.getItem('loginTime') || new Date().getTime()
    const temTime = Number(loginTime)
    this.loginTime = this.$moment(temTime).format('YYYY-MM-DD HH:mm:ss')
    this.initRequest()
  },
  provide () {
    // NOTE: 初始化系统信息可以调用此方法
    return {
      initSystem: this.initSystem
    }
  },
  data () {
    return {
      loginTime: ''
    }
  },
  computed: {
    wrapClass () {
      let temClass = ''
      temClass += this.$store.state.app.isCollapseSidebar ? 'collapse-sidebar ' : ''
      temClass += this.$store.state.app.isFixedHeader ? 'fixed-header' : ''
      return temClass
    }
  },
  components: {
    Navbar, Sidebar, TagsView, AppMain, Theme, FirstLogin
  },
  mounted () {
    if (getGlobalParams('first')) {
      if (!getGlobalParams('displayedFirst')) {
        this.$refs.firstLogin.show()
        setGlobalParams('displayedFirst', true)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.layout-wrap {
  .navbar {
    transition: width 0.28s;
    height: $navbarHeight;
    position: fixed;
    width: calc(100% - #{$sidebarWidth});
    top: 0;
    right: 0;
    z-index: 9;
  }
  .sidebar {
    transition: width 0.28s, height 0.28s;
    position: fixed;
    width: $sidebarWidth;
    height: 100%;
    left: 0;
    bottom: 0;
    z-index: 9;
  }
}
.collapse-sidebar > .navbar {
  width: calc(100% - #{$sidebarCollapseWidth});
}
.collapse-sidebar > .sidebar {
  width: $sidebarCollapseWidth;
}

.fixed-header > .navbar {
  width: 100%;
}
.fixed-header > .sidebar {
  height: calc(100% - #{$navbarHeight});
}

.content {
  transition: padding-left 0.28s;
  padding-left: $sidebarWidth;
  padding-top: $navbarHeight;
  height: calc(100% - #{$navbarHeight});
}

.collapse-sidebar > .content {
  padding-left: $sidebarCollapseWidth;
}

.login-time {
  height: 36px;
  line-height: 36px;
  padding: 0 24px;
}
</style>
