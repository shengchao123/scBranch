<template>
  <div class='info-wrap'>
    <div class="center-align img-container w100">
      <span class="label-left">组织logo：</span>
      <el-image class="logo-image center"
                :src="orgInfo.logoImg ? $fileHost + orgInfo.logoImg : ''">
        <div slot="error"
             class="image-slot center">
          <svg-icon class="color-999 ft20"
                    icon="icon_tupian"></svg-icon>
        </div>
      </el-image>
    </div>
    <div class="mt32 w50">
      <span class="label-left">组织名称：</span>
      {{orgInfo.name}}
    </div>
    <div class="mt32 w50">
      <span class="label-right">上级组织归属：</span>
      {{orgInfo.parentOrgName}}
    </div>
    <div class="mt32 w50">
      <span class="label-left">组织角色：</span>
      {{orgInfo.moduleRoleName}}
    </div>

    <div class="mt32 w50">
      <span class="label-right">组织类型：</span>
      {{orgInfo.orgClassName}}
    </div>
    <div class="mt32 w50">
      <span class="label-left mr30">组织编码：</span>
      {{orgInfo.orgNo}}
    </div>
    <div class="mt32 w50">
      <span class="label-right">组织标签：</span>
      {{orgInfo.orgLabels}}
    </div>
    <div class="mt32 w100">
      <span class="label-left">组织地址：</span>
      {{orgInfo.address}}
    </div>
    <div class="mt32 w50">
      <span class="label-left">联系人：</span>
      {{orgInfo.contactPerson}}
    </div>
    <div class="mt32 w50">
      <span class="label-right">联系电话：</span>
      {{orgInfo.tel}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Info',
  props: {
    orgInfo: Object
  }
}
</script>

<style lang='scss' scoped>
.w50 {
  width: 50%;
}
.w100 {
  width: 100%;
}
.info-wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 800px;
  padding-top: 60px;
  margin: 0 auto;
  .img-container {
    line-height: 56px;
    .logo-image {
      width: 56px;
      height: 56px;
      border: 1px solid #e6e5ea;
      border-radius: 44px;
      font-size: 44px;
      color: #e6e5ea;
      line-height: 56px;
    }
  }
  .label-left {
    color: #999999;
    width: 74px;
    display: inline-block;
  }
  .label-right {
    color: #999999;
    width: 98px;
    display: inline-block;
  }
}
</style>
