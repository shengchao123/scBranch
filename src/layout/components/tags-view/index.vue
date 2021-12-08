<template>
  <div class='tags-wrap center-align between-row'>
    <div class="icon-wrap height center color-999 pointer rb"
         :class="tagViews.length>1 ? 'bg-transition' :''"
         @click="onLeft">
      <svg-icon icon="icon_paging_left" />
    </div>
    <el-scrollbar ref="scrollContainer"
                  :vertical="true"
                  class="scroll-container flex1"
                  @wheel.native.prevent="handleScroll">
      <router-link v-for="tag in tagViews"
                   ref="tag"
                   :key="tag.path"
                   :class="tagClass(tag)"
                   :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
                   tag="span"
                   class="tags-item pointer rb i-block ft12 color-666">
        <span class="mr8">{{ tag.title }}</span>
        <span class="el-icon-close"
              @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </el-scrollbar>

    <div class="height center-align ">
      <!-- 右侧快进按钮 -->
      <div class="lb icon-wrap height center color-999 pointer"
           :class="tagViews.length>1 ? 'bg-transition' :''"
           @click="onRight">
        <svg-icon icon="icon_paging_right" />
      </div>

      <!-- 关闭菜单 -->
      <el-dropdown class="menu lb rb pointer"
                   trigger="click"
                   @visible-change="rotate = !rotate"
                   @command="onMenuCommand">
        <div class="bg-transition color-666 title line-height pl16 pr16">
          <span>关闭操作</span>
          <svg-icon class="ft12 color-999 ml8"
                    icon="icon_xiangxia"
                    :class="[rotate?'default-arrow-roate':'default-arrow']" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in items"
                            :key="index"
                            class="height dropdown-item"
                            :command="item.command">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 退出按钮 -->
      <div class="bg-transition pl16 pr16  color-666 pointer height line-height"
           @click="onLogout">
        <svg-icon class="mr8 color-999"
                  icon="icon_exittuichu" />
        <span>退出</span>
      </div>
    </div>
  </div>
</template>

<script>

