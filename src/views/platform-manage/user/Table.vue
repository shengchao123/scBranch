<template>
  <page>
    <table-search @onNew="onForm('add')"
                  @onSearch="onSearch"
                  :config="tableSearchOptions"
                  :keyword.sync="search.keyword"
                  @onBatchDelete="onBatchDelete"></table-search>
    <page-table :data="table.data"
                :col-configs="table.colConfig"
                :pageNumber.sync="search.pageNumber"
                :cellClassName="cellClassName"
                :pageSize.sync="search.pageSize"
                :total="table.total"
                class="pb20"
                :emptyText="emptyText('用户')"
                :selection.sync="table.selection"
                :selectable="userSelectable"
                :isLoading="table.isLoading"
                :isShowIndex="false"
                :isShowCheckBox="true"
                @getTableData="getTableData">

      <el-table-column label="用户状态"
                       slot="userStatus"
                       width="100">
        <template slot-scope="scope">
          <span>{{userStatusText(scope.row.moduleStatus)}}</span>
        </template>
      </el-table-column>

      <el-table-column slot="operate"
                       label="操作"
                       width="265">
        <template slot-scope="scope">
          <el-popconfirm :title="`要${moduleStatusText(scope.row.moduleStatus)}该用户？`"
                         cancelButtonType="取消"
                         :confirmButtonText="moduleStatusText(scope.row.moduleStatus)"
                         hideIcon
                         v-if="$hasAuth($urls.updateUserStatus)"
                         @confirm="onModuleStatus(scope.row)">
            <span class="text-btn mr16"
                  slot="reference">{{moduleStatusText(scope.row.moduleStatus)}}</span>
          </el-popconfirm>
          <span class="text-btn mr16"
                v-if="$hasAuth($urls.updateUserInfo)"
                @click="onForm('edit',scope.row.id)">编辑</span>
          <el-popconfirm v-if="!scope.row.isAdmin && $hasAuth($urls.deleteUser)"
                         title="要删除该用户？"
                         cancelButtonType="取消"
                         confirmButtonText="删除"
                         hideIcon
                         @confirm="onDelete(scope.row.id)">
            <span class="text-btn mr16"
                  slot="reference">删除</span>
          </el-popconfirm>
          <span class="text-btn mr16"
                v-if="$hasAuth($urls.updateUserFilterOrg)"
                @click="onOrgControl(scope.row)">组织控制</span>
          <span class="text-btn"
                v-if="$hasAuth($urls.findUserInfoById)"
                @click="onDetail(scope.row.id)">详情</span>

        </template>
      </el-table-column>
    </page-table>

    <!-- 新增编辑 -->
    <info-form ref="infoForm"
               @reloadTableData="getTableData"></info-form>
    <!-- 详情 -->
    <el-dialog :title="detailDialog.title"
               width="456px"
               :modal-append-to-body="false"
               :close-on-press-escape="false"
               :visible.sync="detailDialog.show">
      <InfoLook :userInfo="userInfo"
                class="mt24 pb8"></InfoLook>
    </el-dialog>
    <!-- 组织控制 -->
    <el-dialog :title="orgLimitDialog.title"
               width="456px"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :close-on-press-escape="false"
               @close="onOrgClose"
               :visible.sync="orgLimitDialog.show">
      <organization-limit :userInfo="userInfo"
                          class="pt24 pb24"
                          ref="refOrganizationLimit"
                          @cancel="orgLimitDialog.show = false"></organization-limit>
    </el-dialog>
  </page>
</template>

