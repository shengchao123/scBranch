
<template>
  <div class='table-header-wrap center-align between-row mb16 mt16'>
    <div class=" center-align">
      <el-button type="primary"
                 v-if="$hasAuth(config.newAuth) && config.newBtnTitle"
                 @click="onNew">{{config.newBtnTitle}}</el-button>
      <el-button @click="batchDelete"
                 v-if="$hasAuth(config.delAuth) && config.delBtnTitle"
                 class="plain-btn">{{config.delBtnTitle}}</el-button>
    </div>
    <el-input :placeholder="config.keywordPlaceHolderText"
              class="w240"
              @clear="onSearch"
              @blur="onSearch"
              @keyup.enter.native="onSearch"
              v-model="keyword"
              v-if="config.keywordPlaceHolderText">
      <i slot="suffix"
         class="el-input__icon el-icon-search pointer"></i>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'TableSearch',
  methods: {
    onNew () {
      this.$emit('onNew')
    },
    batchDelete () {
      this.$emit('onBatchDelete')
    },
    onSearch () {
      this.$emit('update:keyword', this.keyword)
      this.$emit('onSearch')
    }
  },
  data () {
    return {
      keyword: ''
    }
  },
  computed: {
    test () {
      console.log(this.config)
      return this.config
    }
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          newBtnTitle: '',
          newAuth: '',
          delBtnTitle: '',
          delAuth: '',
          keywordPlaceHolderText: ''
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.table-header-wrap {
}
</style>
