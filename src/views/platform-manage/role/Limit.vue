<template>
  <page title="权限设置"
        needPadding>
    <div class="limit-wrap">
      <div class="mt24 center-align">
        <div>
          当前用户应用
          <el-select v-model="appCode"
                     placeholder="请选择应用">
            <el-option v-for="item in appCodeList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </div>
        <div class="ml24">
          当前用户角色
          <el-select v-model="currentRoleId"
                     placeholder="请选择">
            <el-option v-for="item in roleList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div v-show="limitTree.length > 0"
           class="mt24">
        <el-tree :data="limitTree"
                 show-checkbox
                 default-expand-all
                 node-key="id"
                 ref="tree"
                 icon-class=''
                 :expand-on-click-node="false">
        </el-tree>
        <page-handle confirmText="保存"
                     :config="{backRouteName: 'Role'}"
                     @onConfirm="onConfirm"></page-handle>
      </div>
      <page-empty v-show="limitTree.length <= 0"
                  icon='icon_zanwushuju'
                  message="暂无数据"></page-empty>
    </div>
  </page>
</template>

<script>
import PageHandle from '@/components/PageHandle'
import PageEmpty from '@/components/PageEmpty.vue'

export default {
  name: 'RoleLimit',
  methods: {
    onConfirm () {
      if (!this.$hasAuth(this.$urls.setRoleDetails)) {
        this.$message.success('暂无修改权限')
        return
      }
      const currentRoleLimitKeys = this.$refs.tree.getCheckedKeys()
      const oldRoleLimitKeys = this.roleLimitKeys
      if (JSON.parse(JSON.stringify(currentRoleLimitKeys)) === JSON.parse(JSON.stringify(oldRoleLimitKeys))) {
        this.$message.success('绑定权限成功')
        this.goBack()
        return
      }
      const params = {
        authenticationIds: this.$refs.tree.getCheckedKeys(),
        id: this.currentRoleId,
        appCode: this.appCode
      }
      this.$api.setRoleLimit(params).then(res => {
        if (res.isError) return
        this.$store.dispatch('user/setUserLimitList')
        this.$message.success('绑定权限成功')
        this.goBack()
      })
    },
    goBack () {
      this.$store.dispatch('tags/delView', this.$route)
      this.$router.push({ name: 'Role' })
    },
    // 获取当前应用的所有权限树
    reqRoleLimitTree () {
      const params = {
        appCode: this.appCode
      }
      this.$api.roleLimitTree(params).then(res => {
        if (res.isError) return
        this.limitTree = this.handleData(res.content)
        this.reqRoleLimitById()
      })
    },
    // 获取当前角色在选中的应用下的权限列表
    reqRoleLimitById () {
      const params = {
        roleId: this.currentRoleId,
        appCode: this.appCode
      }
      this.$api.roleLimitById(params).then(res => {
        if (res.isError) return
        if (!res.content) {
          this.$refs.tree.setCheckedKeys([])
          return
        }
        this.roleLimitKeys = res.content.map(item => item.id)
        this.$refs.tree.setCheckedKeys(this.roleLimitKeys)
      })
    },
    // 获取当前用户角色列表
    reqRoleList () {
      const params = {
        orgId: this.platformOrgId
      }
      this.$api.roleListByOrgId(params).then(res => {
        if (res.isError) return
        this.roleList = res.content
      })
    },
    handleData (children) {
      if (this.$isEmpty(children)) return []
      return children.map(item => {
        const subChildren = !this.$isEmpty(item.authGroupDTOList) ? item.authGroupDTOList : item.authPoolDTOList
        item.children = this.handleData(subChildren)
        item.label = item.name
        return item
      })
    },
    // 获取当前用户应用列表
    findOrgSysModuleApplication () {
      this.$api.findOrgSysModuleApplication().then(res => {
        if (res.isError) return this.$message.error(res.message)
        this.appCodeList = res.content
        if (!this.$isEmpty(this.appCodeList)) {
          this.appCode = this.appCodeList[0].code
        }
      })
    }
  },
  data () {
    return {
      handleValue: [],
      limitTree: [],
      platformOrgId: this.$route.query.platformOrgId,
      currentRoleId: this.$route.query.roleId,
      appCode: null,
      appCodeList: [],
      roleList: [],
      roleLimitKeys: []
    }
  },
  beforeRouteLeave (to, from, next) {
    to.meta.keepAlive = true
    next()
  },
  watch: {
    appCode () {
      this.reqRoleLimitTree()
    },
    currentRoleId () {
      this.reqRoleLimitById()
    }
  },
  created () {
    // TODO: 暂时还做不到 获取权限跟页面加载同步进行
    // if (!this.$hasAuth(this.$urls.setRoleDetails)) {
    //   this.$router.replace('/404')
    //   return
    // }
    this.reqRoleList()
    this.findOrgSysModuleApplication()
  },
  components: { PageHandle, PageEmpty }
}
</script>

<style lang='scss' scoped>
.limit-wrap {
  height: calc(100% - 50px);
  position: relative;
  .btn-save {
    margin-right: 24px;
  }
  /deep/ .el-tree {
    border-top: $color-de solid 1px;
    border-bottom: $color-de solid 1px;
    margin-top: -1px;
  }
  /deep/ .el-tree-node {
    border-top: $color-de solid 1px;
    margin-top: -1px;
  }
  /deep/ .el-tree-node__content {
    width: 140px !important;
    float: left !important;
    margin: 12px 22px;
  }

  /deep/ .el-tree-node__expand-icon.is-leaf {
    display: none;
  }

  /deep/ .el-tree-node__expand-icon.expanded {
    display: none;
  }

  /deep/ .el-tree-node.is-current > .el-tree-node__content:hover {
    background: #fff !important;
  }

  /deep/ .el-tree > div {
    height: auto;
    overflow: hidden;
    background: #fff !important;
  }

  /deep/ .el-tree-node__children {
    border-left: $color-de solid 1px;
  }

  /deep/ .el-tree-node:hover {
    background: #fff !important;
  }
}
</style>
