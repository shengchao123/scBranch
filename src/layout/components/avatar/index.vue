<template>
  <div class='avatar-wrap column center-align'
       :style="bgStyle">
    <el-image :src="avatarUrl"
              class="avatar mt24">
      <div slot="error">
        <img class="avatar"
             :src="defaultAvatar">
      </div>
    </el-image>
    <div class="mt12 bold white-color">{{userInfo.name}}</div>
    <el-dropdown placement="bottom"
                 class="dropdown-wrap mt8"
                 @command="handleCommand">
      <span class="text-btn">
        设置<i class="el-icon-caret-bottom el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item in dropdownList"
                          :key="item.command"
                          :command="item.command">{{item.text}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- 个人信息弹窗 -->
    <el-dialog :title="userInfoDialog.title"
               width="456px"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :close-on-press-escape="false"
               :visible.sync="userInfoDialog.show">
      <user-info class="pt24 pb8 ml48 mr48"
                 :userInfo.sync="userInfo"
                 @reqUserInfo="reqUserInfo"></user-info>
    </el-dialog>

    <!-- 修改密码弹窗 -->
    <el-dialog :title="updatePasswordDialog.title"
               width="456px"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :close-on-press-escape="false"
               :visible.sync="updatePasswordDialog.show">
      <el-form ref="updatePasswordForm"
               :rules="updatePasswordForm.rules"
               :model="updatePasswordForm.data"
               class="mt24 center column"
               label-position="left"
               label-width="90px">
        <el-form-item label="原密码"
                      prop="oldPassword">
          <el-input v-model="updatePasswordForm.data.oldPassword"
                    class="w240"
                    type="password"
                    placeholder="输入现有密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码"
                      prop="newPassword">
          <el-input v-model="updatePasswordForm.data.newPassword"
                    class="w240"
                    type="password"
                    placeholder="输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码"
                      prop="confirmPassword">
          <el-input v-model="updatePasswordForm.data.confirmPassword"
                    class="w240"
                    type="password"
                    placeholder="确认新密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="mt8">
        <el-button type="primary"
                   @click="saveUpdatePassword">保存</el-button>
        <el-button @click="cancelUpdatePassword"
                   class="plain-btn">取消</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import { logout } from '@u/login'
import UserInfo from './UserInfo'
import { regular } from '@u/validate'
export default {
  name: 'Avatar',
  methods: {
    // 设置下拉框
    handleCommand (command) {
      switch (command) {
        case 'userInfo':
          this.userInfoDialog.show = true
          break
        case 'updatePassword':
          this.updatePasswordDialog.show = true
          break
        default:
          this.$confirm('', '要退出登录？', {
            confirmButtonText: '退出',
            customClass: 'custom-msg-box',
            cancelButtonClass: 'msg-box-cancel',
            confirmButtonClass: 'msg-box-confirm',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            closeOnPressEscape: false,
            center: true,
            showClose: false
          }).then(() => {
            logout()
          }).catch(() => { })
          break
      }
    },
    // 校验确认新密码
    validaterConfirmPassword (rule, value, callback) {
      if (value !== this.updatePasswordForm.data.newPassword) {
        callback(new Error('两次输入密码不相同'))
      }
      callback()
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
            this.cancelUpdatePassword()
          })
        }
      })
    },
    // 修改密码-取消按钮
    cancelUpdatePassword () {
      this.$refs.updatePasswordForm.resetFields()
      this.updatePasswordDialog.show = false
    },
    // 获取个人信息
    reqUserInfo () {
      this.$api.findUserInfoById({}).then(res => {
        if (!res || res.isError) return
        this.userInfo = res.content
        this.$store.commit('user/SET_USER_NAME', res.content.name)
        const temRoleName = res.content.roleDTOS.map(item => {
          return item.name
        })
        this.userInfo.roleName = temRoleName.join('、')
      })
    }

  },
  data () {
    return {
      defaultAvatar: require('@/assets/sidebar/img_avatar.png'),
      userInfo: {},
      dropdownList: Object.freeze([
        {
          text: '个人信息',
          command: 'userInfo'
        },
        {
          text: '修改密码',
          command: 'updatePassword'
        },
        {
          text: '退出登录',
          command: 'logout'
        }
      ]),
      userInfoDialog: {
        title: '个人信息',
        show: false
      },
      updatePasswordDialog: {
        title: '修改密码',
        show: false
      },
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
            { pattern: regular.password, message: '英文加数字，至少8个字符', trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '请输入确认新密码', trigger: 'blur' },
            { validator: this.validaterConfirmPassword, trigger: 'blur' }
          ]
        })
      }
    }
  },
  computed: {
    bgStyle () {
      return `background-image: url(${this.avatarBgImg})`
    },
    avatarUrl () {
      return this.userInfo.avatar ? this.$fileHost + this.userInfo.avatar : ''
    },
    avatarBgImg () {
      return this.$store.state.user.avatarBgImg
    }
  },
  created () {
    this.reqUserInfo()
  },
  components: {
    UserInfo
  }
}
</script>

<style lang='scss' scoped>
.white-color {
  color: #ffffff;
}

.avatar-wrap {
  width: 100%;
  height: 160px;
  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 32px;
  }
}
</style>
