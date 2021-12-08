<template>
  <div class='info-look-wrap'>
    <div v-for="(item,index) in detailProp"
         :key="index"
         class="mb16">
      <span class="color-999">{{item.name}}：</span>
      {{detailText(item.prop)}}
    </div>
  </div>
</template>

<script>

export default {
  name: 'InfoLook',
  data () {
    return {
      detailProp: Object.freeze([
        {
          prop: 'orgName',
          name: '用户组织归属'
        },
        {
          prop: 'roleName',
          name: '用户角色'
        },
        {
          prop: 'name',
          name: '用户姓名'
        },
        {
          prop: 'sex',
          name: '用户性别'
        },
        {
          prop: 'phone',
          name: '用户手机号'
        },
        {
          prop: 'jobNo',
          name: '员工工号'
        },
        {
          prop: 'createTime',
          name: '创建时间'
        },
        {
          prop: 'creatorName',
          name: '创建人'
        },
        {
          prop: 'modifyTime',
          name: '编辑信息'
        }
      ])
    }
  },
  computed: {
    detailText () {
      return function (val) {
        const { sex, createTime, creatorName, modifyTime, roleDTOS } = this.userInfo
        if (val === 'sex') {
          return sex === 1 ? '男' : '女'
        }
        if (val === 'createTime') {
          return this.$moment(createTime).format('YYYY-MM-DD HH:mm:ss')
        }
        if (val === 'modifyTime') {
          return creatorName + '，' + this.$moment(modifyTime).format('YYYY-MM-DD HH:mm:ss')
        }
        if (val === 'roleName') {
          return roleDTOS && Array.from(roleDTOS, ({ name }) => name).join('，')
        }
        return this.userInfo[val] || '--'
      }
    }
  },
  props: {
    userInfo: Object
  }
}
</script>

<style lang='scss' scoped>
.info-look-wrap {
  padding-left: 86px;
}
</style>
