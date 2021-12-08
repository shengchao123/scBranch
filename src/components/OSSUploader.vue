<template>
  <div class='uploader-wrap'>
    <!-- 上传 -->
    <el-upload class="upload-demo"
               action
               :on-preview="handlePreview"
               :before-remove="beforeRemove"
               :http-request="handleUpload"
               :show-file-list="showList"
               :file-list="fileList"
               :on-change="handleChange"
               :before-upload="beforeUpload">
      <el-button size="small"
                 type="primary">{{videoPath ? '重新上传':'上传视频'}}</el-button>
      <slot name="tip"></slot>
    </el-upload>
  </div>
</template>

<script>

import { guid } from '@/utils/tool.js'
import { aliOssConfig } from '@/request/urls.js' // NOTE: 使用上传视频需要oss参数  在urls里配置
import moment from 'moment'

export default {
  name: 'Uploader',
  methods: {
    handleProgress (e, file, fileList) {
      console.log('handleProgress', e)
    },
    handlePreview () {
    },
    handleChange (file, fileList) {
      const length = fileList.length
      this.fileList = fileList.slice(length - 1, length)
    },
    beforeRemove (file, fileList) {
      this.$emit('update:videoPath', '')
      this.$emit('getVideoPath', { remove: true })
    },
    // 视频上传之前判断
    beforeUpload (file) {
      console.log(file, '视频参数')
      this.showList = false
      const whiteList = ['video/mpeg', 'video/avi', 'video/navi', 'video/Aasf', 'video/wmv', 'video/mov', 'video/3gp', 'video/mp4']
      const isJPG = whiteList.includes(file.type)
      const temIsLtM = file.size / 1024 / 1024 / 1024 < 2
      const message = '上传视频大小不能超过 2G!'

      if (!isJPG) {
        this.$message.error('上传视频只能是 MPEG、AVI、nAVI、ASF、WMV、MOV、3GP、MP4 格式!')
        return false
      }
      if (!temIsLtM) {
        this.$message.error(message)
        return false
      }
      return isJPG && temIsLtM
    },

    handleUpload (option) {
      this.showList = true
      const that = this
      that.$emit('update:videoFlag', true)
      const OSS = require('ali-oss')
      const client = new OSS(aliOssConfig)
      const file = option.file
      const nameList = file.name.split('.')
      const fileSuffix = nameList.pop()
      const date = moment().format('YYYYMMDD')
      const fileName = 'material/video/' + date + guid() + '.' + fileSuffix
      console.log(fileName)
      client.multipartUpload(fileName, file, {
        progress: function (p) { // 获取进度条的值
          const num = p.toFixed(2)
          that.$emit('update:videoUploadPercent', num * 100)
        }
      }).then(result => {
        // 下面是如果对返回结果再进行处理，根据项目需要
        const temPath = result.res.requestUrls[0].split('?')
        that.$emit('update:videoPath', temPath[0])
        that.$emit('update:videoFlag', false)
        this.$emit('getVideoPath', temPath[0])
      }).catch(err => {
        console.log('err:', err)
      })
    }
  },
  data () {
    return {
      fileList: [],
      showList: false
    }
  },
  props: {
    videoPath: {
      type: String
    },
    videoUploadPercent: {
      type: Number
    },
    videoFlag: {
      type: Boolean
    }
  }
}
</script>

<style lang='scss' scoped>
.uploader-wrap {
  /deep/.el-upload {
    display: flex;
    flex-direction: row;
  }
}
</style>
