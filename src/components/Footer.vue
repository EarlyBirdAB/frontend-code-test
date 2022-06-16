<template>
  <div class="Footer">
    <div class="Footer__content" :data-prev="!!prevUrl">
      <DataPolicy class="Footer__data-policy" />
      <router-link v-if="prevUrl !== ''" :to="prevUrl" custom v-slot="{ navigate }" :key="prevUrl"
        ><button class="Button Footer__button" data-type="secondary" @click="navigate" role="link">
          <svg-icon class="reversed" icon="arrow-right" width="20px" height="20px"></svg-icon>Tillbaka
        </button></router-link
      >
      <button v-if="lastStep" class="Button Footer__button" :disabled="disabled" @click="onClick" role="link">
        Bekräfta<svg-icon v-if="!lastStep" icon="arrow-right" width="20px" height="20px"></svg-icon>
      </button>

      <router-link v-else :to="nextUrl" custom v-slot="{ navigate }" :key="nextUrl">
        <button class="Button Footer__button" @click="navigate" role="link" :disabled="disabled">
          Nästa<svg-icon v-if="!lastStep" icon="arrow-right" width="20px" height="20px"></svg-icon></button
      ></router-link>
    </div>
  </div>
</template>

<script>
import DataPolicy from './DataPolicy.vue'

export default {
  name: 'Footer',
  components: { DataPolicy },
  props: {
    nextUrl: {
      type: String,
    },
    prevUrl: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    lastStep: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick() {
      this.$emit('confirmClick')
      this.$router.push(this.nextUrl)
    },
  },
}
</script>

<style lang="scss" scoped>
.extra-padding {
  height: 100px;
}

.Footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 88px;
  text-align: center;
  padding: 12px 0px;

  @include media-up-to($beta-width) {
    position: sticky;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: $color-black-subtle;
    z-index: -1;
  }
  &__content {
    @extend %site-container;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    > *:not(:last-child) {
      margin-right: math.div($spacing-l, 2);
    }
  }

  @include media-up-to($beta-width) {
    padding-right: 0;

    &__content {
      justify-content: flex-end;
      &[data-prev='true'] {
        justify-content: space-between;
      }
    }

    &__data-policy {
      display: none;
    }
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    @include media-up-to($beta-width) {
      width: 100%;
      min-width: auto;
    }
  }

  .svg-icon {
    margin-left: $spacing-xs;

    &.reversed {
      transform: rotate(180deg);
      margin-left: 0;
      margin-right: $spacing-xs;
    }
  }
}
</style>
