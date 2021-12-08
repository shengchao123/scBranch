<template>
  <div v-if="!item.hidden"
       class="menu-wrapper">
    <template
              v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link :to="onlyOneChild">
        <el-menu-item :index="onlyOneChild.pageUrl"
                      :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon :icon="item.icon"
                    v-if="item.icon"
                    class="icon"></svg-icon>
          <span slot="title"
                :style="item.icon ? '' : 'margin-left:10px;color:#ffffff !important;'">{{item.name}}</span>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else
                ref="subMenu"
                :index="item.pageUrl"
                popper-append-to-body>
      <template slot="title">
        <svg-icon :icon="item.icon"
                  v-if="item.icon"
                  class="icon"></svg-icon>
        <span slot="title"
              :style="item.icon ? '' : 'margin-left: 10px;color:#ffffff !important;'">{{item.name}}</span>
      </template>
      <sidebar-item v-for="child in item.children"
                    :key="child.pageUrl"
                    :item="child"
                    :base-path="child.pageUrl" />
    </el-submenu>
  </div>
</template>

<script>
import AppLink from '../Link'

export default {
  name: 'SidebarItem',
  components: { AppLink },
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data () {
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild (children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath (routePath) {
      return routePath
    }
  }
}
</script>
<style less="scss" scoped>
.icon {
  margin-right: 16px;
}
</style>
