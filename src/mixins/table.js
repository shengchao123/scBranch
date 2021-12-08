const table = {
  data () {
    return {
      search: {
        pageNumber: 1,
        pageSize: 10
      },
      table: {
        data: [],
        total: 0,
        isLoading: false
      }
    }
  },
  methods: {
  },
  computed: {
    emptyText () {
      return function (msg) {
        this.$deleteObjectEmptyAttr(this.search)
        const hasOtherKeys = Object.keys(this.search).length > 2
        if (hasOtherKeys) return '暂未找到相关信息'
        const emptyText = this.$isEmpty(msg) ? '暂无相关信息' : `暂无${msg}信息，请先点击“新增${msg}”按钮新增`
        return emptyText
      }
    }
  }
}

export default table
