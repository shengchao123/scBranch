<template>
  <page>
    <table-search @onNew="goDetail"
                  @onSearch="onSearch"
                  :config="tableSearchOptions"
                  :keyword.sync="search.keyword"
                  @onBatchDelete="onBatchDelete"></table-search>

    <page-table :data="table.data"
                class="pb20"
                :col-configs="table.colConfig"
                :pageNumber.sync="search.pageNumber"
                :cellClassName="cellClassName"
                :pageSize.sync="search.pageSize"
                :total="table.total"
                :emptyText="emptyText('组织')"
                :selection.sync="table.selection"
                :isLoading="table.isLoading"
                :isShowIndex="false"
                :isShowCheckBox="true"
                @getTableData="getTableData">
      <el-table-column slot="operate"
                       label="操作"
                       width="150">
        <template slot-scope="scope">
          <span class="text-btn mr16"
                v-if="$hasAuth($urls.findOrganizationById)"
                @click="goDetail(scope.row.id, 'look')">详情</span>
          <span class="text-btn mr16"
                v-if="$hasAuth($urls.updateOrganization)"
                @click="goDetail(scope.row.id, 'edit')">编辑</span>

          <el-popconfirm title="要删除该组织？"
                         cancelButtonType="取消"
                         confirmButtonText="删除"
                         hideIcon
                         @confirm="onConfirmDeleteOrg(scope.row.id)">
            <span class="text-btn"
                  slot="reference"
                  v-if="$hasAuth($urls.deleteOrganization)">删除</span>
          </el-popconfirm>
        </template>
      </el-table-column>
    </page-table>
  </page>
</template>

<script>
import tableSearch from '../../components/TableSearch'
import tableMixin from '@/mixins/table.js'
import OrgMixin from '../../OrgMixin'
import { timeFormat } from '@u/formatter.js'
import pageTable from '@/components/PageTable'

export default {
  name: 'Table',
  methods: {
    onSearch () {
      this.search.pageNumber = 1
      this.getTableData()
    },
    // 跳转详情
    goDetail (id, type) {
      const route = {
        name: 'OrganizationInfo',
        query: {
          orgId: id,
          type: type
        }
      }
      if (!type) delete route.query
      this.$router.push(route)
    },

    // 删除组织
    onConfirmDeleteOrg (id) {
      const params = {
        orgId: id
      }
      this.$api.deleteOrganization(params).then(res => {
        if (res.isError) {
          this.showDelOrgError(res.message)
          return
        }
        this.$store.dispatch('app/setOrgs')
        this.$store.dispatch('platform/setPlatformTree')
        this.$message.success('删除成功')
        this.getTableData()
      })
    },

    getTableData () {
      if (!this.platformOrg || this.$isEmpty(this.platformOrg.id)) return
      this.table.isLoading = true
      const params = {
        ...this.search,
        orgId: this.platformOrg.id
      }
      this.$api.findOrganizationPage(params).then(res => {
        this.table.isLoading = false
        if (res.isError) return
        this.table.total = res.content.count
        this.table.data = res.content.items
      })
    },
    // 批量删除组织
    onBatchDelete () {
      if (this.$isEmpty(this.table.selection)) {
        this.$message.warning('请先选择要删除的组织')
        return
      }
      this.$confirm('', '要删除所选组织？', {
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
        this.reqDelOrgs()
      }).catch(() => { })
    },
    // 删除组织
    reqDelOrgs () {
      const params = {
        id: this.table.selection
      }
      this.$api.batchDeleteOrganization(params).then(res => {
        if (res.isError) {
          this.showDelOrgError(res.message)
          return
        }
        this.$store.dispatch('app/setOrgs')
        this.$message.success('删除成功')
        this.getTableData()
      })
    },
    showDelOrgError (msg) {
      this.$confirm('', msg, {
        confirmButtonText: '我知道了',
        customClass: 'custom-msg-box',
        cancelButtonClass: 'msg-box-cancel',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning',
        center: true,
        showClose: false,
        showCancelButton: false
      }).then(() => {
      }).catch(() => { })
    },
    // 表格中，状态不好的，红色特殊字显示
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      if (row.moduleStatus === 0 || row.status === -1) {
        if (columnIndex === 5) {
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
      table: {
        selection: [],
        colConfig: Object.freeze([
          {
            prop: 'name',
            label: '组织名称'
          },
          {
            prop: 'parentOrgName',
            label: '归属组织'
          },
          {
            prop: 'creatorName',
            label: '创建人'
          },
          {
            prop: 'orgClassName',
            label: '组织类型',
            width: 140
          },
          {
            prop: 'createTime',
            label: '创建时间',
            width: 180,
            formatter: timeFormat
          },
          {
            slot: 'operate'
          }
        ])
      },
      tableSearchOptions: {
        newBtnTitle: '新增组织',
        newAuth: this.$urls.insertOrganization,
        delBtnTitle: '批量删除',
        delAuth: this.$urls.batchDeleteOrganization,
        keywordPlaceHolderText: '请输入组织名称'
      }
    }
  },

  components: { tableSearch, pageTable },
  mixins: [tableMixin, OrgMixin]
}
</script>

<style lang='scss' scoped>
.org-table-wrap {
}
</style>
