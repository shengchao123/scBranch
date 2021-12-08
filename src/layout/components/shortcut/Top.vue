<template>
  <div class='shortcut-wrap row center-align'>

    <div class="item row center-align pointer ml24 color-666"
         @click="onLink(item)"
         v-for="item in shortcutForList"
         v-show="isShowShortcut"
         :class="activeMenu === item.pageUrl ? 'primary-color': ''"
         :key="item.id">
      <!-- <svg-icon :icon="item.icon"
                class="mr8 icon" /> -->
      {{item.name}}
    </div>

    <el-dropdown placement="bottom"
                 class="ml24"
                 v-show="screenWidth < 1600 && isShowShortcut">
      <span class="el-dropdown-link">
        更多<i class="el-icon-caret-bottom el-icon--right primary-color"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item in shortcutForDropdown"
                          :key="item.id">
          <div @click="$router.push(item.pageUrl)">
            {{item.name}}
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <div class="ml24 item row center-align pointer  color-666"
         @click="$router.push('/shortcut')">
      <svg-icon icon="icon_shezhi"
                class="mr8 primary-color" />
      快捷导航设置
    </div>
  </div>
</template>

<script>
import { isExternal } from '@u/validate'
import config from '@/config.js'
export default {
  name: 'index',
  methods: {
    onLink (item) {
      let url = item.pageUrl
      if (isExternal(url)) {
        url = `${url}?ciphertext=${localStorage.getItem(config.localStorageKey)}`
        window.open(url)
        return
      }
      this.$router.push({ name: url })
    },
    handleDataForShow () {
      const temAllData = JSON.parse(JSON.stringify(this.shortcutAllData))
      if (this.screenWidth > 1600) {
        this.shortcutForList = temAllData
      } else if (this.screenWidth < 1600 && this.screenWidth > 1400) {
        this.shortcutForList = temAllData.splice(0, 3)
        this.shortcutForDropdown = temAllData
      } else if (this.screenWidth < 1400 && this.screenWidth > 1200) {
        this.shortcutForList = temAllData.splice(0, 2)
        this.shortcutForDropdown = temAllData
      } else {
        this.shortcutForList = []
        this.shortcutForDropdown = temAllData
      }
    }
  },
  mounted () {
    this.screenWidth = document.body.clientWidth
    this.handleDataForShow()
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
        that.handleDataForShow()
      })()
    }
  },
  computed: {
    isCollapseSidebar () {
      return this.$store.state.app.isCollapseSidebar
    },
    isFixedHeader () {
      return this.$store.state.app.isFixedHeader
    },
    shortcuts () {
      return this.$store.state.user.shortcuts
    },
    isShowShortcut () {
      return this.$store.state.user.isShowShortcut
    },
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  },
  data () {
    return {
      screenWidth: '',
      shortcutForList: [],
      shortcutForDropdown: [],
      shortcutAllData: []
    }
  },
  watch: {
    shortcuts: {
      handler (n) {
        this.shortcutAllData = n
        this.handleDataForShow()
      },
      immediate: true
    }
  }
}
</script>

<style lang='scss' scoped>
.shortcut-wrap {
  .item:hover {
    color: $primaryColor;
    .icon {
      color: $primaryColor;
    }
  }
}
</style>
