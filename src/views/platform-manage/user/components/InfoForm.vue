<template>
  <el-dialog :title="dialog.title"
             width="456px"
             :close-on-click-modal="false"
             :modal-append-to-body="false"
             @close="onCancel('cancel')"
             :close-on-press-escape="false"
             :visible.sync="dialog.show">
    <el-form :model="form.data"
             :rules="form.rules"
             label-width="104px"
             class="pl56 pb8 pt24 "
             label-position="left"
             ref="form">
      <el-form-item label="用户组织归属"
                    prop="orgId">
        <el-cascader v-model="form.data.orgId"
                     class="w240"
                     ref="refHandle"
                     @change="changeOrganization"
                     :options="orgs"
                     :props="cascaderProps"></el-cascader>
      </el-form-item>
      <el-form-item label="用户手机号"
                    prop="phone">
        <el-input v-model="form.data.phone"
                  placeholder="请输入用户手机号"
                  maxlength="11"
                  class="w240"></el-input>
      </el-form-item>
      <el-form-item label="用户角色"
                    prop="userRoles">
        <el-select v-model="form.data.userRoles"
                   multiple
                   collapse-tags
                   class="w240"
                   placeholder="请选择">
          <el-option v-for="item in roles"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户姓名"
                    prop="name">
        <el-input v-model="form.data.name"
                  placeholder="请输入用户姓名"
                  class="w118 mr16"></el-input>
        <el-radio v-model="form.data.sex"
                  class="mr16"
                  :label="1">男</el-radio>
        <el-radio v-model="form.data.sex"
                  :label="2">女</el-radio>
      </el-form-item>
      <el-form-item label="用户密码"
                    prop="password">
        <el-input type="password"
                  autocomplete="off"
                  v-model="form.data.password"
                  :disabled="true"
                  placeholder="大小写英文加数字，至少8位"
                  class="w118 mr16"
                  v-if="isEdit"></el-input>
        <el-input v-model="form.data.password"
                  v-else
                  placeholder="大小写英文加数字，至少8位"
                  class="w240 mr16"></el-input>
        <el-button class="secondary-btn"
                   style="width:105px"
                   @click="resetPassword"
                   v-if="isEdit && $hasAuth($urls.restPassword)">恢复初始密码</el-button>
      </el-form-item>
      <el-form-item>
        <span slot="label"
              style="margin-left:10px">员工工号</span>
        <el-input v-model="form.data.jobNo"
                  placeholder="请输入员工工号"
                  class="w240"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary"
                 @click="onSave()">{{isEdit?'保存' : '确定'}}</el-button>
      <el-button class="secondary-btn"
                 v-show="!isEdit"
                 @click="onSave(true)">确定并继续</el-button>
      <el-button @click="onCancel('cancel')">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { regular } from '@u/validate'
export default {
  name: 'InfoForm',
  methods: {
    // 选择组织
    changeOrganization () {
      this.form.data.userRoles = []
    },
    // 保存
    onSave (isContinue) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isEdit ? this.updateUserInfo() : this.insertUser(isContinue)
        }
      })
    },

    // 新增用户
    insertUser (isContinue) {
      const params = JSON.parse(JSON.stringify(this.form.data))
      if (Array.isArray(params.orgId)) {
        params.orgId = params.orgId[params.orgId.length - 1]
      }
      this.$api.insertUser(params).then(res => {
        if (res.isError) {
          this.$message.error(res.message)
          return
        }
        this.$message.success('新增用户成功')
        isContinue ? this.onCancel('reloadTableData') : this.emitSaveSuccess('cancel')
      })
    },
    // 编辑用户
    updateUserInfo () {
      const params = JSON.parse(JSON.stringify(this.form.data))
      if (Array.isArray(params.orgId)) {
        params.orgId = params.orgId[params.orgId.length - 1]
      }
      delete params.password
      this.$api.updateUserInfo(params).then(res => {
        if (res.isError) {
          this.$message.error(res.message)
          return
        }
        this.$message.success('保存用户成功')
        this.emitSaveSuccess('cancel')
      })
    },
    // 取消
    onCancel (type) {
      this.$refs.form.resetFields()
      this.resetFromData()
      type === 'cancel' ? this.dialog.show = false : this.$emit('reloadTableData')
    },
    emitSaveSuccess (type) {
      this.onCancel(type)
      this.$emit('reloadTableData')
    },
    resetPassword () {
      const params = {
        userId: this.form.data.userId
      }
      this.$api.restPassword(params).then(res => {
        if (res.isError) {
          this.$message.warning(res.message)
          return
        }
        this.$message.success('重置密码成功')
      })
    },
    // 获取用户角色
    roleListByOrgId () {
      const { orgId } = this.form.data
      const temOrgId = Array.isArray(orgId) ? orgId[orgId.length - 1] : orgId
      const params = {
        orgId: temOrgId
      }
      this.$api.roleListByOrgId(params).then(res => {
        if (res.isError) return
        this.roles = res.content
      })
    },
    handleUserData (data) {
      const { sex, jobNo, id, name, phone, roleDTOS, orgId } = data
      this.form.data = {
        sex: Number(sex),
        password: 'Ww123456',
        jobNo,
        userId: id,
        name,
        phone,
        userRoles: roleDTOS && Array.from(roleDTOS, ({ id }) => id),
        orgId: orgId
      }
    },
    resetFromData () {
      this.form.data = {
        sex: 1,
        password: '',
        jobNo: '',
        name: '',
        userRoles: [],
        phone: '',
        orgId: []
      }
    },
    show (type, userId) {
      type === 'edit' && (this.findUserInfoById(userId))
      this.dialog = {
        show: true,
        type,
        title: type === 'edit' ? '编辑用户' : '新增用户'
      }
    },
    // 获取详情数据
    findUserInfoById (id) {
      const params = {
        userId: id
      }
      this.$api.findUserInfoById(params).then(res => {
        if (res.isError) return
        this.handleUserData(res.content)
      })
    }
  },
  data () {
    return {
      form: {
        data: {
          sex: 1,
          password: '',
          jobNo: '',
          name: '',
          userRoles: [],
          phone: '',
          orgId: []
        },
        rules: {
          orgId: [
            { required: true, message: '请选择用户组织', trigger: 'change' }
          ],
          userRoles: [
            { required: true, message: '请选择用户角色', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入用户手机号', trigger: 'blur' },
            { pattern: regular.phone, message: '目前只支持中国大陆的手机号码', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入用户密码', trigger: 'blur' },
            { pattern: regular.password, message: '大小写英文加数字，至少8位', trigger: 'blur' }
          ]
        }
      },
      cascaderProps: {
        value: 'id',
        children: 'child',
        label: 'name',
        checkStrictly: true
      },
      roles: [],
      dialog: {
        title: '',
        show: false,
        type: ''
      }

    }
  },
  computed: {
    orgs () {
      return this.$store.state.app.orgs
    },
    isEdit () {
      return this.dialog.type === 'edit'
    }
  },
  watch: {
    // 用来判断 cascader 值改变了，收起弹框
    'form.data.orgId' (o, n) {
      this.roleListByOrgId()
      if (this.$refs.refHandle) {
        this.$refs.refHandle.dropDownVisible = false
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.w118 {
  width: 118px;
}
.pl56 {
  padding-left: 56px;
}
</style>
