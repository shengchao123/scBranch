<template>
  <page title="冻结用户管理">
    <!-- table -->
    <page-table :data="table.data"
                class="mt16"
                :col-configs="table.colConfig"
                :pageNumber.sync="search.pageNumber"
                :pageSize.sync="search.pageSize"
                :total="table.total"
                :emptyText="emptyText()"
                :isLoading="table.isLoading"
                @getTableData="getTableData">
      <el-table-column slot="operate"
                       label="操作"
                       width="136">
        <template slot-scope="scope">
          <el-popconfirm title="要解冻该用户？"
                         cancelButtonType="取消"
                         confirmButtonText="解冻"
                         hideIcon
                         @confirm="onConfirmUnFreeze(scope.row)"
                         v-if="$hasAuth($urls.unfreezeUser)">
            <span class="text-btn mr16"
                  slot="reference">解冻</span>
          </el-popconfirm>

          <span class="text-btn"
                v-if="$hasAuth($urls.findUserHistoryFrozenRecordByPage)"
                @click="onFreezeHistory(scope.row)">历史冻结</span>
        </template>
      </el-table-column>
    </page-table>

    <el-dialog width="696px"
               title="历史冻结记录"
               :visible.sync="showDialog">
      <div class="freeze-list">
        <div class="flex mb16">
          <div class="color-999 mr28">用户名/手机号：<span class="color-15">{{userData.nameAndPhone}}</span></div>
          <div class="color-999">用户姓名：<span class="color-15">{{userData.username}}</span> </div>
        </div>
        <page-table :data="freezeTable.data"
                    :col-configs="freezeTable.configs"
                    :pageNumber.sync="freezeSearch.pageNumber"
                    :pageSize.sync="freezeSearch.pageSize"
                    :total="freezeTable.total"
                    :emptyText="emptyText()"
                    :isLoading="freezeTable.isLoading"
                    @getTableData="requestDialogData">
        </page-table>
      </div>
    </el-dialog>
  </page>
</template>

<script>
import TableMixins from '@/mixins/table'
import PageTable from '@/components/PageTable'
import { timeFormat } from '@u/formatter.js'

export default {
  name: 'FreezeUsers',
  methods: {
    // 确定解冻用户
    onConfirmUnFreeze (row) {
      const params = {
        userFrozenRecordId: row.id
      }
      this.$api.unfreezeUser(params).then(res => {
        if (res.isError) {
          this.$message.error(res.message)
          return
        }
        this.$message.success('用户解冻成功')
        this.getTableData()
      })
    },
    onFreezeHistory (row) {
      this.userData = row
      this.showDialog = true
      this.requestDialogData()
    },
    // 获取列表
    getTableData () {
      this.table.isLoading = true
      const params = {
        ...this.search
      }
      this.$api.findUserFrozenRecordByPage(params).then(res => {
        this.table.isLoading = false
        if (!res || res.isError) return
        this.dealListData('table', res)
      })
    },
    // 获取历史
    requestDialogData (row) {
      this.isLoading = true
      const params = {
        ...this.freezeSearch,
        userId: this.userData.userId
      }
      this.$api.findUserHistoryFrozenRecordByPage(params).then(res => {
        this.isLoading = false
        if (res.isError) return this.$message.error(res.message)
        this.dealListData('freezeTable', res)
      })
    },
    dealListData (table, res) { // 处理列表数据
      this[table].data = res?.content?.items.map(item => {
        item.nameAndPhone = item.name ? item.name + ' / ' + item.phone : item.phone
        return item
      })
      this[table].total = res?.content?.count ?? 0
    }
  },
  created () {
    this.getTableData()
  },
  data () {
    return {
      showDialog: false,
      userData: {},
      table: {
        colConfig: Object.freeze([
          {
            prop: 'nameAndPhone',
            label: '用户名/手机号'
          },
          {
            prop: 'username',
            label: '用户姓名'
          },
          {
            prop: 'source',
            label: '冻结入口'
          },
          {
            prop: 'frozenTime',
            label: '上次冻结时间',
            formatter: timeFormat
          },
          {
            slot: 'operate'
          }
        ])
      },
      freezeTable: {
        isLoading: false,
        total: 0,
        data: [],
        configs: Object.freeze([
          {
            prop: 'source',
            label: '冻结入口'
          },
          {
            prop: 'frozenTime',
            label: '冻结时间',
            formatter: timeFormat
          }
        ])
      },
      freezeSearch: {
        pageNumber: 1,
        pageSize: 8
      }
    }
  },
  mixins: [TableMixins],
  components: {
    PageTable
  }
}
</script>

<style lang='scss' scoped>
.freeze-list {
  padding: 24px;
}
.color-15 {
  color: #151515;
}
</style>
