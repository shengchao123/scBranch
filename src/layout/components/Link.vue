
<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@u/validate'
import { jumpOtherApp } from '@u/login.js'

export default {
  props: {
    to: {
      type: [String, Object],
      required: true
    }
  },
  methods: {
    linkProps (obj) {
      if (isExternal(obj.pageUrl)) {
        jumpOtherApp('', obj.pageUrl)
        return
      }

      const isPath = obj.pageUrl.includes('/')
      const toParams = isPath ? obj.pageUrl : { name: obj.pageUrl }
      return {
        is: 'router-link',
        to: toParams
      }
    }
  }
}
</script>
