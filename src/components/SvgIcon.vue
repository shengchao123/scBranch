<template>
  <svg class="svg-icon"
       :style="{fontSize: fontSize}"
       aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: 'icon-svg',
  props: {
    icon: {
      type: String,
      required: true
    },
    fontSize: {
      type: String
    }
  },
  computed: {
    iconName () {
      return `#${this.icon}`
    }
  }
}
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
