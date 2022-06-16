<template>
  <div class="Tooltip">
    <button
      ref="reference"
      class="Button"
      data-type="tooltip"
      @mouseenter="setVisibility(true)"
      @mouseleave="setVisibility(false)"
      @click.prevent
    >
      <slot name="action">Varför syns inte min adress?</slot>
    </button>
    <div v-show="visible" ref="popout" class="Tooltip__popout">
      <slot>
        <p>
          På grund av säkerhetsskäl och GDPR visar vi inte din adress.
          {{
            isPickup
              ? ''
              : `Vid frågor om din leverans eller ändring av adress, vänligen kontakta ${
                  sender ? sender.name : 'din e-handlare'
                }.`
          }}
        </p>
      </slot>
      <div class="Tooltip__popout-arrow" data-popper-arrow></div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { createPopper } from '@popperjs/core'

export default {
  name: 'Tooltip',
  props: {
    placement: {
      type: String,
      validator: (value) => {
        return ['top', 'bottom', 'right', 'left'].includes(value)
      },
      default: 'bottom',
    },
    strategy: {
      type: String,
      validator: (value) => {
        return ['absolute', 'fixed'].includes(value)
      },
      default: 'absolute',
    },
    offset: {
      type: Array,
      validator: (value) => {
        return value.length === 2 && value.every((v) => typeof v === 'number')
      },
      default: () => [26, 8],
    },
  },
  data() {
    return {
      visible: false,
      popperInstance: null,
    }
  },
  computed: {
    ...mapState(['sender']),
    ...mapGetters(['isPickup']),
  },
  methods: {
    setVisibility(visible) {
      this.visible = visible
      this.popperInstance.update()
    },
  },
  mounted() {
    const { reference, popout } = this.$refs
    this.popperInstance = createPopper(reference, popout, {
      placement: this.placement,
      strategy: this.strategy,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [26, 8],
          },
        },
      ],
    })
  },
}
</script>

<style lang="scss">
.Tooltip {
  display: inline-block;
  @include media-up-to($charlie-width) {
    display: none;
  }

  &__popout {
    width: 400px;
    background-color: $color-white;
    color: $color-black-strong;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
    border-radius: $border-radius;
    font-size: $font-size-xs;
    font-weight: $font-weight-default;
    line-height: rem(22px);
    padding: $spacing-m;
    z-index: 1;

    .Modal & {
      border: 1px solid $color-black-weak;
    }

    &-arrow,
    &-arrow::before {
      position: absolute;
      width: 0;
      height: 0;
    }

    &-arrow {
      visibility: hidden;
    }

    &-arrow::before {
      visibility: visible;
      content: '';
    }

    &[data-popper-placement^='top'] > &-arrow {
      &::before {
        border-left: 1.2rem solid transparent;
        border-right: 1.2rem solid transparent;
        border-top: 0.8rem solid $color-white;
      }
      bottom: 0.25rem;
    }

    &[data-popper-placement^='bottom'] > &-arrow {
      &::before {
        border-left: 1.2rem solid transparent;
        border-right: 1.2rem solid transparent;
        border-bottom: 0.8rem solid $color-white;
      }
      top: -0.5rem;
    }

    &[data-popper-placement^='left'] > &-arrow {
      &::before {
        border-top: 1.2rem solid transparent;
        border-bottom: 1.2rem solid transparent;
        border-left: 0.8rem solid $color-white;
      }
      right: 0.25rem;
    }

    &[data-popper-placement^='right'] > &-arrow {
      &::before {
        border-top: 1.2rem solid transparent;
        border-bottom: 1.2rem solid transparent;
        border-right: 0.8rem solid $color-white;
      }
      left: -0.5rem;
    }
  }
}
</style>
