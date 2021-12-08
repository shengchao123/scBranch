<template>
  <page title="组件使用方法">
    <!-- 页面初始化 -->
    <el-card class="box-card mt16">
      <div slot="header"
           class="clearfix">
        <span class="bold ft20">页面初始化</span>
      </div>

      <div>
        vue 页面代码结构初始化
        快捷键 <span class="bold">wpage</span>，创建方式在 <span class="bold">.vscode，snippets.md</span> 文件中
      </div>
    </el-card>

    <el-select v-model="model"
               placeholder="">

    </el-select>
    <!-- 按钮类型 -->
    <el-card class="box-card mt16">
      <div slot="header"
           class="clearfix">
        <span class="bold ft20">各种按钮使用方式（点击按钮复制）</span>
      </div>

      <el-button type="primary"
                 v-copy="copyText.primaryBtn">主要按钮</el-button>
      <el-button class="secondary-btn"
                 v-copy="copyText.secondaryBtn">次级按钮</el-button>
      <el-button class="plain-btn"
                 v-copy="copyText.plainBtn">普通按钮</el-button>
      <span class="text-btn ml16"
            v-copy="copyText.textBtn">文字按钮</span>

    </el-card>

    <!-- 弹框 -->
    <el-card class="box-card mt16">
      <div slot="header"
           class="clearfix">
        <span class="bold ft20 mr20">dialog 弹框</span>
        <el-button class="plain-btn"
                   v-copy="copyText.dialog">复制内容</el-button>
      </div>

      <!-- 个人信息弹窗 -->
      <el-button type="primary"
                 @click="onShowDialog">显示弹框</el-button>
      <el-dialog :title="dialog.title"
                 width="456px"
                 :close-on-click-modal="false"
                 :modal-append-to-body="false"
                 :close-on-press-escape="false"
                 :visible.sync="dialog.show">
        我是内容
        <div slot="footer">
          <el-button type="primary"
                     @click="dialog.show = false">确定</el-button>
          <el-button @click="dialog.show = false"
                     class="plain-btn">取消</el-button>
        </div>
      </el-dialog>

    </el-card>

    <!-- 表单组件格式 -->
    <el-card class="box-card mt16">
      <div slot="header"
           class="clearfix">
        <span class="bold ft20">表单组件格式</span>
        <el-button class="plain-btn ml20"
                   v-copy="copyText.form">复制内容</el-button>
        <div class="mt20">
          <div>1. 左侧没有星星，但是需要跟有星星的对齐</div>
          <div class="mt8">2. 输入框长度有 w120, w240</div>
          <div class="mt8">3. 表单相关数据全部放入 form 对象中 form {data: {}, rules: {}}</div>
        </div>
      </div>
      <el-form ref="form"
               :model="form.data"
               :rules="form.rules"
               label-position="left"
               label-width="120px">
        <el-form-item prop="name">
          <div slot="label"
               class="ml12">姓名 w120</div>
          <el-input v-model="form.data.name"
                    maxlength="64"
                    class="w120"
                    show-word-limit
                    placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item label="标题 w240"
                      required
                      prop="title">
          <el-input v-model="form.data.title"
                    class="w240"
                    placeholder="请输入标题"></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格封装 -->
    <el-card class="box-card mt16">
      <div slot="header"
           class="clearfix">
        <span class="bold ft20">Table 表格封装</span>
        <el-button class="plain-btn ml20"
                   v-copy="copyText.table">复制内容</el-button>
        <div class="mt20">
          <div>1. 状态不好，需要红字显示 用 cellClassName 属性</div>
          <div class="mt8"> 2. table 相关配置放入 table 对象中 table: {data: {}, rules: {}}</div>
          <div class="mt8"> 3. 是否显示表格序号 isShowIndex</div>
          <div class="mt8"> 4. 是否显示加载中 isLoading</div>
          <div class="mt8"> 5. 列表更换页面请求，序号请求，用 getTableData</div>
        </div>
      </div>

      <!-- table -->
      <page-table :data="table.data"
                  :cellClassName="cellClassName"
                  :col-configs="table.colConfig"
                  :pageNumber.sync="search.pageNumber"
                  :pageSize.sync="search.pageSize"
                  :total="table.total"
                  :emptyText="emptyText('XX')"
                  tooltip-effect="light"
                  :isLoading="table.isLoading"
                  :isShowIndex="table.isShowIndex"
                  @getTableData="getTableData">
        <el-table-column slot="operate"
                         label="操作"
                         width="150">
          <template slot-scope="scope">
            <span class="text-btn ml16">详情</span>
            <el-popconfirm title="`要该体系?`"
                           cancelButtonType=""
                           confirmButtonText="启用停用"
                           hideIcon
                           @confirm="onConfirm">
              <span class="text-btn ml16"
                    slot="reference">禁用</span>
            </el-popconfirm>
          </template>
        </el-table-column>
      </page-table>
    </el-card>

    <!-- 确认弹框 -->
    <el-card class="box-card mt16">
      <div slot="header"
           class="clearfix">
        <span class="bold ft20">确认弹框</span>
      </div>
      <div class="mt16">
        <el-button type="primary"
                   @click="onConfirmSingle">单行内容确认框</el-button>
        <el-button class="plain-btn ml20"
                   v-copy="copyText.confirmSingle">复制内容</el-button>
      </div>
      <div class="mt16">
        <el-button type="primary"
                   @click="onConfirmDouble">两行内容确认框</el-button>
        <el-button class="plain-btn ml20"
                   v-copy="copyText.confirmDouble">复制内容</el-button>
      </div>
      <div class="mt16">
        <el-button type="primary"
                   @click="onConfirmSingleIcon"> 带icon。一行内容确认框</el-button>
        <el-button class="plain-btn ml20"
                   v-copy="copyText.confirmSingleIcon">复制内容</el-button>
      </div>
      <div class="mt16">
        <el-button type="primary"
                   @click="onConfirmDoubleIcon"> 带icon。两行内容确认框</el-button>
        <el-button class="plain-btn ml20"
                   v-copy="copyText.confirmDoubleIcon">复制内容</el-button>
      </div>
    </el-card>

    <!-- 图片上传组件 -->
    <el-card class="box-card mt16">
      <div slot="header"
           class="clearfix">
        <span class="bold ft20">图片上传</span>
      </div>
      <page-upload-img :imgUrl.sync="form.data.smallImg"></page-upload-img>
      <div class="mt16">
        <page-upload-img :imgUrl.sync="form.data.smallImg"
                         :config="uploadSmallImgConfig"></page-upload-img>
      </div>
      <div class="mt16">
        <page-upload-img :imgUrl.sync="form.data.mediumImg"
                         :config="uploadMediumImgConfig"></page-upload-img>
      </div>
    </el-card>
    <page-handle></page-handle>
    <!-- 搜索组件 -->
    <el-card class="box-card mt16">
      <div slot="header"
           class="clearfix">
        <span class="bold ft20">页面筛选项</span>
      </div>
      <page-search class="mt16"
                   :btnItems="btnItems"
                   :formOptions="formOptions"
                   @onInquire="onInquire"
                   @onReset="onReset"></page-search>
    </el-card>
  </page>
