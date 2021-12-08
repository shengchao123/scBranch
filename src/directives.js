import Vue from 'vue'
import { Message } from 'element-ui'
const MyPlugin = {}
export default MyPlugin.install = function (vue, options) {
  // 点击防抖，防止重复点击提交按钮等操作
  Vue.directive('debounce', {
    inserted (el, binding) {
      let timer
      el.addEventListener('keyup', () => {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          binding.value()
        }, 1000)
      })
    }
  })

  // 饿了么自带 select，触底加载
  Vue.directive('el_select_loadmore', {
    bind (el, binding) {
      const SELECT_WRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
      SELECT_WRAP_DOM.addEventListener('scroll', function () {
        const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
        if (CONDITION) {
          binding.value()
        }
      })
    }
  })

  // div，滑动加载
  Vue.directive('loadmore', {
    bind (el, binding) {
      el.addEventListener('scroll', function () {
        const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
        if (CONDITION) {
          binding.value()
        }
      })
    }
  })

  // 元素加载聚焦
  Vue.directive('focus', {
    inserted: function (el) {
      el.focus()
    }
  })

  // 动态复制内容
  Vue.directive('copy', {
    bind (el, { value }) {
      el.$value = value
      el.handler = () => {
        if (!el.$value) {
          // 值为空的时候，给出提示。可根据项目UI仔细设计
          console.log('无复制内容')
          return
        }
        // 动态创建 textarea 标签
        const textarea = document.createElement('textarea')
        // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
        textarea.readOnly = 'readonly'
        textarea.style.position = 'absolute'
        textarea.style.left = '-9999px'
        // 将要 copy 的值赋给 textarea 标签的 value 属性
        textarea.value = el.$value
        // 将 textarea 插入到 body 中
        document.body.appendChild(textarea)
        // 选中值并复制
        textarea.select()
        const result = document.execCommand('Copy')
        if (result) {
          Message.success('复制成功')
        }
        document.body.removeChild(textarea)
      }
      // 绑定点击事件，就是所谓的一键 copy 啦
      el.addEventListener('click', el.handler)
    },
    // 当传进来的值更新的时候触发
    componentUpdated (el, { value }) {
      el.$value = value
    },
    // 指令与元素解绑的时候，移除事件绑定
    unbind (el) {
      el.removeEventListener('click', el.handler)
    }
  })

  // 动态复制内容
}

// 全局注册指令
Vue.use(MyPlugin)
