<template>
  <div class='page-wrap'
       :class="needPadding ? 'handle-padding' : ''">
    <div class='ft16 bold mt16'
         v-if="title">
      {{title}}
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Page',
  props: {
    title: {
      type: String
    },
    needPadding: {
      type: [Boolean, String],
      default: false
    }
  }
}
</script>

<style lang='scss' scoped>
.page-wrap {
  padding: 0 24px 16px;
}
.handle-padding {
  padding-bottom: 70px;
}
</style>
