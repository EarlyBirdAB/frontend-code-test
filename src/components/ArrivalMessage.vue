<template>
  <div class="Arrival-message">
    <div class="Arrival-message__header">
      <h2>Hur ska budet meddela ankomst?</h2>
      <div v-if="identification" class="Arrival-message__verify">
        <svg-icon class="Arrival-message__icon-ID" icon="ID_icon" />
        <p class="Arrival-message__verify-text">
          E-handlaren kräver att du <strong>legitimerar</strong> dig när du tar emot paketet.
        </p>
      </div>
      <div v-else-if="handOver" class="Arrival-message__verify">
        <svg-icon icon="home_icon" />
        <p class="Arrival-message__verify-text">
          Du eller någon i ditt hushåll behöver vara hemma för att ta emot paketet.
        </p>
      </div>
    </div>
    <div class="Arrival-message__button-wrapper">
      <button
        class="Arrival-message__button"
        @click="onHandleArrivalMessage(arrivalMessages.DOORBELL)"
        :data-active="doorBellActive"
      >
        <svg-icon :icon="doorBellActive ? 'alarm-inverted' : 'alarm'" size="large" />
        <span>Jag vill att budet ringer på dörren</span>
      </button>
      <button
        class="Arrival-message__button"
        @click="onHandleArrivalMessage(arrivalMessages.KNOCK)"
        :data-active="knockActive"
      >
        <svg-icon class="zzz" :icon="knockActive ? 'zzz-inverted' : 'zzz'" size="large" />
        <span>Jag vill att budet knackar på dörren</span>
      </button>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { ARRIVAL_MESSAGE } from '@/constants'

export default {
  name: 'ArrivalMessage',
  data() {
    return {
      arrivalMessages: ARRIVAL_MESSAGE,
    }
  },
  props: {
    editMode: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState(['checkedDeliveryNotification', 'info', 'editInfo', 'identification', 'handOver']),
    doorBellActive() {
      return this.editMode
        ? this.editInfo.arrivalMessage === this.arrivalMessages.DOORBELL
        : this.info.arrivalMessage === this.arrivalMessages.DOORBELL
    },
    knockActive() {
      return this.editMode
        ? this.editInfo.arrivalMessage === this.arrivalMessages.KNOCK
        : this.info.arrivalMessage === this.arrivalMessages.KNOCK
    },
  },

  methods: {
    ...mapActions(['updateDetail']),
    onHandleArrivalMessage(value) {
      this.updateDetail({ key: 'arrivalMessage', value, editMode: this.editMode })
    },
  },
}
</script>
<style lang="scss">
.Arrival-message {
  &__verify {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &-text {
      margin: $spacing-l;
    }
  }

  &__icon-ID {
    width: 72px !important;
    height: 72px !important;
    stroke: none !important;
  }

  &__button-wrapper {
    display: flex;

    @include media-up-to($beta-width) {
      align-items: center;
      justify-content: center;
    }
  }

  &__button {
    width: auto;
    height: 157px;
    background-color: $color-white;
    border: 1px solid $color-black-weak;
    border-radius: $border-radius;
    cursor: pointer;
    max-width: 267px;

    @include media-up-to($beta-width) {
      width: 150px;
      height: 140px;
    }

    &:first-of-type {
      margin-right: $spacing-m;
    }

    color: $color-black-normal;

    &[data-active='true'] {
      background-color: $color-brown-normal;
      color: $color-white;

      span {
        color: $color-white;
      }
      svg {
        .alarm_stroke {
          stroke: $color-white;
        }
        .alarm_fill {
          fill: transparent;
        }
        .alarm_fill_2 {
          fill: $color-white;
        }
      }
      .zzz {
        color: $color-white;
      }
    }
  }
  h2 {
    margin-bottom: 39px;

    @include media-up-to($beta-width) {
      text-align: center;
      margin-bottom: $spacing-xxl-2;
    }
  }

  p {
    @include media-up-to($beta-width) {
      text-align: center;
      margin-bottom: $spacing-xxl-2;
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }

  .svg-icon {
    margin-left: $spacing-xxl;
    margin-right: $spacing-l;
    width: 42px;
    height: 42px;
  }

  span {
    font-size: $font-size-base;
    font-weight: $font-weight-default;
    color: $color-black-normal;
    display: flex;
    flex-direction: column;
    margin-top: $spacing-m;

    @include media-up-to($beta-width) {
      font-size: $font-size-xs;
    }
  }
}
</style>
