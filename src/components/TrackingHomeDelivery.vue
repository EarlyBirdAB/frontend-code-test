<template>
  <section class="Tracking-home-delivery">
    <div class="Tracking-home-delivery__wrapper">
      <div class="Tracking-home-delivery__thanks" v-if="showThanks">
        <svg-icon class="Tracking-home-delivery__thanks-icon-clap" icon="clap" />
        <h2 class="Tracking-home-delivery__thanks-header">Tack!</h2>
        <p class="Tracking-home-delivery__thanks-text">
          Informationen som du har lämnat hjälper oss att slutföra din {{ isPickup ? 'upphämtning' : 'leverans' }} så
          smidigt som möjligt.
        </p>
        <button @click="hideThanks" class="Tracking-home-delivery__thanks-button">Dölj detta</button>
      </div>
      <tab-select class="Tracking-home-delivery__tab-select" :tabs="tabs" @switch="handleTabSwitch" />
      <div class="Tracking-home-delivery__tracking toggleable-areas" :data-visible="isTracking">
        <DeliverySoon v-if="isOutForDelivery" />
        <h2 v-else>{{ trackText }}</h2>
        <NewDeliveryDate v-if="isFailedDelivery" @editValues="(component) => $emit('editValues', component)" />
        <RebookTime>
          <Datepicker :compact="true" />
        </RebookTime>
        <TrackingList />
      </div>
    </div>
    <Summary
      class="Tracking-home-delivery__section toggleable-areas"
      :compact="true"
      :showDate="!isFailedDelivery"
      :data-visible="!isTracking"
      @editValues="(component) => $emit('editValues', component)"
    />
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import Datepicker from './Datepicker.vue'
import DeliverySoon from './DeliverySoon.vue'
import NewDeliveryDate from './NewDeliveryDate.vue'
import RebookTime from './RebookTime.vue'
import Summary from './Summary.vue'
import TabSelect from '@/components/TabSelect.vue'
import TrackingList from './TrackingList.vue'

export default {
  name: 'DeliverySection',
  components: {
    Datepicker,
    DeliverySoon,
    NewDeliveryDate,
    RebookTime,
    Summary,
    TabSelect,
    TrackingList,
  },
  emits: ['editValues'],
  data() {
    return {
      currentTab: 'tab_tracking',
    }
  },
  computed: {
    ...mapState(['hasEdited', 'events', 'showThanks']),
    ...mapGetters(['isFailedDelivery', 'isOutForDelivery', 'isPickup']),
    isTracking() {
      return this.currentTab === 'tab_tracking'
    },
    trackText() {
      return this.isPickup ? 'Status' : 'Spåra'
    },
    tabs() {
      return [
        {
          label: 'Dina val',
          value: 'tab_confirm',
          active: this.currentTab === 'tab_confirm',
        },
        {
          label: this.trackText,
          value: 'tab_tracking',
          active: this.currentTab === 'tab_tracking',
        },
      ]
    },
  },
  methods: {
    ...mapActions(['updateThanks']),
    hideThanks() {
      this.updateThanks(false)
    },
    handleTabSwitch(value) {
      this.currentTab = value
    },
    openLink() {
      window.open('https://earlybird.delivery/kontakt-hjalp/kontakta-oss/', '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
.Tracking-home-delivery {
  display: flex;
  gap: 20px;
  justify-content: space-between;

  @include media-up-to($beta-width) {
    flex-direction: column;
  }

  &__section {
    flex-basis: 40%;

    @include media-up-to($beta-width) {
      width: 100%;
    }
  }

  &__wrapper {
    flex-basis: 48%;

    @include media-up-to($beta-width) {
      flex-basis: 100%;
    }
  }

  &__thanks {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 46px;
  }

  &__thanks-icon-clap {
    width: 24px;
    height: 24px;
    stroke: transparent;
  }

  &__thanks-header {
    font-weight: $font-weight-default;
    font-size: 24px;
    color: $color-black-strong;
  }

  &__thanks-text {
    font-weight: $font-weight-default;
    font-size: $font-size-base;
    color: $color-black-normal;
    text-align: center;
  }

  &__thanks-button {
    background-color: transparent;
    border: none;
    color: $color-brown-strong;
    text-decoration: underline;
    cursor: pointer;
    margin-top: $spacing-l;
    display: none;

    @include media-up-to($beta-width) {
      display: block;
    }
  }

  &__tracking {
    padding: 0;

    @include media-up-to($beta-width) {
      border: none;
    }
  }

  h2:not(.Tracking-home-delivery__thanks-header) {
    @include media-up-to($beta-width) {
      display: none;
    }
  }

  p {
    font-size: $font-size-s;
    color: $color-black-normal;
    font-weight: $font-weight-default;
  }
}
</style>
