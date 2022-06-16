<template>
  <div :class="classNames">
    <label v-if="label" :for="uniqid" class="Form-input__label">
      <input
        type="radio"
        :id="uniqid"
        :value="value"
        :name="name"
        :data-checked="checked"
        @input.stop="updateValue"
        class="Form-input"
      />
      <span class="Form-input__indicator" :data-has-description="!!description">
        <svg-icon v-if="icon" :icon="icon"></svg-icon>
        {{ label }}
        <span v-if="description" class="Radio-button-immediately-description">{{ description }}</span>
      </span>
    </label>
    <!-- <p v-if="errorMessage" class="Form-input__error">
      {{ errorMessage }}
    </p> -->
  </div>
</template>

<script>
export default {
  name: 'FormInput',
  emits: ['input'],
  props: {
    value: {
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
    fullWidth: {
      type: Boolean,
      default: false,
    },
    radio: {
      type: Boolean,
      default: true,
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
      default: 'radio',
    },
    icon: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
  },
  computed: {
    classNames() {
      const modifierClasses = this.modifiers.split(' ').reduce((classes, modifier) => {
        if (modifier) {
          classes[`Form-input__container--${modifier}`] = true
        }
        return classes
      }, {})
      return {
        'Form-input__container': true,
        ...modifierClasses,
      }
    },
  },
  methods: {
    updateValue(e) {
      this.$emit('input', e.target.value)
    },
  },
}
</script>

<style lang="scss" scoped>
.Form-input {
  &__label {
    position: relative;
    display: block;
    color: $color-black-normal;
    font-weight: $font-weight-default;
    font-family: $font-family;

    .svg-icon {
      margin-right: $spacing-s;
    }
  }
  //   &:hover {
  //     border: 1px solid $color-black-normal;
  //   }

  &__indicator {
    font-size: $font-size-base;
    // position: absolute;
    // left: 0;
    width: 100%;
    //Todo extend button as much is the same
    height: $spacing-xxl-2 * 2;
    border: 1px solid $color-black-weak;
    border-radius: $border-radius;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;

    &:hover {
      background-color: $color-brown-normal;
      border: 1px solid $color-brown-normal;
      color: $color-white; //nothing hapens without position absolute
    }
  }
}

.Form-input__container--chunky .Form-input__indicator {
  @include media-up-to($charlie-width) {
    height: rem(111px);
    flex-direction: column;
    .svg-icon {
      height: 40px;
      width: 40px;
      margin: 0 0 0.5rem 0;
    }
  }
}

input[type='radio'][data-checked='true'] + .Form-input__indicator {
  background-color: $color-brown-normal;
  border: 1px solid $color-brown-normal;
  color: $color-white;
}
</style>
