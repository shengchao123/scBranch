<template>
  <div class="log-manage relative">
    <div>
      <div class="ft16 bold">日志</div>
      <div class="mt16">本次登录有{{logList.length}}条新的操作日志</div>
      <div class="log-manage-item mt16"
           v-for="item in logList"
           :key="item.id">
        <div class="item-title bold mb4">{{item.operationType}}</div>
        <div class="color-666 mb8">{{item.userName}}{{item.operationType}}了【{{item.controllerDesc}}】数据</div>
        <div class="ft12 color-999">{{formatTime(item.endTime)}}</div>
      </div>
    </div>
  </div>

</template>

<script>
import { parseTime } from '@u/date.js'

export default {
  name: 'LogManage',
  data () {
    return {
      logList: []
    }
  },
  created () {
    this.userLogsByCurrentLogin()
  },
  methods: {
    userLogsByCurrentLogin () {
      this.$api.userLogsByCurrentLogin().then(res => {
        if (res.isError) return
        this.logList = res.content
      })
    },
    formatTime (time) {
      if (!time) {
        return ''
      }
      if (isToday(time)) {
        // 小于一天
        return parseTime(time, '{h}:{i}:{s}')
      } else {
        return parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}')
      }
    }
  }
}
function isToday (str) {
  if (new Date(str).toDateString() === new Date().toDateString()) {
    // 今天
    return true
  } else if (new Date(str) < new Date()) {
    // 之前
    return false
  }
}

</script>

<style lang="scss" scoped>
.mb6 {
  margin-bottom: 6px;
}
.log-manage {
  background-color: $color-f9;
  height: calc(100vh - #{$navbarHeight});
  width: 100%;
  padding: 21px 24px;
  box-sizing: border-box;
  overflow: auto;
}
.log-manage-item {
  width: 258px;
  box-sizing: border-box;
  padding: 14px 17px;
  background: #ffffff;
  border: 1px solid #ececef;
  border-radius: 4px;
}
.look-more {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #dedede;
  border-radius: 4px;
}
</style>
