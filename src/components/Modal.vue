<template>
  <transition name="modal-fade">
    <div class="Modal__backdrop" @click="close">
      <div
        class="Modal"
        :data-center="horizontalCenter"
        :data-edit="editMode"
        :data-cover="cover"
        :data-return="returning"
        :data-sticky-footer="stickyFooter"
      >
        <header v-if="!hideHeader" class="Modal__header">
          <slot name="header">
            <svg-icon icon="illustration" :fill="true" />
          </slot>
        </header>
        <section class="Modal__body" :data-no-header="hideHeader" :data-no-footer="!cover">
          <slot name="body">
            <h2>Står ditt namn på dörren/postlådan?</h2>
            <p>
              För att vi ska kunna leverera måste det namn som står på paketet matcha det som står på dörren/postlådan.
              Glöm inte att ange eventuell c/o-adress om ditt namn inte står på dörren/postlådan. Se över och
              komplettera dina uppgifter i nästa steg.
            </p>
          </slot>
        </section>
        <footer v-if="cover" class="Modal__footer">
          <slot name="footer">
            <button type="button" @click="close" class="Button" data-rounded="false">Ok! 👍</button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'Modal',
  props: {
    hideHeader: {
      type: Boolean,
      default: false,
    },
    horizontalCenter: {
      type: Boolean,
      default: true,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
    cover: {
      type: Boolean,
      default: true,
    },
    returning: {
      type: Boolean,
      default: false,
    },
    stickyFooter: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>
<style lang="scss">
.Modal {
  background-color: $color-white;
  box-shadow: 0 24px 24px 0 rgba(0, 0, 0, 0.25);
  padding: $spacing-xxl-2;
  overflow-x: auto;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: $z-modal;
  border-radius: $border-radius;
  max-width: rem(670px);
  margin: $spacing-xl;
  max-height: 90vh;

  @include media-up-to($beta-width - rem(1px)) {
    padding: $spacing-s;

    &[data-cover='true'] {
      height: 100%;
      width: 100%;
      margin: 0;
      border-radius: initial;
      max-height: none;
      justify-content: space-between;
    }

    &[data-center='true'] {
      justify-content: center;
    }
  }

  &[data-return='true'] {
    max-width: 480px;
    padding: 0;

    .Modal__body {
      padding: $spacing-s;
    }
  }

  h2 {
    font-size: $font-size-xl;

    @include media-up-to($beta-width) {
      font-size: $font-size-l;
    }
  }

  &__backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }

  &__header {
    .svg-icon {
      width: rem(218px);
      height: rem(218px);
    }
  }

  &__body {
    text-align: center;
    padding: $spacing-xl 0;
    color: $color-black-normal;
    overflow-y: auto;
    width: 100%;
    &[data-no-header='true'] {
      padding-top: 0;
    }
    &[data-no-footer='true'] {
      padding-bottom: 0;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    width: 100%;
    button {
      margin: 0 12px;
      @include media-up-to($beta-width) {
        min-width: initial;
        margin: 0 8px;
      }
    }
  }

  &[data-edit='true'] {
    display: grid;
    grid-template-areas:
      'main'
      'footer';
    grid-template-rows: auto auto;
    padding: $spacing-l * 2 $spacing-l $spacing-l $spacing-l;
    max-width: 580px;

    @include media-up-to($beta-width) {
      display: initial;
      padding: 0;
    }
    .Modal__body {
      max-height: 70vh;
      overflow-y: scroll;
      @include media-up-to($beta-width) {
        max-height: none;
        height: calc(100vh - 88px);
        padding: $spacing-s;
        width: 100%;
      }
    }
  }

  &[data-sticky-footer='true'] {
    .Modal__footer {
      position: relative;
      padding-top: $spacing-l;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: $color-black-subtle;
        z-index: -1;
        filter: blur(13px);
      }

      @include media-up-to($beta-width) {
        position: sticky;
        bottom: 0;
        height: 88px;
        padding: 12px 0;
      }
      button {
        width: 100%;
        @include media-up-to($beta-width) {
          min-width: auto;
        }

        &:nth-child(1) {
          margin-right: math.div($spacing-l, 2);
          margin-left: 0px;
          svg,
          .mobile-text {
            display: none;
          }
          @include media-up-to($beta-width) {
            margin-left: $spacing-m;
            svg {
              display: block;
              transform: rotate(180deg);
              margin-right: $spacing-xs;
            }
            .desktop-text {
              display: none;
            }
            .mobile-text {
              display: inline-block;
            }
          }
        }
        &:nth-child(2) {
          margin-right: 0px;
          margin-left: math.div($spacing-l, 2);
          @include media-up-to($beta-width) {
            margin-right: $spacing-m;
          }
        }
      }
    }
  }
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>
