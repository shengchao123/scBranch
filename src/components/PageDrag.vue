<template>
  <div class='draggable-page row'>
    <div class="wrap row"
         ref="wrap">
      <section class="left"
               ref="left">
        <slot name="left"></slot>
      </section>

      <div class="bg-color center resize"
           ref="resize">
        <div class="icon ft30 color-999">
          <svg-icon icon="icon_ladongfa"></svg-icon>
        </div>
      </div>

      <section class="right flex1"
               ref="right">
        <slot name="right">
        </slot>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    minWidthL: {
      type: [String, Number],
      default: 250
    }
  },
  methods: {
    dragControllerDiv () {
      var resize = this.$refs.resize
      var left = this.$refs.left
      var right = this.$refs.right
      var wrap = this.$refs.wrap

      const that = this

      // 鼠标按下事件
      resize.onmousedown = function (e) {
        var startX = e.clientX
        resize.left = resize.offsetLeft
        // 鼠标拖动事件
        document.onmousemove = function (e) {
          var endX = e.clientX

          // (endx - startx）= 移动的距离。resize.left+移动的距离=左边区域最后的宽度
          var moveLen = resize.left + (endX - startX)
          // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
          var maxT = wrap.clientWidth - resize.offsetWidth
          // 左边区域的最小宽度为150px
          if (moveLen < +that.minWidthL) moveLen = +that.minWidthL
          // 右边区域最小宽度为150px
          if (moveLen > maxT - 150) moveLen = maxT - 150

          // 设置左侧区域的宽度
          resize.style.left = moveLen

          left.style.width = moveLen + 'px'
          right.style.width = (wrap.clientWidth - moveLen - 10) + 'px'
        }
        // 鼠标松开事件
        document.onmouseup = function (evt) {
          document.onmousemove = null
          document.onmouseup = null
          // 当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
          resize.releaseCapture && resize.releaseCapture()
        }
        // 该函数在属于当前线程的指定窗口里设置鼠标捕获
        resize.setCapture && resize.setCapture()
        return false
      }
    }
  },
  mounted () {
    this.dragControllerDiv()
  }
}
</script>

<style lang='scss' scoped>
.bg-color {
  background-color: #eeeeee;
}
.draggable-page {
  height: 100%;
  width: 100%;
  .wrap {
    height: 100%;
    width: 100%;
    .icon {
      cursor: col-resize;
    }
    .left {
      overflow-y: auto;
      width: calc(22% - 10px);
      height: 100%;
    }
    .resize {
      width: 6px;
      height: 100%;
    }
    .right {
      overflow-y: auto;
      height: 100%;
    }
  }
}
</style>