import { logout } from '@u/login'
import config from '@/config.js'
const tagAndTagSpacing = 4 // tagAndTagSpacing
export default {
  name: 'index',
  methods: {
    handleScroll (e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 40
      const $scrollWrapper = this.scrollWrapper
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
    },
    // 回到最左边
    onLeft () {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        if (this.$isEmpty(tags)) {
          return
        }
        if (tags.length > 0) {
          const tag = tags[0]
          this.pubilcMoveToTag(tag)
        }
      })
    },
    // 回到最右边
    onRight () {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        if (this.$isEmpty(tags)) {
          return
        }
        if (tags.length > 0) {
          const tag = tags[tags.length - 1]
          this.pubilcMoveToTag(tag)
        }
      })
    },
    // 展开关闭操作菜单
    onMenuCommand (command) {
      this.tagViews.map(item => {
        if (item.path === this.$route.path) {
          this.selectedTag = item
        }
      })
      if (command === 'closeSelected') {
        this.closeSelectedTag(this.selectedTag)
      } else if (command === 'closeOthers') {
        this.closeOthersTags(this.selectedTag)
      } else if (command === 'closeAll') {
        this.closeAllTags(this.selectedTag)
      }
    },
    // 退出
    onLogout () {
      this.$confirm('', '要退出登录 ?', {
        confirmButtonText: '退出',
        cancelButtonClass: 'msg-box-cancel',
        confirmButtonClass: 'msg-box-confirm',
        cancelButtonText: '取消',
        customClass: 'custom-msg-box',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        center: true,
        showClose: false
      }).then(() => {
        localStorage.removeItem(config.localStorageKey)
        logout()
      }).catch(() => { })
    },
    addTags () {
      const { name, meta } = this.$route
      if (name && !meta.noTag) {
        this.$store.dispatch('tags/addView', this.$route)
      }
      return false
    },
    moveToCurrentTag () {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        if (this.$isEmpty(tags)) {
          return
        }
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.pubilcMoveToTag(tag)
            break
          }
        }
      })
    },
    pubilcMoveToTag (tag) {
      this.moveToTarget(tag)
      if (tag.to.fullPath !== this.$route.fullPath) {
        this.$store.dispatch('tags/updateVisitedView', this.$route)
      }
    },
    moveToTarget (currentTag) {
      const $container = this.$refs.scrollContainer.$el
      const $containerWidth = $container.offsetWidth
      const $scrollWrapper = this.scrollWrapper
      const tagList = this.$refs.tag

      let firstTag = null
      let lastTag = null

      // find first tag and last tag
      if (tagList.length > 0) {
        firstTag = tagList[0]
        lastTag = tagList[tagList.length - 1]
      }
      if (firstTag.to.path === currentTag.to.path) {
        $scrollWrapper.scrollLeft = 0
      } else if (lastTag.to.path === currentTag.to.path) {
        $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
      } else {
        // find preTag and nextTag
        const currentIndex = tagList.findIndex(item => item === currentTag)
        const prevTag = tagList[currentIndex - 1]
        const nextTag = tagList[currentIndex + 1]

        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

        if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
          $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
        } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
          $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
        }
      }
    },
    closeSelectedTag (tag) {
      this.$store.dispatch('tags/delView', tag).then(({ tagViews }) => {
        if (this.isActive(tag)) {
          this.toLastView(tagViews, tag)
        }
      })
    },
    isActive (route) {
      return route.path === this.$route.path
    },
    closeOthersTags () {
      this.$router.push(this.selectedTag, () => { })
      this.$store.dispatch('tags/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags (tag) {
      this.$store.dispatch('tags/delAllViews').then(({ tagViews }) => {
        if (this.affixTags.some(item => item.path === tag.path)) {
          return
        }
        this.toLastView(tagViews, tag)
      })
    },
    toLastView (tagViews, tag) {
      const latestView = tagViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (tag.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + tag.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    handleDelTagView () {
      this.tagViews.forEach(tag => {
        if (tag.path === this.$route.path) {
          this.closeSelectedTag(tag)
        }
      })
    }
  },
  data () {
    return {
      // 菜单数据
      items: Object.freeze([
        {
          name: '关闭当前选项卡',
          command: 'closeSelected',
          class: 'bb item'
        },
        {
          name: '关闭全部选项卡',
          command: 'closeAll',
          class: 'bb item'
        },
        {
          name: '关闭其他选项卡',
          command: 'closeOthers',
          class: 'item'
        }
      ]),
      selectedTag: {},
      affixTags: [],
      rotate: false,
      visible: true
    }
  },
  computed: {
    tagViews () {
      return this.$store.state.tags.tagViews
    },
    tagClass () {
      return function (tag) {
        return tag.path === this.$route.path && 'active-tag'
      }
    },
    scrollWrapper () {
      return this.$refs.scrollContainer.$refs.wrap
    }
  },
  mounted () {
    this.$bus.$on('delTagView', () => {
      this.handleDelTagView()
    })
  },
  watch: {
    $route: {
      handler () {
        this.addTags()
        this.moveToCurrentTag()
      },
      immediate: true
    },
    visible (value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
$height: 40px;
.height {
  height: $height - 2px;
}
.line-height {
  line-height: $height - 2px;
}
.el-icon-close {
  width: 16px;
  height: 16px;
  vertical-align: 2px;
  border-radius: 50%;
  text-align: center;
  &:before {
    display: inline-block;
    vertical-align: -3px;
  }
  &:hover {
    background-color: #b4bccc;
    color: #fff;
  }
}

.active-tag {
  .el-icon-close:before {
    display: inline-block;
    vertical-align: -3px;
  }
  .el-icon-close:hover {
    background-color: #ffffff;
    color: $primaryColor;
  }
}

.tags-wrap {
  height: $height - 2px;
  border-bottom: 2px solid $primaryColor;
  .icon-wrap {
    font-size: 18px;
    width: 47px;
    background-color: $color-f9;
  }
  .title:focus {
    outline: none;
  }

  .bg-transition {
    transition: all 0.25s ease;
    background-color: $color-f9;
    &:hover {
      background: #eee;
    }
  }
  .default-arrow {
    transition: all 0.3s;
  }
  .default-arrow-roate {
    transform: rotate(180deg);
    transition: all 0.3s;
  }

  .scroll-container {
    height: $height - 2px;

    /deep/ .el-scrollbar__wrap {
      height: $height + 18px;
    }
    /deep/ .el-scrollbar__view {
      white-space: nowrap;
    }
    .tags-item {
      height: $height - 2px;
      min-width: 70px;
      padding: 0 12px;
      text-align: center;
      line-height: $height - 2px;
      background: #ffffff;
      &:last-of-type {
        margin-right: 16px;
      }
      &:hover {
        background: $color-eee;
      }
      &.active-tag {
        color: #fff;
        background-color: $primaryColor;
      }
    }
  }
}
.dropdown-item {
  line-height: $height - 2px !important;
}
</style>
