<template>
  <div class='orgs-wrap'>
    <el-tree :data="orgs"
             icon-class='el-icon-arrow-right'
             :check-on-click-node="false"
             node-key="id"
             ref="treeBox"
             :highlight-current="true"
             :current-node-key="platformOrg.id"
             :default-expanded-keys="[platformOrg.id]"
             :expand-on-click-node="false"
             :props="defaultProps"
             @node-click="onNodeClick">
      <span slot-scope="{ node, data }">
        <div class="tree-label-container">
          <svg-icon icon="group-manage"
                    v-if="data.icon"></svg-icon>
          <span class="tree-label color-333">{{node.label}}</span>
        </div>
      </span>
    </el-tree>
  </div>
</template>

<script>
export default {
  name: 'Orgs',
  methods: {
    onNodeClick (node) {
      this.$store.commit('platform/SET_CURRENT_ORGANIZATION', {
        id: node.id,
        name: node.name
      })
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'child',
        label: 'name'
      }
    }
  },
  created () {
    this.$store.dispatch('platform/setPlatformTree')
  },
  updated () {
    this.$nextTick(() => {
      this.$refs.treeBox.setCurrentKey(this.platformOrg.id)
    })
  },
  computed: {
    orgs () {
      return this.$store.state.platform.orgs
    },
    platformOrg () {
      return this.$store.state.platform.platformOrg
    }
  }
}
</script>

<style lang='scss' scoped>
.orgs-wrap {
  overflow-y: auto;
  width: calc(100% - 30px);
  padding: 10px 20px 10px 10px;
  /deep/ .el-tree-node__content {
    height: 36px;
  }
  .tree-label {
    padding-left: 7px;
    padding-top: 5px;
  }
}
</style>
