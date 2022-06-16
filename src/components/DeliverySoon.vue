<template>
  <div class="Delivery-soon">
    <h2 class="Delivery-soon__header">{{ isDeliveredSoon ? 'Nu är vi snart framme!' : 'Nu är vi på väg!' }}</h2>
    <div class="Delivery-soon__wrapper">
      <p class="Delivery-soon__text">Leveranstid</p>
      <p class="Delivery-soon__time">{{ formattedArrivalTime.time }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DeliverySoon',
  computed: {
    ...mapGetters(['formattedArrivalTime', 'isDeliveredSoon']),
  },
}
</script>

<style lang="scss" scoped>
.Delivery-soon {
  &__header {
    color: $color-black;
    font-size: $font-size-xl;
    margin-top: $spacing-xxl;
  }

  &__wrapper {
    margin-top: $spacing-l;
    margin-bottom: $spacing-xxl-2;
  }

  &__text {
    color: $color-black-normal;
    font-size: $font-size-s;
    font-weight: $font-weight-default;
    margin: 0;
  }

  &__time {
    color: $color-brown-normal;
    font-size: 42px;
    line-height: 42px;
    font-weight: $font-weight-bold;
  }
}
</style>
