<template>
  <component
    :is="componentTag"
    :type="typeAttribute"
    :class="btnClasses"
    :to="to"
    :href="href"
    :disabled="disabled"
    @click="emitClick"
  >
    <!-- <svg-icon v-if="icon" :icon="icon"></svg-icon> -->
    <slot></slot>
  </component>
</template>

<script>
//

export default {
  name: 'Btn',
  props: {
    /**
     * Type of button
     */
    type: {
      type: String,
      default: 'button',
    },
    /**
     * Additional modifiers that can be applied to any button type
     * @values base brand full-width reverse
     */
    modifiers: {
      type: String,
      default: 'base',
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    /**
     * Icon that prefix the `label`
     */
    icon: {
      type: String,
      default: null,
    },
    /**
     * Optional property which will render the button as a `nuxt-link` if specified
     */
    to: {
      type: String,
      default: null,
    },
    /**
     * Optional property which will render the button as an `a`-tag if specified
     */
    href: {
      type: String,
      default: null,
    },
    /**
     * Determine if button is disabled
     */
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    componentTag() {
      if (!this.disabled) {
        if (this.to) {
          return 'nuxt-link'
        } else if (this.href) {
          return 'a'
        }
      }
      return 'button'
    },
    typeAttribute() {
      if (this.to) {
        return null
      }
      return this.type
    },
    classNames() {
      const modifierClasses = this.modifiers.split(' ').reduce((classes, modifier) => {
        if (modifier) {
          classes[`Button--${modifier}`] = true
        }
        return classes
      }, {})
      return {
        ...modifierClasses,
      }
    },
    btnClasses() {
      return {
        Button: true,
        'Button--full-width': this.fullWidth,
        ...this.classNames,
      }
    },
  },
  methods: {
    emitClick() {
      /**
       * Clicked event.
       *
       * @event clicked
       */
      this.$emit('clicked', true)
    },
  },
}
</script>

<style lang="scss">
a {
  text-decoration: none;
}
</style>
