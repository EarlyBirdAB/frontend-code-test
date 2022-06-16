<template>
  <div class="New-delivery-date">
    <p class="New-delivery-date__header">Nästa leverans</p>
    <div class="New-delivery-date__content-wrapper">
      <svg-icon
        class="New-delivery-date__icon"
        icon="truck_background"
        :override-style="{ width: '58px', height: '58px' }"
      />
      <div class="New-delivery-date__date-wrapper">
        <p class="New-delivery-date__date">{{ formattedArrivalTime.day }}</p>
        <p class="New-delivery-date__time">{{ formattedArrivalTime.time }}</p>
      </div>
    </div>
    <div class="New-delivery-date__button-wrapper" v-if="canReschedule">
      <button class="New-delivery-date__button" @click="() => $emit('editValues', 'ChooseTime')">Ändra dag</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'NewDeliveryDate',
  computed: {
    ...mapState(['canReschedule']),
    ...mapGetters(['formattedArrivalTime']),
  },
}
</script>

<style lang="scss" scoped>
.New-delivery-date {
  margin-bottom: $spacing-m;
  display: flex;
  flex-direction: column;

  &__header {
    font-weight: $font-weight-default;
    font-size: $font-size-l;
    color: $color-black-strong;
    margin-bottom: $spacing-s;
  }

  &__content-wrapper {
    display: flex;
    flex-direction: row;
  }

  &__date-wrapper {
    display: flex;
    flex-direction: column;
  }

  &__icon {
    stroke: none;
    margin-right: $spacing-m;
  }

  &__date {
    font-weight: $font-weight-default;
    font-size: $font-size-m;
    color: $color-black-strong;
  }

  &__time {
    font-weight: $font-weight-bold;
    font-size: $font-size-m;
    color: $color-brown-strong;
    margin-bottom: $spacing-l;
    margin-top: 0;
  }

  &__button {
    background-color: $color-black-strong;
    border: $color-brown-strong;
    border-radius: $border-radius;
    font-weight: $font-weight-default;
    font-size: $font-size-base;
    color: $color-white;
    text-decoration: none;
    padding: $spacing-l;
    cursor: pointer;
    width: 100%;
    margin-bottom: $spacing-m;
  }
}
</style>
