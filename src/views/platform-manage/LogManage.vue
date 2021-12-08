<template>
  <page title="日志管理">
    <page-search class="mt16"
                 :formOptions="formOptions"
                 btnItems="inquire reset"
                 @onInquire="onInquire"
                 @onReset="onReset"></page-search>
    <!-- table -->
    <page-table :data="table.data"
                :col-configs="table.colConfig"
                :pageNumber.sync="search.pageNumber"
                :pageSize.sync="search.pageSize"
                :emptyText="emptyText()"
                :total="table.total"
                :isLoading="table.isLoading"
                @getTableData="getTableData">
    </page-table>
  </page>
</template>

<script>
import TableMixins from '@/mixins/table'
import PageTable from '@/components/PageTable'
import PageSearch from '@/components/PageSearch'
import { dateFormat } from '@u/formatter.js'

export default {
  name: 'FreezeUsers',
  methods: {
    // 查询
    onInquire (val) {
      this.search.pageNumber = 1
      this.getTableData()
    },
    // 重置
    onReset () {
      this.search = {
        pageNumber: 1,
        pageSize: 10
      }
      this.getTableData()
    },
    // 点击导出
    onExport () { },

    // 获取列表
    getTableData () {
      this.table.isLoading = true
      if (!this.$isEmpty(this.times)) {
        this.search.startTime = this.times[0]
        this.search.endTime = this.times[1] + 24 * 60 * 60 * 1000 - 1
      } else {
        delete this.search.startTime
        delete this.search.endTime
      }
      const params = {
        ...this.search
      }
      this.$api.userLogPage(params).then(res => {
        this.table.isLoading = false
        if (!res || res.isError) return
        this.table.data = res.content.items.map(item => {
          if (item && item.operationType && item.methodDesc) {
            item.handleResult = `${item.operationType || ''}【${item.methodDesc || ''}】`
          }
          return item
        })
        this.table.total = res?.content?.count ?? 0
      })
    },
    setTimes () {
      const nowTime = new Date().getTime()
      const sevenTimeBefore = nowTime - 86400 * 7 * 1000
      this.times = [sevenTimeBefore, nowTime]
      this.formOptions[2].value = this.times
    }
  },
  created () {
    this.setTimes()
    this.getTableData()
  },
  data () {
    const changeFunction = (val, key) => {
      if (key === 'time') {
        this.times = val
        return
      }
      this.search[key] = val
    }
    return {
      times: [],
      table: {
        colConfig: Object.freeze([
          {
            prop: 'id',
            label: '日志ID'
          },
          {
            prop: 'userName',
            label: '操作人姓名'
          },
          {
            prop: 'userAccount',
            label: '操作人账号/手机号'
          },
          {
            prop: 'controllerDesc',
            label: '操作模块'
          },
          {
            prop: 'operationType',
            label: '操作类型',
            width: 120
          },
          {
            prop: 'handleResult',
            label: '操作结果'
          },
          {
            prop: 'endTime',
            formatter: dateFormat,
            label: '操作完成时间',
            width: 180
          }
        ])
      },
      formOptions: [
        {
          label: '操作人手机号',
          placeholder: '请输手机号',
          prop: 'userPhone',
          element: 'el-input',
          events: {
            change (val) {
              changeFunction(val, 'userPhone')
            }
          },
          style: { width: '120px' }
        },
        {
          label: '操作人姓名',
          placeholder: '请输入姓名',
          prop: 'userName',
          element: 'el-input',
          events: {
            change (val) {
              changeFunction(val, 'userName')
            }
          },
          style: { width: '120px' }
        },
        {
          label: '日期',
          prop: 'time',
          element: 'el-date-picker',
          valueFormat: 'timestamp',
          value: [],
          type: 'daterange',
          clearable: true,
          events: {
            change (val) {
              changeFunction(val, 'time')
            }
          }
        }
      ]
    }
  },
  mixins: [TableMixins],
  components: {
    PageTable,
    PageSearch
  }
}
</script>

<style lang='scss' scoped>
.freeze-users-wrap {
}
</style>
