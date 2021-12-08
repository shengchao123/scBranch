<template>
  <div class='form-wrap'>
    <el-form ref="form"
             class="form-wrap"
             :rules="rules"
             :model="form"
             label-position="left"
             label-width="104px">
      <el-form-item prop="logoImg">
        <label slot="label"
               style="line-height: 56px">组织logo</label>
        <div class="center-align"
             style="padding-right: 50px">
          <page-upload-img :imgUrl.sync="form.logoImg"
                           :config="uploadImgConfig"></page-upload-img>
        </div>
      </el-form-item>

      <el-form-item label="组织名称"
                    prop="name">
        <el-input v-model="form.name"
                  class="w240"
                  placeholder="请输入组织名称"></el-input>
      </el-form-item>

      <el-form-item label="上级组织归属"
                    prop="parentOrgId">
        <el-cascader v-model="form.parentOrgId"
                     class="w240"
                     @change="val => handleCascaderValue = val"
                     ref="refHandle"
                     :options="organizationTree"
                     :props="cascaderProps"></el-cascader>
      </el-form-item>

      <el-form-item label="组织角色"
                    prop="moduleRoleId">
        <el-select v-model="form.moduleRoleId"
                   class="w240 mr80"
                   placeholder="请选择">
          <el-option v-for="item in roleEnableList"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="组织类型"
                    prop="orgClassId">
        <el-select v-model="form.orgClassId"
                   class="w240"
                   placeholder="请选择">
          <el-option v-for="item in orgClass"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="orgNo"
                    class="pl12"
                    label="组织编码">

        <el-input v-model="form.orgNo"
                  class="w240 mr80 ml-10"
                  placeholder="组织编码(企业营业执照编号)"></el-input>
      </el-form-item>
      <el-form-item label="组织标签"
                    class="pl10"
                    prop="orgLabelId">
        <el-select v-model="form.orgLabelId"
                   class="w240 ml-10"
                   multiple
                   collapse-tags
                   placeholder="请选择，可多选">
          <el-option v-for="item in orgLabel"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <div class="collapse-container"
           @click="isExpandedMoreInfo = !isExpandedMoreInfo">
        <span style="margin-right: 5px">{{isExpandedMoreInfo ? '收起更多信息' : '展开更多信息'}}</span>
        <svg-icon icon="icon_xiangxia"
                  class='icon-class color-999'
                  v-show="!isExpandedMoreInfo"></svg-icon>
        <svg-icon icon="icon_xiangshang"
                  class='icon-class color-999'
                  v-show="isExpandedMoreInfo"></svg-icon>
      </div>

      <div class="other-container"
           :style="isExpandedMoreInfo ? 'height:100px': 'height:0px'">
        <el-form-item label="组织地址"
                      class="pl12">
          <el-cascader v-model="districtIds"
                       class="w240 ml-10"
                       ref="district"
                       :options="districtTree"
                       :props="cascaderAddressProps"></el-cascader>
          <el-input v-model="form.address"
                    class="address-input"
                    placeholder="输入详细地址"></el-input>
        </el-form-item>
        <el-form-item label="联系人"
                      class="pl12">
          <el-input v-model="form.contactPerson"
                    class="w240 ml-10"
                    placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话"
                      prop="tel"
                      class="pl12">
          <el-input v-model="form.tel"
                    class="w240 ml-10"
                    placeholder="请输入联系电话"></el-input>
        </el-form-item>
      </div>
    </el-form>

    <el-dialog width="456px"
               :stripe="true"
               :border="false"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :close-on-press-escape="false"
               :visible.sync="dialog.show">

      <div class="column center-align">
        <svg-icon icon="icon_tanhao"
                  class="ft32 mt12"
                  style="color:#eaae3f"></svg-icon>
        <span class="mt8">要修改该组织信息？</span>
        <span class="mt8 ft12 color-999">由于调整了上级组织归属，确认修改之后，以下用户的</span>
        <span class="ft12 color-999"
              style="margin-top:2px">角色将会被清空，需及时更新用户角色</span>
      </div>

      <div class="pl12 pr12 mt12 table-wrap">
        <el-table :data="userData">
          <el-table-column prop="userName"
                           label="姓名">
          </el-table-column>
          <el-table-column label="手机号"
                           prop="phone">
          </el-table-column>
          <el-table-column prop="roleName"
                           label="角色名">
          </el-table-column>
        </el-table>
      </div>

      <div slot="footer"
           class="mt24">
        <el-button type="primary"
                   @click="updateOrganization">确认修改</el-button>
        <el-button @click="onChangeAndUpdate"
                   class="secondary-btn">修改并更新</el-button>
        <el-button @click="dialog.show = false"
                   class="plain-btn">以后再说</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pageUploadImg from '@/components/PageUploadImg'
