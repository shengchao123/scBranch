<template>
  <div class="table-wrap">
    <section class="color-666">
      <div v-for="(first, firstIndex) in treeData"
           :key="firstIndex"
           class="first-box row">

        <div class="first center-align bb rb">
          <el-checkbox class="ml25"
                       v-if="$isEmpty(first.children)"
                       v-model="first.checked"
                       :disabled="checkedList.length >= max && !first.checked"
                       @change="e => checkChange(e, first.id)">{{first.name}}</el-checkbox>
          <span v-else
                class="ml50">{{first.name}}</span>
        </div>

        <section class="second-wrap"
                 :class="!$isEmpty(first.children) ? '' : 'bb'">
          <div v-for="(second, secondIndex) in first.children"
               :key="secondIndex"
               class="row">

            <div class="second bb rb">
              <el-checkbox class="ml25 mtb16"
                           v-if="$isEmpty(second.children)"
                           v-model="second.checked"
                           :disabled="checkedList.length >= max && !second.checked"
                           @change="e => checkChange(e, second.id)">{{second.name}}</el-checkbox>
              <p v-else
                 class="ml50 mtb16">{{second.name}}</p>
            </div>

            <section class="third bb">
              <div v-if="second.children">
                <el-checkbox v-for="(third, thirdIndex) in second.children"
                             :key="thirdIndex"
                             class="check-box"
                             v-model="third.checked"
                             :disabled="checkedList.length >= max && !third.checked"
                             @change="e => checkChange(e, third.id)">{{third.name}}</el-checkbox>
              </div>

            </section>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script>

export default {
  name: 'TreeTable',
  methods: {
    checkChange (checked, id) {
      if (checked) {
        this.checkedList.push(id)
      } else {
        const index = this.checkedList.indexOf(id)
        this.checkedList.splice(index, 1)
      }
      if (this.$isEmpty(this.checkedList)) return
      this.handleSystemMenu(this.systemMenu)
      this.$emit('update:checkList', this.checkedList)
    },

    // 处理菜单数据
    handleSystemMenu (children) {
      const arr = []
      if (!this.$isEmpty(children) && children.length > 0) {
        children.forEach(item => {
          if (this.checkedList.includes(item.id)) {
            item.checked = true
          } else {
            item.checked = false
          }
          item.children = this.handleSystemMenu(item.children)
          arr.push(item)
        })
      }
      return arr
    }
  },
  data () {
    return {
      checkedList: [],
      treeData: []
    }
  },
  created () {
    if (!window.localStorage.getItem('shortcutIds')) {
      this.checkedList = []
    } else {
      this.checkedList = window.localStorage.getItem('shortcutIds').split(',')
    }
    this.$emit('update:checkList', this.checkedList)
    this.treeData = this.handleSystemMenu(this.systemMenu)
  },

  computed: {
    systemMenu () {
      return this.$store.state.app.systemMenu
    }
  },
  watch: {
    systemMenu: {
      handler (o, n) {
        this.treeData = this.handleSystemMenu(this.systemMenu)
      },
      immediate: true
    }
  },
  props: ['checkList', 'max']
}
</script>

<style lang='scss' scoped>
.table-wrap {
  .first-box {
    .first {
      min-height: 50px;
      width: 176px;
      flex-shrink: 0;
    }
  }

  .second-wrap {
    flex: 1;
    .second {
      width: 295px;
    }
  }

  .third {
    padding: 16px 0;
    padding-left: 25px;
    flex: 1;
  }

  .mtb16 {
    margin: 16px 0;
  }

  .ml25 {
    margin-left: 25px;
  }

  .ml50 {
    margin-left: 50px;
  }
}
</style>
