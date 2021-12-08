<template>
  <page title="组织类型详情"
        needPadding>
    <div class="info-wrap">
      <div class="info-title">基本信息</div>

      <div class="between-row mt24">
        <div class="color-999 row">
          <div class="i-block">类型名称：</div>
          <span class="color-333">{{info.name}}</span>
        </div>
        <div class="color-999 w240">
          类型属性：<span class="color-333">{{info.orgClassAttributeName}}</span>
        </div>
      </div>

      <div class="color-999 mt24"
           v-if="info.description">
        类型描述：<span class="color-333">{{info.description}}</span>
      </div>

      <div class="between-row mt24">
        <div class="color-999 row">
          <div class="w70 i-block">创建人：</div>
          <span class="color-333">{{info.creatorName}}</span>
        </div>
        <div class="color-999 w240">
          创建时间：<span class="color-333">{{$moment(info.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </div>
      </div>

      <div class="center-align mt40 between-row">
        <div class="info-title">相关组织</div>
        <el-input placeholder="请输入组织名称"
                  class="w240 ml24"
                  @clear="getTableData"
                  @keyup.enter.native="getTableData"
                  @blur="getTableData"
                  v-model="search.orgName">
          <i slot="suffix"
             class="el-input__icon el-icon-search pointer"
             @click="getTableData"></i>
        </el-input>
      </div>
      <page-table class="mt16"
                  :data="table.data"
                  :pageNumber.sync="search.pageNumber"
                  :pageSize.sync="search.pageSize"
                  :total="table.total"
                  :col-configs="table.colConfig"
                  :emptyText="emptyText()"
                  :isLoading="table.isLoading"
                  :layout="'total, prev, pager, next'"
                  @getTableData="getTableData">
      </page-table>
    </div>
    <page-handle :config="{backRouteName: 'OrgType', btns: [{ text: '返回', event: 'cancel' }]}"></page-handle>
  </page>
</template>

<script>
import pageTable from '@/components/PageTable'
import { timeFormat } from '@u/formatter.js'
import PageHandle from '@/components/PageHandle'
import TableMixin from '@/mixins/table.js'
export default {
  name: 'LabelOrTypeDetail',
  methods: {
    getTableData () {
      const params = {
        orgClassId: this.$route.query.id,
        ...this.search
      }
      this.$api.findOrgClassRelatedOrganizationsPage(params).then(res => {
        if (res.isError) return
        this.table.data = res.content.items
        this.table.total = res.content.count
      })
    },
    findOrgClassById () {
      const params = {
        id: this.$route.query.id
      }
      this.$api.findOrgClassById(params).then(res => {
        if (res.isError) return
        this.info = res.content
      })
    }
  },
  mixins: [TableMixin],
  components: { pageTable, PageHandle },
  data () {
    return {
      info: {},
      search: {
        orgName: ''
      },
      table: {
        colConfig: Object.freeze([
          {
            prop: 'orgName',
            label: '组织名称'
          },
          {
            prop: 'masterOrgName',
            label: '归属顶级组织'
          },
          {
            prop: 'createTime',
            label: '创建时间',
            formatter: timeFormat
          }
        ])
      }
    }
  },
  created () {
    this.findOrgClassById()
    this.getTableData()
  }
}
</script>

<style lang='scss' scoped>
.info-wrap {
  width: 738px;
  margin: 60px auto 0;
}
.w70 {
  width: 70px;
}
</style>
