<template>
  <div>
    <el-table :data="data"
              :show-header="showHeader"
              :border="border"
              :max-height="maxHeight"
              v-loading="isLoading"
              :class="className"
              :cell-class-name="cellClassName"
              tooltip-effect="light"
              element-loading-text="数据加载中"
              stripe
              fit
              :summary-method="getSummaries"
              :show-summary="showSummary"
              :default-sort="defaultSort"
              :highlight-current-row="false"
              style="min-width: 100%"
              @select="select"
              @select-all="selectAll"
              @row-contextmenu="testrightClick"
              @row-dblclick="rowdblclick"
              @selection-change="changeSelection"
              @cell-click="cellClick"
              @sort-change="sortChange"
              :height="rowHeight"
              class="color-333">
      <template slot="empty">
        <span>{{emptyText}}</span>
        <!-- <img :src="empty"
             alt
             style="width:200px;margin-top:80px" /> -->
      </template>

      <el-table-column label="全选"
                       :width="width"
                       type="selection"
                       v-model="data"
                       :selectable='selectable'
                       :align="align"
                       fixed="left"
                       v-if="isShowCheckBox"></el-table-column>
      <el-table-column :label="indexName"
                       type="index"
                       width="80"
                       class-name="index_class"
                       v-if="isShowIndex"
                       :align="align"
                       fixed="left"></el-table-column>

      <template v-for="(colConfig, index) in colConfigs">
        <!-- slot 添加自定义配置项 -->
        <slot v-if="colConfig.slot"
              :name="colConfig.slot"></slot>
        <!-- component 特殊处理某一项 -->
        <component :key="index"
                   v-else-if="colConfig.component"
                   :is="config.component"
                   :col-config="colConfig">
        </component>
        <el-table-column :key="index"
                         v-else
                         v-bind="colConfig"
                         :align="colConfig.align"
                         :width="colConfig.width"
                         :show-overflow-tooltip="colConfig.showTip !== undefined ? colConfig.showTip: true"
                         :min-width="colConfig.minWidth">
          <template slot-scope="scope">
            <span v-if="colConfig.formatter">{{colConfig.formatter(scope.row, scope.column)}}</span>
            <span v-else-if="colConfig.money">￥{{scope.row[colConfig.prop]}}</span>
            <span v-else>{{scope.row[colConfig.prop] | fillNull(colConfig.prop)}}</span>
          </template>
        </el-table-column>
      </template>

    </el-table>
    <!-- 分页 -->
    <el-pagination v-if="(total && total > 0) || showPagination"
                   class="mt12 tr"
                   :page-sizes="pageSizes"
                   :current-page.sync="currentPage"
                   :page-size.sync="sizeLimit"
                   @size-change="changeSize"
                   @current-change="changeCurrentPage"
                   :total="total"
                   :layout="layout"
                   @prev-click="prevClick"
                   @next-click="nextClick">
    </el-pagination>
  </div>
</template>
<script>

export default {
  name: 'PageTable',
  props: {
    showPagination: {
      type: Boolean,
      default: false
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40, 50]
    },
    // 排序
    defaultSort: {
      type: Object,
      default: () => { }
    },
    // 布局
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    // 表头
    colConfigs: {
      type: Array,
      default: () => []
    },
    // 表格数据
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 是否显示表头
    showHeader: {
      type: Boolean,
      default: true
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    // 固定表头的表格
    rowHeight: {
      type: String,
      default: null
    },
    // 是否带有纵向边框
    border: {
      type: Boolean,
      default: false
    },
    // 流体高度 超过该高度就自动有滚动条
    maxHeight: {
      type: [String, Number],
      default: 'auto'
    },
    // loading效果
    isLoading: {
      type: Boolean,
      default: false
    },
    // 表格类名
    className: {
      type: String,
      default: ''
    },
    // 列表是否可选择
    isShowCheckBox: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 80
    },
    // 是否需要禁用多选框
    selectable: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Function
    },
    align: {
      type: String,
      default: 'left'
    },
    // 列表是否显示序号
    isShowIndex: {
      type: Boolean,
      default: false
    },
    // 是否需要右键
    isrightEvent: {
      type: Boolean,
      default: false
    },
    // 是否需要双击
    isrowdblEvent: {
      type: Boolean,
      default: false
    },
    // 是否需要点击单元格
    iscellClick: {
      type: Boolean,
      default: false
    },
    // 是否需要点击单元格
    cellClassName: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Function
    },
    // 当前页
    pageNumber: {
      type: Number,
      default: 1
    },
    // 总页数
    pageSize: {
      type: Number,
      default: 1
    },
    // 总条数
    total: {
      type: Number,
      default: 0
    },
    // 当前页数量
    pagerCount: {
      type: Number,
      default: 7
    },
    // 指定显示列总计 从0开始
    sumsDisplay: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 排序列名称显示
    indexName: {
      type: String,
      default: '序号'
    },
    // 暂无数据文本
    emptyText: {
      type: String,
      default: '暂无相关信息'
    },
    // 合计行配置
    summaryConfig: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      //   empty: require('../../assets/images/zanwushuju.png')
      empty: '暂无相关信息'
    }
  },
  methods: {
    // 自定义统计列
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.summaryConfig.title || '总计'
          return
        }
        if (this.sumsDisplay.length > 0) {
          // this.sumsDisplay 传值时候判断处理
          if (this.sumsDisplay.includes(index)) {
            const values = data.map(item => {
              return Number(item[column.property])
            })
            if (!values.every(value => isNaN(value))) {
              let temResult = 0
              temResult = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
              sums[index] = temResult.toFixed(2) + this.summaryConfig.units.get(index)
            } else {
              sums[index] = '--'
            }
          } else {
            sums[index] = '--'
          }
        } else {
          // this.sumsDisplay 未传值时候判断处理
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            let temResult = 0
            temResult = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = temResult.toFixed(2) + this.summaryConfig.units.get(index)
          } else {
            sums[index] = '--'
          }
        }
      })
      return sums
    },
    testrightClick (row, column, event) {
      const that = this
      if (that.isrightEvent) {
        event.cancelBubble = true
        const params = {
          row: row,
          column: column,
          event: event
        }
        that.$emit('rightEvent', params)
      }
    },
    rowdblclick (row, column, event) {
      this.$emit('rowdblEvent', row, column, event)
    },
    select (selection, row) {
      this.$emit('select', selection)
    },
    selectAll (selection) {
      this.$emit('selectAll', selection)
    },
    changeSelection (val) {
      this.$emit('update:selection', val.map(item => item.id))
    },
    cellClick (row, column, cell, event) {
      this.$emit('cellClick', row, column, cell)
    },
    sortChange (data) {
      this.$emit('sortChange', data)
    },
    prevClick (val) {
      this.$emit('prevClick', val)
    },
    nextClick (val) {
      this.$emit('nextClick', val)
    },
    changeSize (val) {
      this.$emit('getTableData')
    },
    changeCurrentPage (val) {
      this.$emit('getTableData')
    }
  },
  computed: {
    currentPage: {
      get () {
        return this.pageNumber
      },
      set (val) {
        this.$emit('update:pageNumber', val)
      }
    },
    sizeLimit: {
      get () {
        return this.pageSize
      },
      set (val) {
        this.$emit('update:pageSize', val)
      }
    }
  },
  filters: {
    fillNull (value) {
      if (!value || value === '' || value === 'undefined' || value === null) {
        return '--'
      } else {
        return value
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
