
<template>
  <div class='organization-limit-wrap'>

    <!-- <div class="role-box">
      当前角色
      <el-select v-model="currentRole"
                 class="form-input"
                 placeholder="请选择">
        <el-option v-for="item in userInfo.roleDTOS"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
        </el-option>
      </el-select>
    </div> -->
    <div class="tree-box">
      <el-tree :props="defaultProps"
               :data="treeNodes"
               :default-expand-all="true"
               node-key="id"
               show-checkbox
               ref="tree">
      </el-tree>
    </div>
    <div class="color-666 ft12 mb24 tc">* 设置后，该用户将不能操作所选组织及其下属组织</div>
    <div slot="footer"
         class="tc">
      <el-button type="primary"
                 @click="onSave">保存</el-button>
      <el-button @click="onCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrganizationLimit',
  data () {
    return {
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      treeNodes: []
      // currentRole: {}
    }
  },
  methods: {
    onCancel () {
      this.treeNodes = []
      this.$emit('cancel')
    },
    onSave () {
      this.$confirm('', '确认要修改该用户的组织控制？', {
        confirmButtonText: '确认修改',
        customClass: 'custom-msg-box',
        cancelButtonClass: 'msg-box-cancel',
        confirmButtonClass: 'msg-box-confirm',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        center: true,
        showClose: false
      }).then(() => {
        this.updateUserFilterOrg()
      }).catch(() => { })
    },
    findUserFilterOrg () {
      const params = {
        userId: this.userInfo.id
      }
      this.$api.findUserFilterOrg(params).then(res => {
        if (res.isError) return
        const orgIds = res.content && Array.from(res.content, ({ orgId }) => orgId)
        this.$refs.tree.setCheckedKeys(orgIds)
      })
    },
    updateUserFilterOrg () {
      const params = {
        userId: this.userInfo.id,
        orgId: this.$refs.tree.getCheckedKeys()
      }
      this.$api.updateUserFilterOrg(params).then(res => {
        if (res.isError) return
        this.$message.success('组织控制设置成功')
        this.onCancel()
      })
    },
    findOrganizationFullTree () {
      const params = {
        userId: this.userInfo.id,
        orgId: this.$store.state.platform.platformOrg.id
      }
      this.$api.findOrganizationFullTree(params).then(res => {
        if (res.isError) return
        this.treeNodes = res.content.child
      })
    }
  },
  props: {
    userInfo: Object
  }
}
</script>

<style lang='scss' scoped>
.organization-limit-wrap {
  .tree-box {
    max-height: 450px;
    overflow-y: auto;
    margin: 0px 40px 16px;
    border: 1px solid $color-de;
    padding: 16px;
  }
}
</style>
