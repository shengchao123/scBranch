<template>
  <div class='theme-wrap'>
    <div class="ft16 bold">{{styleSetting[0].name}}</div>
    <div class="mt12">
      {{styleSetting[0].description}}
    </div>

    <!-- 收起菜单选择 -->
    <div class="ft16 bold mt40">
      {{styleSetting[1].name}}
    </div>
    <div class="set-theme-wrap mt16">
      <div class="center-align bb">
        <div>收起左侧菜单</div>
        <el-switch v-model="collapseSidebar"
                   @change="changeSidebar">
        </el-switch>
      </div>
      <div class="center-align">
        <div>固定顶部</div>
        <el-switch v-model="fixedHeader"
                   @change="fixedTopChange">
        </el-switch>
      </div>
    </div>

    <!-- 主题皮肤选择 -->
    <div class="ft16 bold mt40">{{styleSetting[2].name}}</div>
    <div class="skin-select mt16">
      <div class="between-row pointer"
           v-for="(item,index) in themes"
           :key="index"
           :style="{background: item.value.colorPrimary}"
           @click="changeTheme(item, index)">
        <div>
          {{ item.name }}<span v-show="skinIndex === index">（当前使用）</span>
        </div>
        <div>
          <svg-icon v-show="skinIndex === index"
                    style="transform: scale(1.2);"
                    class="icon item-icon"
                    icon="icon_chenggong">
          </svg-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  methods: {
    changeTheme (item, index) {
      this.skinIndex = index
      this.$store.dispatch('user/setTheme', item.value)
      const params = {
        updateUserModuleCustomInfo: {
          componentId: item.componentId,
          componentName: item.name,
          componentValue: JSON.stringify(item.value),
          groupId: this.styleSetting[2].components[0].groupId
        }
      }
      this.reqUpdateModuleCustom(params)
    },

    changeSidebar (val) {
      const params = {
        updateUserModuleCustomInfo: {
          componentId: this.styleSetting[1].components[0].id,
          componentName: this.styleSetting[1].components[0].name,
          componentValue: val ? '1' : '0',
          groupId: this.styleSetting[1].components[0].groupId
        }
      }
      this.reqUpdateModuleCustom(params)
      this.$store.commit('app/SET_COLLAPSE_SIDEBAR', val)
    },
    fixedTopChange (val) {
      const params = {
        updateUserModuleCustomInfo: {
          componentId: this.styleSetting[1].components[1].id,
          componentName: this.styleSetting[1].components[1].name,
          componentValue: val ? '1' : '0',
          groupId: this.styleSetting[1].components[1].groupId
        }
      }
      this.reqUpdateModuleCustom(params)
      this.$store.commit('app/SET_FIXED_HEADER', val)
    },

    reqUpdateModuleCustom (params) {
      this.$api.updateModuleCustom(params)
    }
  },
  data () {
    return {
      collapseSidebar: false,
      fixedHeader: false,
      skinIndex: 0
    }
  },
  computed: {
    isCollapseSidebar () {
      return this.$store.state.app.isCollapseSidebar
    },
    isFixedHeader () {
      return this.$store.state.app.isFixedHeader
    },
    styleSetting () {
      return this.$store.state.user.styleSetting
    },
    themes () {
      this.styleSetting[2].components[0].options.forEach((item, index) => {
        if (item.isCheck) {
          this.skinIndex = index
          this.$store.dispatch('user/setTheme', item.value)
        }
      })
      return this.styleSetting[2].components[0].options
    }
  },
  watch: {
    isCollapseSidebar: {
      handler: function (n, o) {
        this.collapseSidebar = n
      },
      immediate: true
    },
    isFixedHeader: {
      handler: function (n, o) {
        this.fixedHeader = n
      },
      immediate: true
    }
  }
}
</script>

<style lang='scss' scoped>
.theme-wrap {
  background-color: $color-f9;
  padding: 21px 24px;
  box-sizing: border-box;
  height: 100%;
  .set-theme-wrap {
    width: 258px;
    height: 112px;
    background: #ffffff;
    border: 1px solid #ececef;
    border-radius: 4px;
    > div {
      height: 56px;
      padding: 0 17px;
      justify-content: space-between;
    }
  }

  .skin-select {
    width: 258px;
    height: 168px;
    border-radius: 4px;
    overflow: hidden;
    > div {
      color: #fff;
      height: 56px;
      line-height: 56px;
      padding: 0 14px;
    }
  }
}
</style>