<script>
import tableSearch from '../components/TableSearch'
import { timeFormat } from '@u/formatter.js'
import tableMixin from '@/mixins/table.js'
import OrgMixin from '../OrgMixin'
import InfoLook from './components/InfoLook'
import InfoForm from './components/InfoForm'
import OrganizationLimit from './components/OrganizationLimit'
import pageTable from '@/components/PageTable'
export default {
  name: 'Table',
  methods: {
    // 要禁用的多选框
    userSelectable (row, index) {
      return !row.isAdmin
    },
    // 搜索
    onSearch () {
      this.search.pageNumber = 1
      this.getTableData()
    },
    // 组织控制
    onOrgControl (row) {
      this.userInfo = row
      this.$nextTick(() => {
        this.$refs.refOrganizationLimit.findUserFilterOrg()
        this.$refs.refOrganizationLimit.findOrganizationFullTree()
      })
      this.orgLimitDialog.show = true
    },
    // 关闭组织控制弹窗
    onOrgClose () {
      this.$refs.refOrganizationLimit.onCancel()
    },
    onForm (type, userId) {
      this.$refs.infoForm.show(type, userId)
    },
    // 详情
    onDetail (id) {
      this.findUserInfoById(id)
      this.detailDialog.show = true
    },
    // 启用/停用
    onModuleStatus (row) {
      const params = {
        userId: row.id,
        status: row.moduleStatus === 1 ? 0 : 1
      }
      const message = row.moduleStatus === 1 ? '停用成功' : '启用成功'
      this.$api.updateUserStatus(params).then(res => {
        if (res.isError) {
          this.$message.error(res.message)
          return
        }
        this.$message.success(message)
        this.getTableData()
      })
    },
    // 删除操作
    onDelete (id) {
      this.deleteUser([id])
    },
    // 批量删除
    onBatchDelete () {
      if (this.$isEmpty(this.table.selection)) {
        this.$message.warning('请先选择要删除的用户')
        return
      }
      this.$confirm('', '要删除所选用户?', {
        confirmButtonText: '删除',
        customClass: 'custom-msg-box',
        cancelButtonClass: 'msg-box-cancel',
        confirmButtonClass: 'msg-box-confirm',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        center: true,
        showClose: false
      }).then(() => {
        this.deleteUser(this.table.selection)
      }).catch(() => { })
    },
    // 删除接口
    deleteUser (ids) {
      const params = {
        ids: ids
      }
      this.$api.deleteUser(params).then(res => {
        if (res.isError) {
          this.$message.error(res.message)
          return
        }
        this.$message.success('删除成功')
        this.getTableData()
      })
    },
    // 获取详情数据
    findUserInfoById (id) {
      const params = {
        userId: id
      }
      this.$api.findUserInfoById(params).then(res => {
        if (res.isError) return
        this.userInfo = res.content
      })
    },
    // 处理表格数据
    handleTableData (data) {
      data && data.items && data.items.forEach(item => {
        item.usernameOrPhone = item.phone ? item.phone : item.username
        item.roleName = item.roleDTOS && Array.from(item.roleDTOS, ({ name }) => name).join(' / ')
      })
      this.table.total = data.count
      this.table.data = data.items
    },
    // 获取列表数据
    getTableData () {
      if (!this.platformOrg || this.$isEmpty(this.platformOrg.id)) return
      this.table.isLoading = true
      const params = {
        ...this.search,
        orgId: this.platformOrg.id
      }
      this.$api.getUserPagingData(params).then(res => {
        this.table.isLoading = false
        if (res.isError) return
        this.handleTableData(res.content)
      })
    },
    // 表格中，状态不好的，红色特殊字显示
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      if (row.moduleStatus !== 1) {
        if (columnIndex === 7) {
          return 'error-color'
        } else {
          return 'color-999'
        }
      }
      return ''
    }
  },
  data () {
    return {
      userInfo: {},
      table: {
        selection: [],
        colConfig: Object.freeze([
          {
            prop: 'usernameOrPhone',
            minWidth: 160,
            label: '用户名/手机号'
          },
          {
            prop: 'name',
            width: 108,
            label: '用户姓名'
          },
          {
            prop: 'roleName',
            label: '用户角色',
            width: 194
          },
          {
            prop: 'orgName',
            label: '归属组织',
            width: 150
          },
          {
            prop: 'createName',
            label: '创建人',
            width: 116

          },
          {
            prop: 'createTime',
            label: '创建时间',
            width: 194,
            formatter: timeFormat
          },
          { slot: 'userStatus' },
          { slot: 'operate' }
        ])
      },
      // tableSearchOptions: {
      //   newBtnTitle: '新增用户',
      //   newAuth: this.$hasAuth(this.$urls.insertUser),
      //   delBtnTitle: '批量删除',
      //   delAuth: this.$hasAuth(this.$urls.deleteUser),
      //   keywordPlaceHolderText: '请输入用户名称'
      // },
      detailDialog: {
        title: '用户详情',
        show: false
      },
      orgLimitDialog: {
        show: false,
        title: '组织控制'
      }
    }
  },
  computed: {
    tableSearchOptions () {
      return {
        newBtnTitle: '新增用户',
        newAuth: this.$urls.insertUser,
        delBtnTitle: '批量删除',
        delAuth: this.$urls.deleteUser,
        keywordPlaceHolderText: '请输入用户名称'
      }
    },
    organizationTree () {
      return this.$store.state.app.orgs
    },
    userStatusText () {
      return (val) => {
        return val === 1 ? '已开启' : '已停用'
      }
    },
    moduleStatusText () {
      return (val) => {
        return val === 1 ? '停用' : '启用'
      }
    }
  },
  created () {
  },
  mixins: [tableMixin, OrgMixin],
  components: { tableSearch, pageTable, InfoLook, InfoForm, OrganizationLimit }
}
</script>

<style lang='scss' scoped>
</style>
