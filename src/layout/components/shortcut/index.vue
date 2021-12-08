<template>
  <div class='shortcut-wrap between-column'>
    <page title="快捷导航设置">
      <section class="row center-align mt16">
        快捷导航显示：
        <el-switch :value="isShowShortcut"
                   @change="changeShowShortcut">
        </el-switch>
      </section>
      <div class="mt16">
        已选<span class="primary-color"> {{checkList.length}}</span> <span>最多勾选 {{max}} 个</span>
      </div>
      <div class="table-header mt24 row tb center-align bold">
        <div class="s-w126 s-title-margin rb s-line-height">一级菜单</div>
        <div class="s-w245 s-title-margin rb s-line-height">二级菜单</div>
        <div class="s-ml40 s-line-height">三级菜单</div>
      </div>
      <tree-table :checkList.sync="checkList"
                  :max="max"></tree-table>
    </page>

    <page-handle confirmText="保存"
                 @onConfirm="onConfirm" />
  </div>
</template>

<script>
import treeTable from './TreeTable'
import pageHandle from '@/components/PageHandle'
export default {
  name: 'shortcut',
  methods: {
    changeShowShortcut (val) {
      this.$api.updateShortcutStatus({ status: val }).then(res => {
        if (res.isError) return
        this.$store.dispatch('user/setUserConfig')
      })
    },
    onConfirm () {
      const params = {
        menuIds: this.checkList
      }
      this.$api.saveUserMenuSetting(params).then(res => {
        if (res.isError) return
        this.$message.success('保存成功')
        this.$store.dispatch('user/setUserConfig')
      })
    }
  },
  components: { treeTable, pageHandle },
  data () {
    return {
      checkList: [],
      max: 6,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    isShowShortcut () {
      return this.$store.state.user.isShowShortcut
    }
  }
}

</script>

<style lang='scss' scoped>
$headerHeight: 50px;
$marginLeft: 50px;

.s-title-margin {
  margin-left: $marginLeft;
}
.s-line-height {
  line-height: $headerHeight;
}
.s-w126 {
  width: 126px;
}
.s-w245 {
  width: 245px;
}
.s-ml40 {
  margin-left: 40px;
}
.shortcut-wrap {
  padding-bottom: 100px;
  overflow-y: scroll;
  height: 100%;
  box-sizing: border-box;
  position: relative;
}
.table-header {
  height: $headerHeight;
  background-color: #f9f9f9;
}
.current-value-text {
  font-weight: bold;
}
</style>
