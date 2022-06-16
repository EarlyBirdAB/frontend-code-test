<template>
  <div :class="containerClasses">
    <div v-if="label || description" class="Form-input__top">
      <label v-if="label" :for="uniqid" class="Form-input__label">
        {{ label }}
      </label>
      <span v-if="description" class="Form-input__description">{{ description }}</span>
    </div>
    <div class="Dropdown-wrapper">
      <select
        :id="uniqid"
        :disabled="disabled"
        class="Dropdown"
        :data-placeholder="value === null"
        @change="updateSelected"
        v-model="selected"
      >
        <option :value="null" :selected="value === null">Välj våningsplan</option>
        <option v-for="option in options" :key="option" :value="option" :selected="value == option" class="Option">
          {{ option }}
        </option>
      </select>
    </div>
    <!-- <p v-if="errorMessage" class="Form-input__error">
      {{ errorMessage }}
    </p> -->
  </div>
</template>

<script>
export default {
  name: 'DropdownInput',
  emits: ['touch', 'change'],
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
    options: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    uniqid: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      selected: '',
    }
  },
  created() {
    this.selected = this.value
  },
  methods: {
    updateSelected() {
      this.$emit('touch')
      this.$emit('change', this.selected)
    },
  },
  computed: {
    containerClasses() {
      return {
        'Form-input__container': true,
        'Form-input__container--full-width': this.fullWidth,
      }
    },
  },
}
</script>
<style lang="scss">
.Dropdown {
  color: $color-black-strong;

  &:focus {
    box-shadow: 0 0 0 1px $color-black;
  }
}
</style>
