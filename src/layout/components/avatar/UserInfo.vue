<template>
  <div class='info-wrap'>
    <div class="info-item flex"
         :class="itemClass(index)"
         v-for="(item,index) in userForm"
         :key="item.key">
      <div class="color-999 mr4 center-align">{{item.label}}：</div>
      <div v-if="item.key === 'avatar'"
           class="info-avatar-warp">
        <el-upload class="avatar-upload-wrap"
                   action=""
                   accept=".jpeg,.png,.jpg"
                   :before-upload="beforeAvatarUpload"
                   :http-request="uploadImg"
                   :show-file-list="false"
                   @mouseenter.native="showAvatar = true"
                   @mouseleave.native="showAvatar = false">
          <el-image :src="$fileHost + userInfo.avatar"
                    class="avatar">
            <div slot="error">
              <img class="avatar"
                   :src="defaultAvatar"
                   alt="">
            </div>
          </el-image>
          <span v-show="showAvatar"
                class="avatar-update avatar center ft12">点击修改</span>
        </el-upload>
      </div>
      <div v-else-if="item.key === 'email'"
           class="center-align">
        <el-input v-if="isShowEmailInput"
                  size="mini"
                  v-focus
                  class="w240"
                  v-model="userInfo.email"
                  placeholder="请输入个人邮箱"
                  @blur="changeEmailInput"></el-input>
        <span v-if="!isShowEmailInput">{{userInfo.email || '--'}}</span>
        <div class="ml8"
             v-show="!isShowEmailInput"
             style="color: #aaa"
             @click="clickEdit(item)">
          <svg-icon icon="icon_bianji"
                    class="pointer" />
        </div>
      </div>
      <div class="center-align"
           v-else-if="item.key === 'birthday'">
        <el-date-picker v-model="userInfo.birthday"
                        type="date"
                        v-focus
                        class="w240"
                        :clearable="false"
                        value-format="timestamp"
                        @change="changeBirthInput"
                        @blur="changeBirthInput()"
                        v-if="isShowBirthInput"
                        placeholder="请选择出生日期">
        </el-date-picker>
        <span v-if="!isShowBirthInput"> {{handleInfo(item.key)}}</span>
        <div class="ml8"
             v-show="!isShowBirthInput"
             style="color: #aaa"
             @click="clickEdit(item)">
          <svg-icon icon="icon_bianji"
                    class="pointer" />
        </div>
      </div>
      <div v-else>{{handleInfo(item.key) || '--'}}</div>
    </div>

  </div>
</template>

<script>
import { checkInput } from '@u/validate.js'
export default {
  name: 'UserInfo',
  methods: {
    // 编辑按钮
    clickEdit (item) {
      item.key === 'email' ? this.isShowEmailInput = !this.isShowEmailInput : this.isShowBirthInput = !this.isShowBirthInput
    },
    // 修改email
    changeEmailInput () {
      if (this.userInfo.email) {
        if (!checkInput(this.userInfo.email, 'email')) {
          this.$message.warning('请输入有效邮箱')
          return
        }
        this.reqUpdateModuleUserInfoById()
      }
      this.isShowEmailInput = false
    },
    // 修改生日
    changeBirthInput () {
      this.isShowBirthInput = false
      this.reqUpdateModuleUserInfoById()
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt1M
    },
    uploadImg (e) {
      const config = {
        uploadType: 'a',
        file: e.file
      }
      this.$api.uploadFile(config).then(res => {
        if (res.isError) return
        this.userInfo.avatar = res[0]
        this.reqUpdateModuleUserInfoById()
      })
    },
    reqUpdateModuleUserInfoById () {
      const params = {
        avatar: this.userInfo.avatar,
        email: this.userInfo.email,
        birthday: this.userInfo.birthday
      }
      this.$api.updateModuleUserInfoById(params).then(res => {
        if (res.isError) return
        this.$emit('reqUserInfo')
      })
    }
  },
  data () {
    return {
      userForm: Object.freeze([
        { label: '头像', key: 'avatar' },
        { label: '个人邮箱', key: 'email' },
        { label: '生日', key: 'birthday' },
        { label: '用户角色', key: 'roleName' },
        { label: '用户姓名', key: 'name' },
        { label: '用户性别', key: 'sex' },
        { label: '用户手机号', key: 'phone' },
        { label: '员工工号', key: 'jobNo' },
        { label: '创建时间', key: 'createTime' },
        { label: '创建人', key: 'creatorName' },
        { label: '修改时间', key: 'modifyTime' }
      ]),
      defaultAvatar: require('@/assets/sidebar/img_avatar.png'),
      showAvatar: false,
      isShowEmailInput: false,
      isShowBirthInput: false
    }
  },
  directives: {
    // 注册一个局部的自定义指令 v-focus
    focus: {
      // 指令的定义
      inserted: function (el) {
        // 聚焦元素
        el.querySelector('input').focus()
      }
    }
  },
  props: {
    userInfo: {
      type: Object
    }
  },
  computed: {
    handleInfo () {
      return function (key) {
        if (key === 'createTime' || key === 'modifyTime') {
          return this.$moment(this.userInfo[key]).format('YYYY-MM-DD, HH:mm:ss')
        }
        if (key === 'birthday') {
          return this.$moment(this.userInfo[key]).format('YYYY-MM-DD')
        }
        if (key === 'sex') {
          const sexObj = Object.freeze({
            0: '保密',
            1: '男',
            2: '女'
          })
          return sexObj[this.userInfo[key]]
        }
        return this.userInfo[key]
      }
    },
    itemClass () {
      return function (index) {
        switch (index) {
          case 0: return 'mb8'
          case 1: return 'h32'
          case 2: return 'h32 pb12 bb'
          case 3: return 'mt20 mb16'
          default: return 'mb16'
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.h32 {
  height: 32px;
}
.info-wrap {
  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 32px;
  }
  .info-avatar-warp /deep/ .el-upload {
    position: relative;
  }
  .avatar-update {
    position: absolute;
    top: 0;
    left: 0;
    color: #fff;
    background: rgba($color: #000000, $alpha: 0.5);
  }
}
</style>
