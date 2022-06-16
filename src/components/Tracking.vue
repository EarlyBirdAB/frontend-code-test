<template>
  <section class="Tracking">
    <h2 class="Tracking__header">{{ header }}</h2>
    <slot></slot>
    <TrackingList />
  </section>
</template>

<script>
import TrackingList from './TrackingList.vue'

export default {
  props: {
    header: {
      type: String,
      default: 'Spåra',
    },
  },
  components: { TrackingList },
}
</script>

<style lang="scss" scoped>
.Tracking {
  grid-area: tracking;
  @include media-up-to($beta-width) {
    padding-bottom: 800px;
  }

  &__header {
    @include media-up-to($beta-width) {
      display: none;
      + * {
        margin-top: 0;
      }
    }
  }
}
</style>
