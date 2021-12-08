<template>
  <div class='page-upload-img-wrap center-align'>
    <div v-if="useConfig.type === 'small'"
         class="center-align">
      <el-image v-if="imgUrl"
                :style="imgSize"
                :fit="useConfig.imgFit"
                :class="useConfig.isCircle && 'circle'"
                :src="$fileHost + imgUrl"></el-image>
      <div v-else
           class="border center"
           :class="useConfig.isCircle && 'circle'"
           :style="imgSize">
        <svg-icon icon="icon_tupian"
                  class="color-999 ft20"></svg-icon>
      </div>
      <el-upload class="ml16"
                 :http-request="reqUpload"
                 action=""
                 :accept="useConfig.accept"
                 :before-upload="beforeUpload"
                 :show-file-list="false">
        <span class="text-btn">{{handleText}}</span>
      </el-upload>
    </div>
    <div v-else>
      <div v-if="imgUrl"
           class="img-box"
           :style="imgSize">
        <el-image :style="imgSize"
                  :fit="useConfig.imgFit"
                  :src="$fileHost + imgUrl"></el-image>
        <el-upload class="center pointer"
                   :http-request="reqUpload"
                   action=""
                   :accept="useConfig.accept"
                   :before-upload="beforeUpload"
                   :show-file-list="false">
          <div class="reUpload-btn pointer center">
            <span>重新上传</span>
          </div>
        </el-upload>
      </div>
      <el-upload v-else
                 class="center pointer"
                 :http-request="reqUpload"
                 action=""
                 :accept="useConfig.accept"
                 :before-upload="beforeUpload"
                 :show-file-list="false">
        <div class="center column color-999 border"
             :style="imgSize">
          <svg-icon icon="icon_tupian"
                    :fontSize="useConfig.iconSize + 'px'"
                    class="upload-icon"></svg-icon>
          <div class="text-btn mt8"
               style="line-height: 14px">{{handleText}}</div>
        </div>
      </el-upload>
    </div>
    <div class="description ft12 color-999 ml16">
      <p>支持图片格式：{{formatText}}</p>
      <p>图片大小：{{useConfig.sizeText}}</p>
      <div>
        <p v-for="(item, index) in useConfig.descriptionList"
           :key="index">{{item.label}}：{{item.text}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadImg',
  methods: {
    beforeUpload (file) {
      const { sizeRoom, sizeUnit, accept } = this.useConfig

      const whiteList = accept.split(',').map(el => 'image/' + el.split('.')[1]) // ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp']
      const isJPG = whiteList.includes(file.type)

      const size = file.size / 1024
      let [minSize, maxSize] = sizeRoom
      let [minUnit, maxUnit] = [sizeUnit, sizeUnit]
      let [minFileSize, maxFileSize] = [size, size]
      if (typeof (minSize) === 'string') {
        [minSize, maxSize] = sizeRoom.map(el => parseInt(el));
        [minUnit, maxUnit] = sizeRoom.map(el => el.replace(/[^a-z]+/gi, '').toUpperCase());
        [minFileSize, maxFileSize] = [minUnit, maxUnit].map(el => el === 'M' ? size / 1024 : size)
      } else {
        if (sizeUnit === 'M') {
          minFileSize = maxFileSize = size / 1024
        }
      }
      let isBeyond = false
      let errorMsg = ''
      const minMsg = minSize + minUnit
      const maxMsg = maxSize + maxUnit
      if (minSize && maxSize) {
        isBeyond = minFileSize < minSize || maxFileSize > maxSize
        errorMsg = `不能小于${minMsg}且不能大于${maxMsg}`
      } else if (minSize) {
        isBeyond = minFileSize < minSize
        errorMsg = `不能小于${minMsg}`
      } else if (maxSize) {
        isBeyond = maxFileSize > maxSize
        errorMsg = `不能大于${maxMsg}`
      }

      if (!isJPG) {
        this.$message.error(`上传图片只能是 ${this.formatText} 格式`)
        return false
      }
      if (isBeyond) {
        this.$message.error(`上传图片大小${errorMsg}`)
        return false
      }
      return isJPG && !isBeyond
    },
    reqUpload (e) {
      const config = {
        file: e.file,
        ...this.useConfig.uploadFileParams
      }
      this.$api.uploadFile(config).then(res => {
        if (res.isError) return
        this.$emit('update:imgUrl', res[0])
        this.$emit('success', res[0])
      })
    }
  },
  data () {
    return {

    }
  },
  props: {
    imgUrl: {
      type: String
    },
    config: {
      type: Object,
      default: () => { return {} }
    }
  },
  computed: {
    useConfig () {
      const config = this.config
      const initConfig = {
        width: 56, // 宽度
        height: 56, // 高度
        sizeRoom: [0, 1], // 大小限制  也可这种形式 ['200KB', '5M']
        sizeUnit: 'M', // 大小单位 M / KB
        isCircle: false, // 是否圆形
        type: 'small', // 图片上传组件类型  'small'、'medium'
        imgFit: 'fill', // el-image 组件 fit 属性  fill / contain / cover / none / scale-down
        iconSize: 44, // 图标大小
        accept: '.jpg, .png, .jpeg', // 可上传图片类型
        uploadFileParams: { uploadType: 'l' }, // 图片上传 参数
        sizeText: '不大于1M', // 图片大小描述
        descriptionList: [] // 其他描述 {label: '尺寸大小', text: '88*88px'}
      }
      if (config.sizeUnit) config.sizeUnit.toUpperCase()
      return { ...initConfig, ...config }
    },
    formatText () {
      const acceptList = this.useConfig.accept.split(',')
      const formatList = acceptList.map(el => el.split('.')[1].toUpperCase())
      return formatList.join('/')
    },
    imgSize () {
      const { width, height } = this.useConfig
      return { width: width + 'px', height: height + 'px', borderRadius: '4px', overflow: 'hidden' }
    },
    handleText () {
      return this.imgUrl ? '重新上传' : '上传图片'
    }
  }
}
</script>

<style lang='scss' scoped>
.page-upload-img-wrap {
  .img-box {
    border-radius: 4px;
    cursor: pointer;
    position: relative;
  }
  .reUpload-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 24px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 0 0 4px 4px;
    color: #fff;
  }
  .border {
    border: 1px solid #dedede;
    border-radius: 4px;
    background: #ffffff;
    box-sizing: border-box;
  }
  .description {
    line-height: 22px;
    p {
      line-height: 22px;
    }
  }
  .circle {
    border-radius: 50% !important;
  }
  // img {
  //   width: 100%;
  //   height: 100%;
  // }
}
</style>