</template>

<script>

import { timeFormat } from '@u/formatter.js'
import pageTable from '@/components/PageTable'
import pageSearch from '@c/PageSearch/index'
import PageUploadImg from '@/components/PageUploadImg'
import tableMixin from '@/mixins/table.js'
import pageHandle from '@/components/PageHandle'

export default {
  name: 'Example',
  methods: {
    onInquire () {

    },
    onReset () { },
    // 表格中，状态不好的，红色特殊字显示
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      if (row.status === -2) {
        if (columnIndex === 5) {
          return 'error-color'
        } else {
          return 'color-999'
        }
      }
      return ''
    },
    // 表格请求数据
    getTableData () {

    },
    // 点击显示弹框
    onShowDialog () {
      this.dialog.show = true
    },
    onConfirmSingle () {
      this.$confirm('', '单行内容', {
        confirmButtonText: '确定',
        customClass: 'custom-msg-box',
        cancelButtonClass: 'msg-box-cancel',
        confirmButtonClass: 'msg-box-confirm',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        center: true,
        showClose: false
      }).then(() => {
      }).catch(() => { })
    },
    onConfirmSingleIcon () {
      this.$confirm('', '单行内容带有icon', {
        confirmButtonText: '确定',
        customClass: 'custom-msg-box',
        cancelButtonClass: 'msg-box-cancel',
        confirmButtonClass: 'msg-box-confirm',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning',
        center: true,
        showClose: false
      }).then(() => {
      }).catch(() => { })
    },
    onConfirmDouble () {
      this.$confirm('两行内容', '标题', {
        confirmButtonText: '确定',
        customClass: 'custom-msg-box msg-box-double',
        cancelButtonClass: 'msg-box-cancel',
        confirmButtonClass: 'msg-box-confirm',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        center: true,
        showClose: false
      }).then(() => {
      }).catch(() => { })
    },
    onConfirmDoubleIcon () {
      this.$confirm('两行内容', '带 Icon 内容', {
        confirmButtonText: '确定',
        customClass: 'custom-msg-box msg-box-double msg-box-icon',
        cancelButtonClass: 'msg-box-cancel',
        confirmButtonClass: 'msg-box-confirm',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning',
        center: true,
        showClose: false
      }).then(() => {
      }).catch(() => { })
    }
  },
  components: { pageTable, PageUploadImg, pageSearch, pageHandle },
  mixins: [tableMixin],
  data () {
    const changeFunction = (val, key) => {
      this.search[key] = val
    }
    const statusOption = Object.freeze([
      {
        name: '已启用',
        id: 1
      },
      {
        name: '已停用',
        id: -1
      }
    ])
    return {
      // 返回按钮配置
      pageHandleConfig: {

      },

      // 弹框数据
      dialog: {
        title: '新增标题',
        show: false
      },
      // form 数据
      form: {
        rules: Object.freeze({
          inputValue: [
            { required: true, trigger: 'change' }
          ]
        }),
        data: {
          smallImg: '',
          mediumImg: ''
        }
      },
      formOptions: [
        {
          label: '类型名称',
          placeholder: '输入类型名称',
          prop: 'anesthesiaTypeName',
          value: '',
          element: 'el-input',
          disabled: true,
          events: {
            change (val) {
              changeFunction(val, 'anesthesiaTypeName')
            }
          },
          style: {
            width: '160px'
          }
        },
        {
          label: '标签',
          prop: 'anesthesiaTypeLabelName',
          element: 'el-select',
          value: '',
          options: [],
          clearable: true,
          events: {
            change (val) {
              changeFunction(val, 'anesthesiaTypeLabelName')
            }
          },
          style: {
            width: '160px'
          }
        },
        {
          label: '状态',
          prop: 'anesthesiaTypeStatus',
          element: 'el-select',
          value: '',
          clearable: true,
          options: statusOption,
          events: {
            change (val) {
              changeFunction(val, 'anesthesiaTypeStatus')
            }
          },
          style: {
            width: '160px'
          }
        }
      ],
      btnItems: 'inquire,reset',
      // 表格数据
      table: {
        colConfig: Object.freeze([
          {
            prop: 'code',
            label: '广告编码'
          },
          {
            prop: 'name',
            label: '广告时间，有格式化',
            formatter: timeFormat
          },
          {
            slot: 'operate'
          }
        ])
      },
      // 上传头像配置
      uploadSmallImgConfig: Object.freeze({
        isCircle: true,
        uploadFileParams: { uploadType: 'a' },
        descriptionList: [
          {
            label: '尺寸大小',
            text: '不小于88*88px'
          }
        ]
      }),
      // 上传图片配置
      uploadMediumImgConfig: Object.freeze({
        width: 328,
        height: 140,
        type: 'medium',
        sizeRoom: ['200KB', '5M'],
        sizeText: '不小于200KB且不大于5M',
        accept: '.jpg, .png, .jpeg, .gif, .bmp',
        uploadFileParams: { uploadType: 'm', fileType: 2 },
        descriptionList: [
          {
            label: '尺寸大小',
            text: '不小于1175*500px'
          },
          {
            label: '宽高比例',
            text: '2.35:1'
          }
        ]
      }),
      // 按钮，点击复制内容
      copyText: {
        primaryBtn: '<el-button type="primary">主要按钮</el-button>',
        secondaryBtn: '<el-button class="secondary-btn">次级按钮</el-button>',
        plainBtn: '<el-button class="plain-btn">普通按钮</el-button>',
        textBtn: '<span class="text-btn ml16">文字按钮</span>',
        dialog: `
      <el-dialog :title="dialog.title"
                 width="456px"
                 :close-on-click-modal="false"
                 :modal-append-to-body="false"
                 :close-on-press-escape="false"
                 :visible.sync="dialog.show">
        我是内容
        <div slot="footer">
          <el-button type="primary"
                     @click="dialog.show = false">确定</el-button>
          <el-button @click="dialog.show = false"
                     class="plain-btn">取消</el-button>
        </div>
      </el-dialog>`,
        form: `<el-form ref="form"
               :model="form.data"
               :rules="form.rules"
               label-position="left"
               label-width="120px">
        <el-form-item prop="name">
          <div slot="label"
               class="ml12">姓名 w120</div>
          <el-input v-model="form.data.name"
                    maxlength="64"
                    class="w120"
                    show-word-limit
                    placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item label="标题 w240"
                      required
                      prop="title">
          <el-input v-model="form.data.title"
                    class="w240"
                    placeholder="请输入标题"></el-input>
        </el-form-item>
      </el-form>`,
        table: `<page-table :data="table.data"
                  :cellClassName="cellClassName"
                  :col-configs="table.colConfig"
                  :pageNumber.sync="search.pageNumber"
                  :pageSize.sync="search.pageSize"
                  :total="table.total"
                  :emptyText="emptyText('XX')"
                  tooltip-effect="light"
                  :isLoading="table.isLoading"
                  :isShowIndex="table.isShowIndex"
                  @getTableData="getTableData">
        <el-table-column slot="operate"
                         label="操作"
                         width="150">
          <template slot-scope="scope">
            <span class="text-btn ml16">详情</span>
            <el-popconfirm title="体系"
                           cancelButtonType=""
                           confirmButtonText="启用停用"
                           hideIcon
                           @confirm="onConfirm">
              <span class="text-btn ml16"
                    slot="reference">禁用</span>
            </el-popconfirm>
          </template>
        </el-table-column>
      </page-table>`,
        confirmDoubleIcon: `this.$confirm('两行内容', '带 Icon 内容', {
        confirmButtonText: '确定',
        customClass: 'custom-msg-box msg-box-double msg-box-icon',
        cancelButtonClass: 'msg-box-cancel',
        confirmButtonClass: 'msg-box-confirm',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning',
        center: true,
        showClose: false
      }).then(() => {
      }).catch(() => { })`,
        confirmSingleIcon: `this.$confirm('', '单行内容带有icon', {
        confirmButtonText: '确定',
        customClass: 'custom-msg-box',
        cancelButtonClass: 'msg-box-cancel',
        confirmButtonClass: 'msg-box-confirm',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning',
        center: true,
        showClose: false
      }).then(() => {
      }).catch(() => { })`,
        confirmSingle: `this.$confirm('', '单行内容', {
        confirmButtonText: '确定',
        customClass: 'custom-msg-box',
        cancelButtonClass: 'msg-box-cancel',
        confirmButtonClass: 'msg-box-confirm',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        center: true,
        showClose: false
      }).then(() => {
      }).catch(() => { })`,
        confirmDouble: `this.$confirm('两行内容', '标题', {
        confirmButtonText: '确定',
        customClass: 'custom-msg-box msg-box-double',
        cancelButtonClass: 'msg-box-cancel',
        confirmButtonClass: 'msg-box-confirm',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        center: true,
        showClose: false
      }).then(() => {
      }).catch(() => { })`
      }

    }
  },
  created () {
    this.getTableData()
  }
}
</script>

<style lang='scss' scoped>
.example-wrap {
}
</style>
