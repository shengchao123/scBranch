<template>
  <page title="组织类型管理">
    <table-search @onSearch="getTableData"
                  :config="tableSearchOption"
                  @onNew="onHandleBtn()">
    </table-search>
    <page-table :data="table.data"
                :col-configs="table.colConfig"
                :isLoading="table.isLoading"
                :pageNumber.sync="search.pageNumber"
                :pageSize.sync="search.pageSize"
                :total="table.total"
                :emptyText="emptyText('组织')"
                @getTableData="getTableData">
      <el-table-column slot="operate"
                       label="操作"
                       width="150">
        <template slot-scope="scope">
          <span class="text-btn mr16"
                v-if="$hasAuth($urls.updateOrgClass)"
                @click="onHandleBtn(scope.row, 'edit')">编辑</span>
          <el-popconfirm title="要删除该组织类型？"
                         cancelButtonType="取消"
                         confirmButtonText="删除"
                         hideIcon
                         @confirm="onConfirmDeleteOrg(scope.row.id)"
                         v-if="$hasAuth($urls.deleteOrgClass)">
            <span class="text-btn mr16"
                  slot="reference">删除</span>
          </el-popconfirm>
          <span class="text-btn"
                v-if="$hasAuth($urls.findOrganizationById)"
                @click="onDetail(scope.row.id)">详情</span>
        </template>

      </el-table-column>
    </page-table>

    <!-- 新增编辑 -->
    <el-dialog :title="dialog.title"
               width="456px"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="dialog.show">
      <el-form class="pt24 pb8 column center-align"
               ref="form"
               :rules="form.rules"
               :model="form.data"
               label-width="80px">
        <el-form-item label="类型名称"
                      prop="name">
          <el-input v-model="form.data.name"
                    class="w240"
                    maxlength="12"
                    show-word-limit
                    @change="getName"
                    placeholder="请输入类型名称"></el-input>
        </el-form-item>
        <el-form-item label="类型属性"
                      prop="orgClassAttribute">
          <el-select v-model="form.data.orgClassAttribute"
                     filterable
                     class="w240"
                     placeholder="请选择类型属性">
            <el-option v-for="(item, index) in form.typeSelect"
                       :key="index"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型描述">
          <el-input type="textarea"
                    class="w240"
                    maxlength="50"
                    show-word-limit
                    placeholder="输入备注文字，不超过50个字"
                    v-model="form.data.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary"
                   @click="onConfirmCreateOrgType">{{dialog.confirm}}</el-button>
        <el-button @click="cancelButton"
                   class="plain-btn">取消</el-button>
      </div>
    </el-dialog>

  </page>
</template>

<script>
import TableSearch from '@v/platform-manage/components/TableSearch'
import { timeFormat } from '@u/formatter.js'
import OrgMixin from '../../OrgMixin'
import tableMixin from '@/mixins/table.js'
import pageTable from '@/components/PageTable'
export default {
  name: 'Table',
  methods: {
    onHandleBtn (row, type) {
      this.handleType = type
      let dialogTitle = '新增组织类型'
      let dialogConfrim = '确定'
      if (type) {
        dialogTitle = '编辑组织类型'
        dialogConfrim = '保存'
        const { id, name, orgClassAttribute, description } = row
        this.form.data = {
          id,
          name,
          orgClassAttribute,
          description
        }
      } else {
        this.form.data = {
          orgClassAttribute: '01'
        }
      }
      if (this.$refs.form) {
        this.$refs.form.resetFields() // 重置表单
      }
      this.dialog = {
        title: dialogTitle,
        show: true,
        confirm: dialogConfrim
      }
    },
    cancelButton () { // 取消按钮
      this.dialog.show = false
      this.$refs.form.resetFields()
    },
    onDetail (id) {
      this.$router.push({
        name: 'TypeDetail',
        query: {
          id
        }
      })
    },
    // 创建组织类型
    onConfirmCreateOrgType (id) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.handleType) {
            this.reqUpdateOrgClass()
            return
          }
          this.reqInsertOrgClassReq()
        }
      })
    },

    // 删除组织
    onConfirmDeleteOrg (id) {
      const params = {
        id
      }
      this.reqDeleteOrgClass(params)
    },

    reqDeleteOrgClass (params) {
      this.$api.deleteOrgClass(params).then(res => {
        if (res.isError) return this.$message.error(res.message)
        this.$message.success('删除成功')
        this.getTableData()
      })
    },

    reqUpdateOrgClass () {
      const params = this.form.data
      this.$api.updateOrgClass(params).then(res => {
        if (res.subCode === 'NAME_EXISTS') return this.repeatValidate()
        if (res.isError) return this.$message.error(res.message)
        this.dialog.show = false
        this.$message.success('编辑成功')
        this.getTableData()
        this.$refs.form.resetFields()
      })
    },

    reqInsertOrgClassReq () {
      const params = this.form.data
      this.$api.insertOrgClassReq(params).then(res => {
        if (res.subCode === 'NAME_EXISTS') return this.repeatValidate()
        if (res.isError) return this.$message.error(res.message)
        this.dialog.show = false
        this.$message.success('新增成功')
        this.getTableData()
        this.$refs.form.resetFields()
      })
    },

    getTableData () {
      this.table.isLoading = true
      const params = { ...this.search }
      this.$api.findOrgClassList(params).then(res => {
        if (res.isError) return this.$message.error(res.message)
        this.table.isLoading = false
        this.table.data = res.content
      })
    },
    getName () { // 清除校验提示
      this.repeatValue = false
      this.$refs.form.clearValidate('name')
    },
    repeatValidate () { // 再次手动校验表单
      this.repeatValue = true
      this.$refs.form.validate(() => { })
    }
  },
  created () {
    this.getTableData()
  },
  data () {
    const repeatVlaue = (rule, value, callback) => {
      if (this.repeatValue) return callback(new Error('标签名称已存在'))
      callback()
    }
    return {
      handleType: '', // 操作类型
      search: {
        keyword: ''
      },
      dialog: {
        title: '',
        show: false,
        confirm: ''
      },
      form: {
        rules: Object.freeze({
          name: [
            { required: true, message: '请输入类型名称', trigger: 'blur' },
            { validator: repeatVlaue }
          ],
          orgClassAttribute: [
            { required: true, message: '请选择类型属性', trigger: 'change' }
          ]
        }),
        typeSelect: Object.freeze([
          {
            id: '01',
            name: '实体'
          },
          {
            id: '02',
            name: '非实体'
          }
        ]),
        data: {
          name: '',
          description: '',
          orgClassAttribute: '01'
        }
      },
      table: {
        colConfig: Object.freeze([
          {
            prop: 'name',
            label: '组织类型名称'
          },
          {
            prop: 'orgClassAttributeName',
            label: '类型属性'
          },
          {
            prop: 'creatorName',
            label: '创建人'
          },
          {
            prop: 'createTime',
            label: '创建时间',
            formatter: timeFormat
          },
          {
            slot: 'operate'
          }
        ])
      },
      tableSearchOption: {
        newBtnTitle: '新增组织类型',
        newAuth: this.$urls.insertOrgClassReq
      },
      repeatValue: false // 类型名称是否重复
    }
  },
  components: { TableSearch, pageTable },
  mixins: [tableMixin, OrgMixin]
}
</script>

<style lang='scss' scoped>
/deep/ .el-textarea {
  .el-input__count {
    line-height: 20px;
    height: 20px;
  }
  textarea {
    min-height: 102px !important;
  }
}
</style>
