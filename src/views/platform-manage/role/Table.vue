
<template>
  <page>
    <table-search :config="tableSearchConfig"
                  :keyword.sync="search.keyword"
                  @onNew="goDetails()"
                  @onBatchDelete="onBatchDelete()"
                  @onSearch="onSearch">
    </table-search>
    <page-table :data="table.data"
                :col-configs="table.colConfig"
                :pageNumber.sync="search.pageNumber"
                :pageSize.sync="search.pageSize"
                :cellClassName="cellClassName"
                :total="table.total"
                class="pb20"
                :selection.sync="table.selection"
                :isLoading="table.isLoading"
                :isShowIndex="false"
                :isShowCheckBox="true"
                @getTableData="getTableData">

      <el-table-column label="角色状态"
                       slot="roleStatus"
                       width="80">
        <template slot-scope="scope">
          <span>{{scope.row.status === 1 ? '已开启' : '已停用'}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="typeName"
                       slot="typeName"
                       width="100">
        <template slot="header">
          <span style="margin-right:5px">角色属性</span>
          <el-popover placement="top"
                      width="300"
                      trigger="hover">
            <div class="color-333">
              <p>角色属性分为：公有和私有</p>
              <p>公有：该角色归属组织及其下级组织能共同使用</p>
              <p>私有：该角色仅在归属组织中使用</p>
            </div>
            <div slot="reference"
                 style="display: inline-block">
              <svg-icon icon="icon_tishi"
                        class="color-999"></svg-icon>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column slot="operate"
                       label="操作"
                       width="266">
        <template slot-scope="scope">
          <span class="text-btn mr16"
                v-if="$hasAuth($urls.copyRole)"
                @click="goDetails(scope.row, 'copy')">复制</span>
          <el-popconfirm v-if="$hasAuth($urls.enableRole) || $hasAuth($urls.disableRole)"
                         :title="`要${statusText(scope.row)}该角色？`"
                         cancelButtonType="取消"
                         :confirmButtonText="statusText(scope.row)"
                         hideIcon
                         @confirm="onConfirmChangeStatus(scope.row)">
            <span class="text-btn mr16"
                  slot="reference">{{statusText(scope.row)}}</span>
          </el-popconfirm>

          <span class="text-btn mr16"
                v-if="$hasAuth($urls.updateRole)"
                @click="goDetails(scope.row, 'edit')">编辑</span>
          <el-popconfirm v-if="$hasAuth($urls.deleteRoleById)"
                         title="要删除该用户角色？"
                         cancelButtonType="取消"
                         confirmButtonText="删除"
                         hideIcon
                         @confirm="onConfirmDelete(scope.row.id)">
            <span class="text-btn mr16"
                  slot="reference">删除</span>
          </el-popconfirm>
          <router-link :to="{name: 'RoleLimit', query: {roleId: scope.row.id, platformOrgId: platformOrg.id}}">
            <span class="text-btn"
                  v-if="$hasAuth($urls.setRoleDetails)">{{scope.row.isHasAuth ?  '修改权限': '权限设置'}}</span>
          </router-link>
        </template>
      </el-table-column>
    </page-table>

    <el-dialog :title="dialogTitle"
               width="456px"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="dialog.show">
      <div style="padding: 24px 68px 0">
        <el-form ref="form"
                 :model="form.data"
                 :rules="form.rules"
                 label-width="78px"
                 label-position="left">
          <el-form-item label="归属组织"
                        prop="orgId">
            <el-cascader v-model="form.data.orgId"
                         class="w240"
                         :options="organizationTree"
                         :props="cascaderProps"></el-cascader>
          </el-form-item>
          <el-form-item label="角色属性"
                        prop="attribute">
            <el-select v-model="form.data.attribute"
                       class="w240"
                       placeholder="请选择">
              <el-option v-for="item in table.roleAttribute"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色名称"
                        prop="name">
            <el-input v-model="form.data.name"
                      class="w240"
                      @change="changeFormDataName"
                      placeholder="请输入角色名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="mt8">
        <el-button type="primary"
                   @click="onConfirmAddRole()">{{this.handleRoleType === 'edit' ? '保存' : '确定'}}</el-button>
        <el-button class="secondary-btn"
                   v-show="!handleRoleType"
                   @click="onSaveAndContinue()">确定并继续</el-button>
        <el-button @click="dialog.show = false">取消</el-button>
      </div>
    </el-dialog>
  </page>
</template>

<script>
// eslint-disable
import TableSearch from '../components/TableSearch'
import { timeFormat } from '@u/formatter.js'
import tableMixin from '@/mixins/table.js'
import OrgMixin from '../OrgMixin'
import pageTable from '@/components/PageTable'
export default {
  name: 'Table',
  methods: {
    onSearch () {
      this.search.pageNumber = 1
      this.getTableData()
    },
    changeFormDataName () {
      this.roleNameRepeat = false
      this.checkRoleName()
    },
    goDetails (val = {}, viewType) {
      const { attribute, orgId, name, type, id } = val
      const dataMap = new Map([
        ['edit', { attribute, orgId, name, type, id }],
        ['copy', { attribute, orgId, sourceId: id }]
      ])
      const haveData = dataMap.get(viewType) || {}
      this.form.data = haveData
      if (this.$isEmpty(haveData)) {
        this.form.data.orgId = this.platformOrg.id
      }
      this.handleRoleType = viewType
      this.dialog.show = true
    },
    onBatchDelete () {
      if (this.$isEmpty(this.table.selection)) {
        this.$message.warning('请先选择要删除的用户角色')
        return
      }
      this.$confirm('', '要删除所选用户角色 ?', {
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
        this.deleteRoleByIds()
      }).catch(() => { })
    },
    onConfirmChangeStatus (row) {
      const params = {
        id: row.id
      }
      if (row.status === 1) {
        this.$api.disableRole(params).then(res => {
          if (res.isError) return this.$message.error(res.message)
          this.$message.success('停用成功')
          this.getTableData()
        })
      } else {
        this.$api.enableRole(params).then(res => {
          if (res.isError) return this.$message.error(res.message)
          this.resetTableData('启用成功')
        })
      }
    },
    deleteRoleByIds () {
      const params = {
        ids: this.table.selection
      }
      this.$api.deleteRoleByIds(params).then(res => {
        if (res.subCode === 'ROLE_USED') return this.roleNameRepeatMessage()
        if (res.isError) return this.$message.error(res.message)
        this.$message.success('删除成功')
        this.getTableData()
      })
    },
    onConfirmDelete (roleId) {
      const params = {
        id: roleId
      }
      this.$api.deleteRoleById(params).then(res => {
        if (res.subCode === 'ROLE_USED') return this.roleNameRepeatMessage()
        if (res.isError) return this.$message.error(res.message)
        this.resetTableData('角色删除成功')
      })
    },
    roleNameRepeatMessage () {
      this.$confirm('', '该角色已有关联用户，不可删除', {
        customClass: 'custom-msg-box',
        cancelButtonText: '我知道了',
        showConfirmButton: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning',
        center: true,
        showClose: false
      }).then(() => {
      }).catch(() => { })
    },
    onConfirmAddRole () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          switch (this.handleRoleType) {
            case 'copy':
              this.requestCopyRole()
              break
            case 'edit':
              this.requestUpdateRole()
              break
            default:
              this.reqinsertGeneralRole()
          }
        }
      })
    },
    onSaveAndContinue () {
      const isContinue = true
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.reqinsertGeneralRole(isContinue)
        }
      })
    },
    checkRoleName (callback) {
      this.$api.checkRoleName({ name: this.form.data.name }).then(res => {
        if (res.isError && res.subCode === 'NAME_EXISTS') {
          this.roleNameRepeat = true
          this.$refs.form.validateField('name')
          return
        }
        callback && callback()
      })
    },
    reqinsertGeneralRole (isContinue) {
      const params = JSON.parse(JSON.stringify(this.form.data))
      this.checkRoleName(() => {
        this.$api.insertGeneralRole(params).then(res => {
          if (res.isError) return this.$message.error(res.message)
          this.resetTableData('角色添加成功', isContinue)
          if (isContinue) {
            this.form.data = {}
          }
        })
      })
    },
    requestUpdateRole () {
      const params = JSON.parse(JSON.stringify(this.form.data))
      this.$api.updateRole(params).then(res => {
        if (res.isError) return this.$message.error(res.message)
        this.resetTableData('保存成功')
      })
    },
    requestCopyRole () {
      const params = JSON.parse(JSON.stringify(this.form.data))
      this.$api.copyRole(params).then(res => {
        if (res.isError) return this.$message.error(res.message)
        this.resetTableData('保存成功')
      })
    },
    getTableData () {
      if (!this.platformOrg || this.$isEmpty(this.platformOrg.id)) return
      this.table.isLoading = true
      const params = {
        ...this.search,
        orgId: this.platformOrg.id
      }
      this.$api.rolePage(params).then(res => {
        this.table.isLoading = false
        if (res.isError) return
        this.table.total = res.content.count
        this.table.data = res.content.items.map(item => {
          if (this.table.roleAttribute) {
            const temRole = this.table.roleAttribute.filter(item2 => {
              return item2.id === item.attribute
            })
            item.typeName = temRole[0].name
          }
          return item
        })
      })
    },
    // 表格中，状态不好的，红色特殊字显示
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      if (row.status === -1) {
        if (columnIndex === 6) {
          return 'error-color'
        } else {
          return 'color-999'
        }
      }
      return ''
    },
    resetTableData (message, show = false) {
      this.$message.success(message)
      this.getTableData()
      this.dialog.show = show
    }
  },
  data () {
    const validatorOrgId = (rule, value, callback) => {
      if (this.$isEmpty(this.form.data.orgId)) return callback(new Error('请选择归属组织'))
      return callback()
    }
    const validatorName = (rule, value, callback) => {
      if (this.$isEmpty(value)) return callback(new Error('请输入角色名称'))
      if (this.roleNameRepeat) return callback(new Error('角色名称已存在'))
      return callback()
    }
    return {
      handleRoleType: 'add',
      roleNameRepeat: false,
      form: {
        data: {
        },
        rules: {
          orgId: [
            { required: true, validator: validatorOrgId, trigger: 'blur' }
          ],
          attribute: [
            { required: true, message: '请选择角色属性', trigger: 'blur' }
          ],
          name: [
            { required: true, validator: validatorName, trigger: 'blur' }
          ]
        }
      },
      dialog: {
        title: '新增标题',
        show: false
      },
      table: {
        selection: [],
        roleAttribute: [
          {
            name: '私有',
            id: '01'
          },
          {
            name: '公有',
            id: '02'
          }
        ],
        colConfig: Object.freeze([
          {
            prop: 'name',
            label: '角色名称'
          },
          { slot: 'typeName' },
          {
            prop: 'orgName',
            label: '归属组织'
          },
          {
            prop: 'creatorName',
            label: '创建人'
          },
          // {
          //   prop: 'orgClassName',
          //   label: '组织类型',
          //   width: 100
          // },
          {
            prop: 'createTime',
            label: '创建时间',
            width: 180,
            formatter: timeFormat
          },
          { slot: 'roleStatus' },
          { slot: 'operate' }
        ])
      },
      cascaderProps: {
        value: 'id',
        children: 'child',
        label: 'name',
        emitPath: false,
        checkStrictly: true
      }

    }
  },
  computed: {
    tableSearchConfig () {
      return {
        newBtnTitle: '新增角色',
        newAuth: this.$urls.insertGeneralRole,
        delBtnTitle: '批量删除',
        delAuth: this.$urls.deleteRoleByIds,
        keywordPlaceHolderText: '请输入角色名称'
      }
    },
    dialogTitle () {
      if (this.handleRoleType === 'edit') return '编辑角色'
      if (this.handleRoleType === 'copy') return '复制角色'
      return '新增角色'
    },
    statusText () {
      return (row) => {
        return row.status === 1 ? '停用' : '启用'
      }
    },
    organizationTree () {
      return this.$store.state.app.orgs
    },
    platformOrg () {
      return this.$store.state.platform.platformOrg
    }
  },
  watch: {
    'dialog.show' () {
      this.$refs.form && this.$refs.form.clearValidate()
    }
  },
  mixins: [tableMixin, OrgMixin],

  components: { TableSearch, pageTable }
}
</script>

<style lang='scss' scoped>
.w118 {
  width: 118px;
}
</style>
