<template>
  <div class="notice-manage">
    <div class="">
      <el-tabs v-model="activeTabName"
               @tab-click="handleChangeTab">
        <el-tab-pane class="notice-manage-list"
                     v-infinite-scroll="scrollBottom"
                     label="消息"
                     name="message">
          <message ref="message"></message>
        </el-tab-pane>
        <el-tab-pane class="notice-manage-list"
                     v-infinite-scroll="scrollBottom"
                     label="通知"
                     name="notice">
          <notice ref="notice"></notice>
        </el-tab-pane>
        <el-tab-pane class="notice-manage-list"
                     v-infinite-scroll="scrollBottom"
                     label="公告"
                     name="announcement">
          <notice ref="announcement"></notice>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>

<script>
import message from './Message'
import { throttle } from '@u/tool'
import notice from './Notice'

export default {
  name: 'NoticeManage',
  components: { message, notice },
  methods: {
    handleChangeTab () {
      this.notices = []
      this.scrollBottom(1)
    },
    scrollBottom (page) {
      const bottom = true
      if (this.activeTabName === 'message') {
        throttle(this.$refs.message.reqGetMessages(bottom), 500, true)
      }
      if (this.activeTabName === 'notice') {
        throttle(this.$refs.notice.reqData(page, this.activeTabName), 500, true)
      }
      if (this.activeTabName === 'announcement') {
        throttle(this.$refs.announcement.reqData(page, this.activeTabName), 500, true)
      }
    }
  },
  data () {
    return {
      activeTabName: 'message'
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tab-pane {
  padding: 20px 24px;
  box-sizing: border-box;
}
.notice-manage-list {
  height: calc(100vh - 100px);
  width: 100%;
  overflow: auto;
}
</style>
<style lang="scss">
.notice-manage {
  background-color: $color-f9;
  .el-tabs__header {
    height: 40px;
    margin-bottom: 0;
    box-sizing: border-box;
    .is-active {
      font-weight: bold;
    }
    .is-active:focus {
      outline: 0;
    }
  }
  .el-tabs__item {
    padding: 0;
    height: 40px;
    color: #666;
    font-weight: 400;
  }
  .el-tabs__active-bar {
    height: 2px;
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
  }
  .el-tabs__nav-scroll {
    padding: 0 24px;
  }
}
</style>
