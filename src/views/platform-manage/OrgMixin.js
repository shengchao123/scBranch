var table = {
  computed: {
    platformOrg () {
      return this.$store.state.platform.platformOrg
    }
  },
  watch: {
    platformOrg: {
      handler: function (o, n) {
        this.search.pageNumber = 1
        n && this.getTableData()
      },
      immediate: true
    }
  }
}

export default table
