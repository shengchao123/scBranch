<template>
  <div class='notice-wrap'>
    <div class="notice-item b"
         v-for="item in notices"
         :key="item.id">
      <div class="between-row center-align">
        <div class="bold"
             :class="item.failure ? 'color-999':''">
          {{item.title}}
        </div>
        <div class="lose-text"
             v-if="item.failure">
          已失效
        </div>
      </div>
      <div class="ft12 color-999 mt4">
        <span>{{dateFormatForMinutes(item.endDate)}}</span>
      </div>
      <div class="color-666 mt4"
           style="word-break: break-word;"
           :class="item.failure && 'color-999'">
        {{item.content}}
      </div>
    </div>

    <div class="mt32 color-999"
         style="text-align:center"
         v-show="notices.length === 0">暂无内容</div>
  </div>
</template>

<script>
import { dateFormatForMinutes } from '@u/date.js'

export default {
  name: 'Notice',
  methods: {
    reqData (page, activeTabName) {
      !this.$isEmpty(page) ? this.page = page : this.page++
      this.reqNoticesData(activeTabName)
    },
    // 通知公告请求
    reqNoticesData (activeTabName) {
      const params = {
        pageNumber: this.page,
        pageSize: this.pageSize
      }
      const temApi = activeTabName === 'notice' ? 'findNotificationPage' : 'findNoticePage'
      this.$api[temApi](params).then(res => {
        if (res.isError) return
        if (this.page === 1) {
          this.notices = res.content.items
        } else {
          if (this.$isEmpty(res.content.items)) return
          this.notices.push.apply(this.notices, res.content.items)
        }
      })
    }
  },
  data () {
    return {
      dateFormatForMinutes,
      page: 1,
      pageSize: 10,
      notices: []
    }
  }
}
</script>

<style lang='scss' scoped>
.notice-wrap {
  .notice-item {
    margin: 16px auto 0px;
    width: 258px;
    background: #fff;
    box-sizing: border-box;
    padding: 16px;
    border-radius: 4px;
    &:first-child {
      margin-top: 0px !important;
    }
  }

  .lose-text {
    padding: 2px 3px;
    border-radius: 2px;
    background: $color-999;
    height: 15px;
    font-size: 11px;
    color: #ffffff;
  }
}
</style>
