<template>
  <div class="empty center">
    <div class="box column center-align">
      <svg-icon v-if="icon"
                class="mb12"
                :icon="icon"></svg-icon>
      <span v-if="message"
            :class="messageColor">{{message}}</span>
      <span v-if="tip"
            class="ft12 color-999 mt8">{{tip}}</span>
      <div class="mt24">
        <slot name="button"></slot>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PageEmpty',
  props: {
    icon: String,
    message: String, // 文案说明
    messageColor: { // 说明文案的颜色
      type: String,
      default: 'color-666'
    },
    tip: String// 建议、提示
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.empty {
  width: 100%;
  height: 500px;
  .box {
    text-align: center;
    svg {
      font-size: 40px;
      color: #d2d2d2;
    }
  }
}
</style>
