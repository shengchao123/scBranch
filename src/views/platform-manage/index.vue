<template>
  <div class='platform-wrap'>
    <page-drag>
      <template v-slot:left>
        <org-tree></org-tree>
      </template>
      <template v-slot:right>
        <div class="component-container">
          <div class="title">{{organizationName}}</div>
          <keep-alive>
            <router-view :key="key"
                         v-if="$route.meta.keepAlive" />
          </keep-alive>
          <router-view :key="key"
                       v-if="!$route.meta.keepAlive" />
        </div>
      </template>
    </page-drag>
  </div>
</template>

<script>
import OrgTree from './components/OrgTree'
import pageDrag from '@/components/PageDrag'
export default {

  name: 'index',
  components: { OrgTree, pageDrag },
  created () {
    this.$store.dispatch('app/setOrgs')
  },
  computed: {
    showOrganizationTree () {
      const path = this.$route.path
      return this.hideOrgTreePathList.indexOf(path) === -1
    },
    showOrgTreeAndTitle () {
      const path = this.$route.path
      return this.hideOrgTreeAndTitle.indexOf(path) === -1
    },
    organizationName () {
      return this.$store.state.platform.platformOrg.name
    },
    key () {
      return this.$route.path
    }
  }
}
</script>

<style lang='scss' scoped>
.platform-wrap {
  height: 100%;
  border-top-width: 12px;
  position: relative;
  background: #fff;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  .component-container {
    flex: 1;
    .title {
      margin-top: 16px;
      margin-left: 24px;
      color: #333333;
      font-weight: bold;
      font-size: 16px;
    }
  }
}
</style>
