<template>
  <section class="app-main">
    <keep-alive>
      <router-view :key="key"
                   v-if="keepAlive" />
    </keep-alive>
    <router-view :key="key"
                 v-if="!keepAlive" />
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews () {
      return this.$store.state.tags.cachedViews
    },
    key () {
      return this.$route.path
    },
    keepAlive () {
      return this.$route.meta.keepAlive
    }
  }
}
</script>

<style lang='scss' scoped>
.app-main {
  height: calc(100vh - 42px - 32px - 36px - #{$navbarHeight});
  position: relative;
  background: #fff;
  border: 16px solid #eee;
  overflow-y: auto;
}
</style>
