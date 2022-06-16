<template>
  <svg class="svg-icon" :class="className" :style="overrideStyle" :data-size="size" xmlns="http://www.w3.org/2000/svg">
    <title v-if="title">{{ title }}</title>
    <use :xlink:href="symbolId" xmlns:xlink="http://www.w3.org/1999/xlink" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    prefix: {
      type: String,
      default: 'icon',
    },
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      validator: (value) => ['small', 'medium', 'large', 'extra-large', 'inherit'].includes(value),
      default: 'medium',
    },
    overrideStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    symbolId() {
      return `#${this.prefix}-${this.icon}`
    },
    className() {
      return `svg-icon--${this.icon}`
    },
  },
}
</script>
