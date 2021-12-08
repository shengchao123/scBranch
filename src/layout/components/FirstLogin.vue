<template>
  <div class='init-wrap'>
    <!-- 修改密码弹窗 -->
    <el-dialog title="修改密码"
               width="456px"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :close-on-press-escape="false"
               :visible.sync="firstLogin">
      <el-form ref="updatePasswordForm"
               :rules="updatePasswordForm.rules"
               :model="updatePasswordForm.data"
               class="mt24 center column"
               label-position="left"
               label-width="90px">
        <el-form-item label="原密码"
                      prop="oldPassword">
          <el-input v-model="updatePasswordForm.data.oldPassword"
                    type="password"
                    class="w240"
                    placeholder="输入现有密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码"
                      prop="newPassword">
          <el-input v-model="updatePasswordForm.data.newPassword"
                    type="password"
                    class="w240"
                    placeholder="输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码"
                      prop="confirmPassword">
          <el-input v-model="updatePasswordForm.data.confirmPassword"
                    type="password"
                    class="w240"
                    placeholder="确认新密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="mt8">
        <el-button type="primary"
                   @click="saveUpdatePassword">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { regular } from '@u/validate'
export default {
  name: 'Init',
  methods: {
    show () {
      this.firstLogin = true
    },
    // 校验确认新密码
    validaterConfirmPassword (rule, value, callback) {
      if (value !== this.updatePasswordForm.data.newPassword) {
        callback(new Error('两次输入密码不相同'))
      }
      callback()
    },
    onCancel () {
      this.firstLogin = false
    },
    // 修改密码-保存按钮
    saveUpdatePassword () {
      this.$refs.updatePasswordForm.validate((valid) => {
        if (valid) {
          const params = {
            oldPassword: this.updatePasswordForm.data.oldPassword,
            password: this.updatePasswordForm.data.newPassword
          }
          const subCodeArr = [
            {
              code: 'OLD_PASS_FAIL',
              message: '原密码错误'
            },
            {
              code: 'USER_NOT_FOUND',
              message: '原密码错误'
            },
            {
              code: 'UPDATE_FAIL',
              message: '原密码错误'
            }
          ]
          this.$api.updateUserPassword(params).then(res => {
            if (res.isError) {
              subCodeArr.map(item => {
                if (res.subCode === item.code) {
                  this.$message.error(item.message)
                }
              })
              return
            }
            this.$message.success('密码修改成功')
            this.firstLogin = false
          })
        }
      })
    }
  },
  data () {
    return {
      firstLogin: false,
      updatePasswordForm: {
        data: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        rules: Object.freeze({
          oldPassword: [
            { required: true, message: '请输入原密码', trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { pattern: regular.password, message: '大小写英文加数字，至少 8 位', trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '请输入确认新密码', trigger: 'blur' },
            { validator: this.validaterConfirmPassword, trigger: 'blur' }
          ]
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.init-wrap {
}
</style>
