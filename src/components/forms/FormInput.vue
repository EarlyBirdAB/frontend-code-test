<template>
  <div :class="containerClasses" :data-show-field="showField">
    <div v-if="icon || label || description" class="Form-input__top">
      <svg-icon v-if="icon" :icon="icon"></svg-icon>
      <Checkbox v-if="isCo" class="Form-input__label" :value="showField" @change="updateShowField">
        {{ label }}
        <Tooltip class="Form-input__tooltip" placement="top" :strategy="modalTooltip ? 'fixed' : 'absolute'">
          <template v-slot:action>
            <svg-icon icon="questionmark" width="24px" height="24px" :fill="true"></svg-icon>
          </template>
          <CareOfContent />
        </Tooltip>
        <div class="Form-input__tooltip" data-mobile="true">
          <button class="Button" data-type="tooltip" @click.prevent="$emit('openHelp')">
            <svg-icon icon="questionmark" width="24px" height="24px" :fill="true"></svg-icon>
          </button>
        </div>
      </Checkbox>
      <label v-else-if="label" :for="uniqid" class="Form-input__label">{{ label }} </label>
      <span v-if="showDescription" class="Form-input__description">{{ description }}</span>
    </div>
    <template v-if="!isCo || showField">
      <input
        :type="type"
        :id="uniqid"
        :value="value"
        :name="name"
        :data-checked="checked"
        :placeholder="placeholder"
        :maxlength="maxLength"
        :class="classNames"
        :disabled="disabled"
        :autofocus="autofocus"
        :pattern="pattern"
        :title="patternTooltip"
        v-model="inputValue"
        class="Form-input"
      />
      <p class="Form-input__error">
        {{ patternTooltip }}
      </p>
    </template>
  </div>
</template>

<script>
import Tooltip from '@/components/Tooltip.vue'
import Checkbox from '@/components/forms/Checkbox.vue'
import CareOfContent from '@/components/CareOfContent.vue'

export default {
  name: 'FormInput',
  components: { Tooltip, Checkbox, CareOfContent },
  emits: ['input', 'enter', 'show-field', 'openHelp'],
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: 'text',
    },
    maxLength: {
      type: Number,
      default: null,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    uniqid: {
      type: String,
      default: null,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    /**
     * Additional modifiers that can be applied to any input type
     * @values base radio
     */
    modifiers: {
      type: String,
      default: 'text',
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: null,
    },
    modalTooltip: {
      type: Boolean,
      default: false,
    },
    isCo: {
      type: Boolean,
      default: false,
    },
    pattern: {
      type: String,
      default: '[A-Za-z0-9åäöÅÄÖ */#_]+',
    },
    patternTooltip: {
      type: String,
      default: 'Endast bokstäver, siffror och dessa tecken *, /, #, _ är tillåtna',
    },
  },

  data: () => ({
    showField: false,
  }),

  computed: {
    containerClasses() {
      return {
        'Form-input__container': true,
        'Form-input__container--full-width': this.fullWidth,
        'Form-input__container--is-co': this.isCo,
      }
    },
    classNames() {
      const modifierClasses = this.modifiers.split(' ').reduce((classes, modifier) => {
        if (modifier) {
          classes[`Form-input--${modifier}`] = true
        }
        return classes
      }, {})
      return {
        ...modifierClasses,
      }
    },

    inputValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },

    showDescription() {
      return (this.description && !this.isCo) || (this.description && this.showField)
    },
  },
  watch: {
    showField(newValue) {
      this.$emit('show-field', newValue)
    },
  },
  methods: {
    keyup(e) {
      if (e.keyCode === 13) {
        this.$emit('enter', e.target.value)
      }
    },
    updateShowField(value) {
      this.showField = !value
    },
  },
  mounted() {
    if (this.isCo && this.value?.length > 0) {
      this.showField = true
    }
  },
}
</script>

<style lang="scss">
.Form-input {
  &__top {
    display: flex;
    flex-direction: column;
  }

  &__description {
    @extend %text-s;
  }

  &__error {
    display: none;
  }

  &:focus {
    box-shadow: 0 0 0 1px $color-black;
  }

  &:invalid {
    border-color: $color-red-strong;

    + .Form-input__error {
      display: initial;
    }
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &__tooltip {
    margin-left: 10px;
    button[data-type='tooltip'] {
      text-decoration: none;
    }

    &[data-mobile='true'] {
      display: none;
      @include media-up-to($charlie-width) {
        display: inline-block;
      }
    }
  }
}
</style>
