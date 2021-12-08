<template>
  <div class='message-wrap'>
    <div class="between-row center-align">
      <el-radio-group v-model="messageStatus"
                      @change="resetReqData()">
        <el-radio-button label="01">未读</el-radio-button>
        <el-radio-button label="02">已读</el-radio-button>
      </el-radio-group>
      <div class="text-btn"
           v-show="messageStatus === '01' && messages.length > 0"
           @click="reqBatchReadMessage()">一键标为已读</div>
      <div class="text-btn"
           v-show="messageStatus === '02'&& messages.length > 0"
           @click="allDelete()">全部清除</div>
    </div>
    <div class="mt32 color-999"
         style="text-align:center"
         v-show="messages.length === 0">暂无内容</div>
    <div class="list">
      <transition-group name="list-show"
                        tag="ul">
        <div class="notice-item b"
             v-for="(item, index) in messages"
             :key="item.id">
          <div class="ft12 color-999 between-row">
            <span>{{dateFormatForMinutes(item.createTime)}}</span>
            <div @click="reqDeleteMessageById(item.id)">
              <svg-icon style="transform: scale(0.7);"
                        class="icon item-icon pointer"
                        icon="icon_guanbi">
              </svg-icon>
            </div>
          </div>
          <div class="bold mt12">
            {{item.title}}
          </div>
          <div class="color-666 mt4">
            {{item.content}}
          </div>
          <div class="text-btn mt12"
               @click="reqReadMessage(item.id, index)"
               v-show="messageStatus === '01'">标为已读</div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { dateFormatForMinutes } from '@u/date.js'
export default {
  name: 'Message',
  methods: {
    reqGetMessages (bottom) {
      if (bottom) {
        this.page++
      }
      const params = {
        pageNumber: this.page,
        pageSize: this.pageSize,
        messageStatus: this.messageStatus
      }
      this.$api.findMessageByPage(params).then(res => {
        if (!res || res.isError) return
        if (this.page === 1) {
          this.messages = res.content.items
        } else {
          this.messages.push.apply(this.messages, res.content.items)
        }
      })
    },
    reqReadMessage (id, index) {
      this.$api.readMessage({ id: id }).then(res => {
        if (!res || res.isError) return
        this.messages.splice(index, 1)
      })
    },
    reqBatchReadMessage () {
      const params = {
        ids: this.messages.map(item => item.id)
      }
      this.$api.batchReadMessage(params).then(res => {
        this.resetReqData()
      })
    },
    reqDeleteMessageById (id, index) {
      this.$api.deleteMessageById({ id: id }).then(res => {
        this.messages.splice(index, 1)
      })
    },

    allDelete () {
      this.$confirm('', '确定要清除当前页消息?', {
        confirmButtonText: '清除',
        cancelButtonClass: 'msg-box-cancel',
        confirmButtonClass: 'msg-box-confirm',
        customClass: 'custom-msg-box',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        center: true,
        showClose: false
      }).then(() => {
        this.reqBatchDeleteMessageByIds()
      }).catch(() => { })
    },
    reqBatchDeleteMessageByIds () {
      const params = {
        ids: this.messages.map(item => item.id)
      }
      this.$api.batchDeleteMessageByIds(params).then(res => {
        this.resetReqData()
      })
    },

    resetReqData () {
      this.page = 1
      this.reqGetMessages()
    }
  },
  data () {
    return {
      dateFormatForMinutes,
      page: 0,
      pageSize: 10,
      messageStatus: '01',
      messages: []
    }
  }
}
</script>

<style lang='scss' scoped>
.message-wrap {
  .notice-item {
    margin: 16px auto 0;
    width: 258px;
    background: #fff;
    box-sizing: border-box;
    padding: 16px;
    border-radius: 4px;
  }
  .list {
    overflow-y: scroll;
    overflow: hidden;
  }
}
</style>
