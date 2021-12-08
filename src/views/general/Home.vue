<template>
  <div class='home-wrap center column'>
    <img :src="homeBg"
         width="640">
    <div class="title">
      <span v-show="userName">{{userName}}，</span>
      <span>欢迎您使用{{projectName}}</span>
    </div>
  </div>
</template>

<script>
import config from '@/config.js'

export default {
  name: 'Home',
  data () {
    return {
      projectName: config.title
    }
  },
  computed: {
    homeBg () {
      return this.$store.state.user.homeBg
    },
    userName () {
      return this.$store.state.user.userName
    }
  }
}
</script>

<style lang='scss' scoped>
.home-wrap {
  height: 100%;
  .title {
    margin-top: 60px;
    font-size: 28px;
  }
}
</style>
