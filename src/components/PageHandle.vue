<template>
  <div class='page-handle-wrap center tb'
       :class="isCollapseSidebar ? 'collapse-page-handle': ''">
    <template v-for="(btn, index) in useConfig.btns">

      <slot v-if="btn.slot"
            :name="btn.slot"></slot>

      <el-button v-else
                 :key="index"
                 v-bind="bindProps(btn)"
                 @click="onBtn(btn)">
        {{btn.text}}
      </el-button>

    </template>

  </div>
</template>

<script>
export default {
  name: 'PageHandle',
  methods: {
    onBtn (btn) {
      if (btn.event === 'cancel') return this.onCancel()
      this.$emit(btn.event)
    },
    onCancel () {
      const { isEdit, backConfirm, backConfirmText } = this.useConfig
      if (!backConfirm) {
        this.goBack()
        return
      }
      const handleText = isEdit ? '编辑' : '新增'
      const title = backConfirmText || `要取消${handleText}？`
      this.$confirm('取消之后，填写的内容将全部清空', title, {
        customClass: 'custom-msg-box msg-box-double',
        cancelButtonClass: 'msg-box-cancel',
        confirmButtonClass: 'msg-box-confirm',
        confirmButtonText: '继续填写',
        cancelButtonText: `取消${handleText}`,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        center: true,
        showClose: false
      }).then(() => {
      }).catch(() => {
        this.goBack()
      })
    },
    goBack () {
      this.$store.dispatch('tags/delView', this.$route)
      const backRouteName = this.useConfig.backRouteName
      if (backRouteName) return this.$router.push({ name: backRouteName })
      this.$router.back()
    }
  },
  computed: {
    isCollapseSidebar () {
      return this.$store.state.app.isCollapseSidebar
    },

    // 绑定属性
    bindProps () {
      return (btn) => {
        const obj = { ...btn }
        // 移除冗余属性
        delete obj.text
        delete obj.event

        return obj
      }
    },

    useConfig () {
      const initConfig = {
        btns: [
          {
            text: '确定',
            type: 'primary',
            event: 'onConfirm'
          },
          // {
          //   text: '次级按钮',
          //   plain: true
          //   class: 'secondary-btn',
          //   event: 'onOther'
          // },
          {
            text: '取消',
            event: 'cancel'
          }
        ]
      }
      if (this.confirmText) {
        initConfig.btns[0].text = this.confirmText
      }
      return { ...initConfig, ...this.config }
    }
  },
  props: {
    confirmText: String,
    /**
     *  --- config 配置项
     *  backRouteName: 返回上一页面得Name
     *  backConfirm: 返回上一页是否需要二次确认
     *  backConfirmText: 返回上一页二次确认提示文字
     *  isEdit: 是否编辑页面
     *  btns: [] // 按钮列表 默认显示 确认 跟 取消
     */
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style lang='scss' scoped>
$marginPage: 20px;
.page-handle-wrap {
  position: fixed;
  bottom: 52px;
  transition: left 0.28s;
  left: $sidebarWidth + $marginPage;
  right: 21px;
  z-index: 6;
  background: #ffffff;
  .el-button {
    margin-top: 16px;
    margin-bottom: 16px;
  }
}
.collapse-page-handle {
  left: $sidebarCollapseWidth + $marginPage;
}
</style>
