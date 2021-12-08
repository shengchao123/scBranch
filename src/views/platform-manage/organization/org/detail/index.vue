<template>
  <page :title="pageTitle"
        need-padding>
    <template v-if="$route.query.type !== 'look'">
      <org-form ref="orgForm"></org-form>
      <page-handle @onConfirm="onConfirm"
                   :config="editPageHandleConfig"></page-handle>
    </template>

    <template v-else>
      <org-info :orgInfo="orgInfo"></org-info>
      <page-handle :config="lookPageHandleConfig"
                   ref="pageHandle"
                   @onOther="goEdit">
        <el-button slot="back"
                   class="plain-btn"
                   @click="onBack">返回</el-button>
      </page-handle>
    </template>
  </page>
</template>

<script>
import Page from '@/components/Page.vue'
import OrgForm from './components/OrgForm.vue'
import OrgInfo from './components/OrgInfo.vue'
import PageHandle from '@/components/PageHandle'
export default {
  name: 'index',
  methods: {
    onBack () {
      this.$refs.pageHandle.goBack()
    },
    onConfirm () {
      this.$refs.orgForm.onConfirm()
    },
    goEdit () {
      this.$route.query.type = 'edit'
      this.editInit()
    },

    editInit () {
      if (this.$route.query.orgId) {
        this.updateTagView('编辑组织')
      }
      this.$nextTick(() => {
        this.$refs.orgForm.reqFindSysModuleRoleEnableList()
        this.$refs.orgForm.reqOrganizationInfo()
      })
    },
    updateTagView (title) {
      const temObj = Object.assign({}, this.$route, {
        title: title
      })
      this.$store.dispatch('tags/updateVisitedView', temObj)
    },
    handleOrgInfoForLook () {
      const params = {
        orgId: this.$route.query.orgId
      }
      this.$api.findOrganizationById(params).then(res => {
        if (res.isError) return
        const temData = res.content
        for (const key in temData) {
          const item = temData[key]
          if (this.$isEmpty(item)) {
            temData[key] = '-'
          }
        }
        if (!this.$isEmpty(temData.provinceId) && temData.provinceId !== '-') {
          temData.address = [temData.provinceName, temData.cityName, temData.countyName, temData.address].join(' ')
        }
        if (!this.$isEmpty(temData.orgLabels) && temData.orgLabels !== '-') {
          const temArray = temData.orgLabels.map(item => {
            return item.orgLabelName
          })
          temData.orgLabels = temArray.join('，')
        }
        this.orgInfo = temData
      })
    }
  },
  data () {
    return {
      orgInfo: {},
      editPageHandleConfig: {
        btns: [
          {
            text: this.$route.query.type ? '保存' : '确定',
            type: 'primary',
            event: 'onConfirm'
          },
          {
            text: '取消',
            event: 'cancel'
          }
        ]
      },
      lookPageHandleConfig: {
        btns: [
          {
            slot: 'back'
          },
          {
            text: '编辑',
            plain: true,
            class: 'secondary-btn',
            event: 'onOther'
          }
        ]
      }
    }
  },
  computed: {

    districtTree () {
      return this.$store.state.app.districtTree
    },
    // 页面标题
    pageTitle () {
      if (this.$route.query.type === 'look') return '组织详情'
      return this.$route.query.orgId ? '编辑组织' : '新增组织'
    }
  },
  watch: {
    handleCascaderValue () {
      if (this.$refs.refHandle) {
        this.$refs.refHandle.dropDownVisible = false
      }
    },
    $route: {
      handler: function (to, from) {
        if (to.query.type === 'edit') {
          this.$nextTick(() => {
            this.editInit()
          })
        } else if (this.$route.query.type === 'look') {
          this.updateTagView('组织详情')
          this.handleOrgInfoForLook()
        } else if (!this.$route.query.type) {
          this.updateTagView('新增组织')
          this.$nextTick(() => {
            this.$refs.orgForm.reqFindSysModuleRoleEnableList()
          })
        }
      },
      immediate: true
    }
  },
  components: { Page, OrgForm, OrgInfo, PageHandle }

}
</script>

<style lang='scss' scoped>
</style>