import { checkInput } from '@u/validate.js'
import SvgIcon from '@/components/SvgIcon.vue'
export default {
  name: 'Form',
  methods: {

    reqFindSysModuleRoleEnableList () {
      this.$api.findSysModuleRoleEnableList().then(res => {
        if (res.isError) return
        this.roleEnableList = res.content
      })
    },

    handleReqData () {
      let districtData = {}
      if (!this.$isEmpty(this.$refs.district.inputValue)) {
        const districtLabel = this.$refs.district.inputValue.split(' / ')
        districtData = {
          provinceId: this.districtIds[0],
          provinceName: districtLabel[0],
          cityId: this.districtIds[1],
          cityName: districtLabel[1],
          countyId: this.districtIds[2],
          countyName: districtLabel[2],
          address: this.form.address
        }
      }
      let parentOrgId = JSON.parse(JSON.stringify(this.form.parentOrgId))
      if (Array.isArray(parentOrgId)) {
        parentOrgId = parentOrgId.pop()
      }

      const needKeys = ['name', 'orgClassId', 'orgLabelId', 'contactPerson', 'orgNo', 'moduleRoleId', 'logoImg', 'tel']
      const temObj = {}
      needKeys.forEach(key => {
        temObj[key] = this.form[key]
      })

      const params = {
        id: this.$route.query.orgId || '',
        parentOrgId: parentOrgId,
        ...temObj,
        ...districtData
      }
      return this.$deleteObjectEmptyAttr(params)
    },
    reqOrganizationInfo () {
      const params = {
        orgId: this.$route.query.orgId
      }
      this.$api.findOrganizationById(params).then(res => {
        if (res.isError) return
        if (!this.$isEmpty(res.content.provinceId)) {
          this.districtIds = [res.content.provinceId, res.content.cityId, res.content.countyId]
        }
        this.oldName = res.content.name
        this.oldParentId = res.content.oldParentId

        const needKeys = ['name', 'orgClassId', 'address', 'parentOrgId', 'orgLabelId', 'contactPerson', 'orgNo', 'moduleRoleId', 'logoImg', 'tel']
        const temObj = {}
        needKeys.forEach(key => {
          temObj[key] = res.content[key]
        })

        this.form = {
          ...temObj,
          orgLabelId: res.content.orgLabels ? res.content.orgLabels.map(item => item.orgLabelId) : undefined
        }
      })
    },
    onChangeAndUpdate () {
      this.updateOrganization('User')
    },

    confirmUpdate () {
      this.updateOrganization()
    },
    enterAndUpdate () {
      this.updateOrganization()
      this.$router.push('Role')
    },
    insertOrganization () {
      const params = this.handleReqData()
      this.$api.insertOrganization(params).then(res => {
        if (res.isError) return
        this.$message.success('组织添加成功')
        this.$store.dispatch('app/setOrgs')
        this.$store.dispatch('platform/setPlatformTree')
        this.$bus.$emit('delTagView')
        this.$router.back()
      })
    },
    reqUpdateCheck () {
      let parentOrgId = JSON.parse(JSON.stringify(this.form.parentOrgId))
      if (Array.isArray(parentOrgId)) {
        parentOrgId = parentOrgId.pop()
      }
      const params = {
        id: this.$route.query.orgId,
        orgClassId: this.form.orgClassId,
        parentOrgId: parentOrgId
      }
      this.$api.updateOrganizationCheck(params).then(res => {
        if (res.isError) {
          this.$message.warning(res.message)
          return
        }
        if (res.content) {
          this.userData = res.content.map(item => {
            item.roleName = item.roleName ? item.roleName.join(' / ') : ''
            return item
          })
          this.dialog.show = true
        } else {
          this.updateOrganization()
        }
      })
    },

    updateOrganization (routeName) {
      const params = this.handleReqData()
      this.$api.updateOrganization(params).then(res => {
        if (res.isError) return
        this.$message.success('编辑成功')
        this.$store.dispatch('app/setOrgs')
        this.$store.dispatch('platform/setPlatformTree')
        if (routeName) {
          this.$router.push({ name: routeName })
        }
        this.$bus.$emit('delTagView')
      })
    },
    reqOrganizationCheckName () {
      let parentOrgId = ''
      if (Array.isArray(this.form.parentOrgId)) {
        parentOrgId = this.form.parentOrgId[this.form.parentOrgId.length - 1]
      } else {
        parentOrgId = this.form.parentOrgId
      }
      const params = {
        orgName: this.form.name,
        parentOrgId: parentOrgId
      }
      this.$api.insertOrganizationCheckName(params).then(res => {
        if (res.isError) {
          this.$alert(res.message, '提示', {
            confirmButtonText: '确定',
            callback: action => { }
          })
          return
        }
        if (this.$route.query.type === 'edit') {
          this.reqUpdateCheck()
        } else {
          this.insertOrganization()
        }
      })
    },
    findOrgClassEnList () {
      this.$api.findOrgClassEnList().then(res => {
        if (res.isError) return
        this.orgClass = res.content
      })
    },
    findOrgLabelEnList () {
      this.$api.findOrgLabelEnList().then(res => {
        if (res.isError) return
        this.orgLabel = res.content
      })
    },
    onConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.$route.query.type === 'edit' && this.form.name === this.oldName) {
            this.reqUpdateCheck()
            return
          }
          this.reqOrganizationCheckName()
        } else {
          return false
        }
      })
    }
  },
  components: { pageUploadImg, SvgIcon },
  data () {
    var validateTelOrPhone = (rule, value, callback) => {
      if (!checkInput(value, 'phone') && !checkInput(value, 'tel')) {
        callback(new Error('请输入正确的联系电话'))
      } else {
        callback()
      }
    }
    return {
      dialog: {
        show: false
      },
      // 上传头像配置
      uploadImgConfig: Object.freeze({
        isCircle: true,
        descriptionList: [
          {
            label: '尺寸大小',
            text: '不小于88*88px'
          }
        ]
      }),
      orgClass: [],
      orgLabel: [],
      districtIds: [],
      roleEnableList: [],
      isExpandedMoreInfo: false,
      dialogTableVisible: false,
      oldName: '',
      oldParentId: '',
      userData: {},
      currentType: '',

      cascaderAddressProps: {
        value: 'code',
        children: 'children',
        label: 'name'
      },
      cascaderProps: {
        value: 'id',
        children: 'child',
        label: 'name',
        checkStrictly: true
      },
      form: {
        name: '',
        logoImg: '',
        orgLabelId: '',
        orgNo: '',
        orgClassId: '',
        parentOrgId: '',
        contactPerson: '',
        tel: ''
      },
      rules: {
        logoImg: [
          { required: true, message: '请上传 logo', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入组织名称', trigger: 'blur' }
        ],
        moduleRoleId: [
          { required: true, message: '请选择组织角色', trigger: 'blur' }
        ],
        parentOrgId: [
          { required: true, message: '请选择上级组织归属', trigger: 'blur' }
        ],
        orgClassId: [
          { required: true, message: '请选择组织类型', trigger: 'blur' }
        ],
        tel: [
          { validador: validateTelOrPhone }
        ]
      }
    }
  },
  created () {
    this.findOrgClassEnList()
    this.findOrgLabelEnList()
  },
  computed: {
    districtTree () {
      return this.$store.state.app.districtTree
    },
    organizationTree () {
      return this.$store.state.app.orgs
    }
  },
  watch: {
    handleCascaderValue () {
      if (this.$refs.refHandle) {
        this.$refs.refHandle.dropDownVisible = false
      }
    }
  }
}
</script>

<style lang='scss' scoped>
/deep/ .el-dialog__header {
  display: none;
}
.table-wrap {
  max-height: 120px;
  overflow-y: scroll;
}
.form-wrap {
  .form-wrap {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 800px;
    margin: 0 auto;
    padding-top: 60px;
    .img-tips {
      padding-right: 50px;
      p {
        line-height: 22px;
      }
    }
  }

  .collapse-container {
    margin-top: 8px;
    width: 100%;
    display: block;
    margin-left: 10px;
    line-height: 20px;
    cursor: pointer;
    .icon-class {
      height: 14px;
      width: 14px;
    }
  }

  .other-container {
    overflow: hidden;
    height: 0px;
    transition: height 0.28s;
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .address-input {
      margin-left: 16px;
      width: 438px;
    }
  }
}
</style>
