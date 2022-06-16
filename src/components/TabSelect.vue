<template>
  <ul class="tab-select">
    <li class="tab-select__item" v-for="(tab, index) in tabs" :key="`tab-item-${index}`" :data-active="tab.active">
      <a class="tab-select__link" @click.prevent="switchTab(tab.value)">
        <span class="tab-select__label">{{ tab.label }}</span>
      </a>
    </li>
  </ul>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TabSelect',
  emits: ['switch'],
  props: {
    tabs: {
      type: Array,
      required: true,
    },
  },
  setup(_, { emit }) {
    const switchTab = (value) => {
      emit('switch', value)
    }

    return {
      switchTab,
    }
  },
})
</script>

<style lang="scss" scoped>
.tab-select {
  &,
  &__item {
    display: flex;
    flex-direction: row;
    margin: 0;
  }

  list-style: none;
  padding: rem(6px);

  @include media-from($beta-width) {
    display: none;
  }

  &,
  &__item {
    border: 1px solid $color-border;
    border-radius: $border-radius;
  }

  &__item,
  &__link {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 0;
  }

  &__item {
    padding: 0;
    border-color: transparent;
    color: $color-brown-strong;
    cursor: pointer;

    &[data-active='true'] {
      border-color: $color-brown-normal;
      background-color: $color-brown-normal;
      color: $color-white;
    }
  }

  &__link {
    text-decoration: none;
    color: inherit;
    text-align: center;
  }

  &__label {
    font-size: $font-size-s;
    font-weight: $font-weight-medium;
    line-height: 2.25;
  }
}
</style>
