<template>
  <section class="Tracking-list">
    <div class="Tracking-list__wrapper">
      <ul class="Tracking-list__status" :data-count="formattedEvents.length">
        <li
          class="Tracking-list__status__item"
          :data-delayed="false"
          :data-status="'not-started'"
          v-if="showTrackingHeader && isHomeDelivery"
        >
          <svg-icon
            class="Tracking-list__tracking-icon-truck"
            icon="truck-bird"
            :override-style="{ width: '80px', height: '50px' }"
          />
          <p class="Tracking-list__tracking-text">Här kan du följa din leverans. Du får ett sms när vi är på väg.</p>
        </li>
        <li
          v-for="(event, index) in formattedEvents"
          :key="event.eventTime"
          class="Tracking-list__status__item"
          :data-delayed="isDelayed(event)"
          :data-status="event.eventCode"
          :data-first="index === 0"
        >
          <span class="Tracking-list__status__item-icon">
            <svg-icon
              class="Tracking-list__status-icon"
              v-if="isDelayed(event)"
              :fill="true"
              icon="delayed-clock"
              width="24px"
              height="24px"
            />
            <svg-icon
              class="Tracking-list__status-icon"
              v-else-if="isReturnedIcon(event)"
              icon="red-cross"
              width="24px"
              height="24px"
            />
            <svg-icon
              class="Tracking-list__status-icon"
              v-else-if="isDeliveredIcon(event)"
              icon="green-check"
              width="24px"
              height="24px"
            />
            <svg-icon
              class="Tracking-list__status-icon"
              v-else-if="isFailedDeliveryIcon(event)"
              icon="yellow-exclamation"
              width="24px"
              height="24px"
            />
            <svg-icon
              class="Tracking-list__status-icon"
              v-else-if="event.eventCode === 'return'"
              icon="return"
              width="16px"
              height="16px"
            />
            <svg-icon
              class="Tracking-list__status-icon"
              v-else
              :icon="index === 0 ? 'arrow-black' : 'arrow-grey'"
              width="24px"
              height="24px"
            />
          </span>
          <div class="Tracking-list__status__item-content">
            <div class="Tracking-list__status__item-text" :data-first="index === 0">
              <span class="status">{{ event.event }}</span>
              <span v-if="event.eventTime" class="date">{{ event.eventTime }}</span>
            </div>
            <button
              class="Tracking-list__status__item-camera"
              :style="{ backgroundImage: `url(${event.imageUrl})` }"
              @click="showImageModal(event)"
              v-if="event.imageUrl"
              aria-label="Klicka för att se bild"
            >
              <svg-icon class="icon-arrows" icon="arrows-white" width="24px" height="24px" />
            </button>
            <div class="Tracking-list__status__item-return" v-if="event.eventCode === 'return'">
              <p class="Tracking-list__status__item-return__label">Kod som ska skrivas på paketet</p>
              <p class="Tracking-list__status__item-return__value">{{ pickupCode }}</p>
              <p class="Tracking-list__status__item-return__label">Hämtas upp</p>
              <p class="Tracking-list__status__item-return__value">{{ `${time} 01:00–07:00` }}</p>
              <button
                class="Tracking-list__status__item-return__button Button Button--secondary"
                @click="openReturnModal"
              >
                Mer info om {{ isPickup ? 'upphämtningen' : 'returen' }}
              </button>
            </div>
          </div>
        </li>
      </ul>
      <Modal v-show="showImage" :hide-header="true" :horizontal-center="false" :sticky-footer="true">
        <template v-slot:body>
          <div class="Tracking-list_image-holder">
            <img class="Tracking-list_image" :src="imageUrl" />
          </div>
        </template>
        <template v-slot:footer>
          <Btn class="Button--secondary" data-rounded="false" @clicked="closeImageModal">Stäng</Btn>
        </template>
      </Modal>
    </div>
  </section>
</template>

<script>
import format from 'date-fns/format'
import { sv } from 'date-fns/locale'
import { mapActions, mapState, mapGetters } from 'vuex'

import { firstUppercase } from '@/utils/string-helpers'
import { getDateMonth } from '@/utils/date-helpers'

import {
  EVENT_CODES,
  FAILED_DELIVERIES,
  TRACKING_IN_PROGRESS,
  DELAYED_DELIVERIES,
  RETURNED_DELIVERIES,
} from '@/constants'

import Modal from '@/components/Modal.vue'

export default {
  name: 'TrackingList',
  components: {
    Modal,
  },
  data() {
    return {
      showImage: false,
      imageUrl: '',
    }
  },
  computed: {
    ...mapState(['events', 'deliveryDelayed', 'arrivalTime', 'pickupCode']),
    ...mapGetters(['isHomeDelivery', 'isPickup', 'isReturning']),
    time() {
      return getDateMonth(this.arrivalTime?.start, true)
    },
    formattedEvents() {
      const events = this.events.map((event) => {
        const eventTime = format(new Date(event.eventTime), 'iiii d MMMM yyyy HH:mm', { locale: sv })
        return {
          ...event,
          event: this.addDotIfMissing(event.event),
          eventTime: eventTime ? firstUppercase(eventTime) : eventTime,
        }
      })
      if (this.deliveryDelayed && !this.isHomeDelivery) {
        events.unshift({
          eventTime: 'Försenad',
          event:
            'Försening gör att vi just nu inte kan ge dig aktuell leveransinfo. Vi uppdaterar spårningen så fort vi vet mer. Tack för ditt tålamod. OBS! Vid fel adress eller om mottagarnamn inte matchar det som står på dörren/postlådan kommer paketet returneras, kontakta då din e-handlare.',
          eventCode: 'Delayed',
        })
      }
      if (this.isReturning && !this.hasBeenPickedUp) {
        const bookedIndex = events.findIndex(({ eventCode }) => eventCode === EVENT_CODES.BOOKED)
        if (bookedIndex !== -1) {
          const pickupEvent = {
            event: this.isPickup ? 'Upphämtning har bokats' : 'Retur har bokats!',
            eventCode: 'return',
          }
          events.splice(bookedIndex, 0, pickupEvent)
        }
      }
      return events
    },
    showTrackingHeader() {
      const showHeader = this.events.some((event) => {
        return TRACKING_IN_PROGRESS.includes(event.eventCode)
      })
      return !showHeader
    },
    hasBeenPickedUp() {
      return this.events.some((event) => event.eventCode === EVENT_CODES.PICKED_UP_RETURN)
    },
  },
  methods: {
    ...mapActions('return', ['incrementModalStep', 'toggleModal']),
    addDotIfMissing(str) {
      const lastCharacter = str.slice(-1)
      return lastCharacter == '.' ? str : `${str}.`
    },
    isDelayed(event) {
      return event.eventTime === 'Försenad' || DELAYED_DELIVERIES.includes(event.eventCode)
    },
    isFailedDeliveryIcon(event) {
      return FAILED_DELIVERIES.includes(event.eventCode)
    },
    isDeliveredIcon(event) {
      return [EVENT_CODES.DELIVERED, EVENT_CODES.PICKED_UP_RETURN].includes(event.eventCode)
    },
    isReturnedIcon(event) {
      return RETURNED_DELIVERIES.includes(event.eventCode)
    },
    showImageModal(event) {
      this.imageUrl = event.imageUrl
      this.showImage = true
    },
    closeImageModal() {
      this.showImage = false
    },
    openReturnModal() {
      this.incrementModalStep()
      this.toggleModal()
    },
  },
}
</script>

<style lang="scss" scoped>
.Button--secondary {
  flex: 1;
}
.Tracking-list {
  grid-area: tracking;

  &__wrapper {
    @include media-up-to($beta-width) {
      border: none;
    }
  }

  &__tracking-top {
    border: 1px solid $color-black-weak;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    padding: $spacing-xl;
    display: flex;
    flex-direction: row;
    align-items: center;

    @include media-up-to($beta-width) {
      text-align: center;
      border: 1px solid $color-black-weak;
      border-radius: $border-radius;
      flex-direction: column;
    }

    &:first-of-type {
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
    }
  }

  &__tracking-icon-truck {
    width: 32px;
    height: 32px;
    opacity: 0.5;
    flex-shrink: 0;
  }

  &__tracking-text {
    font-weight: $font-weight-default;
    font-size: $font-size-s;
    color: $color-black-strong;
    font-style: italic;
    padding-left: $spacing-xl;
    justify-content: center;
    align-items: center;
  }

  &__status {
    margin-bottom: $spacing-m;

    @include media-up-to($beta-width) {
      border: none;
    }

    &__item {
      position: relative;
      display: flex;
      align-items: flex-start;
      padding: $spacing-l $spacing-l $spacing-l $spacing-xxl;
      border-left: 1px solid $color-black-weak;
      border-right: 1px solid $color-black-weak;

      &:first-child {
        border-top: 1px solid $color-black-weak;
        border-radius: $border-radius $border-radius 0 0;
      }

      &:last-child {
        border-bottom: 1px solid $color-black-weak;
        border-bottom-left-radius: $border-radius;
        border-bottom-right-radius: $border-radius;
      }

      &:first-child,
      &[data-first='true'] {
        .status,
        .Tracking-list__status__item-icon {
          color: $color-black-strong;
        }

        .date {
          color: $color-black-normal;
        }

        &[data-status='not-started'] {
          background-color: $color-white;
          border-bottom: 1px solid $color-black-weak;
          align-items: center;
          color: $color-black-strong;

          &::after {
            display: none;
          }
        }

        // Styling för när paketet inte har levererats
        &[data-status='6'],
        &[data-status='14'],
        &[data-status='19'],
        &[data-status='23'],
        &[data-status='28'],
        &[data-status='29'],
        &[data-status='30'],
        &[data-status='31'],
        &[data-status='32'],
        &[data-status='38'],
        &[data-status='39'],
        &[data-status='40'] {
          background-color: $color-not-delivered;
          border-radius: $border-radius $border-radius 0 0;
        }

        // Styling för när paketet är returnerat
        &[data-status='10'],
        &[data-status='17'] {
          background-color: $color-returned;
          border-radius: $border-radius $border-radius 0 0;
        }
      }

      &[data-status='Delayed'],
      &[data-delayed='true'] {
        .Tracking-list__status__item-icon {
          color: $color-delayed;
          background-color: $color-white;
        }
      }

      &[data-status='return'] {
        .Tracking-list__status__item-icon {
          color: $color-black;
          background-color: $color-white;
          padding: 1rem 0;
          margin-top: -4px;
        }
      }

      .date,
      .status {
        display: block;
      }

      .date {
        font-size: $font-size-xxs;
        font-weight: $font-weight-default;
        color: rgba($color-black-normal, 0.7);
      }

      .status {
        color: rgba($color-black-strong, 0.7);
        font-size: $font-size-s;
      }

      &-icon {
        border-radius: 50%;
        min-width: 24px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: $spacing-s;
        z-index: 2;
        color: rgba($color-black-strong, 0.7);
      }

      &-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        width: 100%;
      }

      &-camera {
        border-radius: $border-radius-small;
        padding: $spacing-s;
        margin-top: $spacing-s;
        border: none;
        border-radius: $border-radius;
        color: $color-white;
        height: 116px;
        width: 100%;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        flex-shrink: 0;
        position: relative;
      }

      &::after {
        content: '';
        background-color: $color-border;
        width: 1px;
        height: 100%;
        position: absolute;
        top: 0;
        left: 40px;
        z-index: 1;

        //If only 1 item in list => remove grey line
        [data-count='1'] & {
          display: none;
        }
      }

      &:first-child {
        &::after {
          top: 24px;
          height: 100%;
        }
      }

      &:last-child {
        // padding-bottom: 0;

        &::after {
          height: 1rem;
          top: 0;
        }
      }

      &[data-status='not-started'] + & {
        &::after {
          top: 20px;
        }
      }
    }

    &__item-return {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-top: $spacing-xs;

      &__label,
      &__value {
        margin-top: 0;
      }

      &__label {
        font-size: $font-size-xxs;
      }

      &__value {
        color: $color-black;
        font-size: $font-size-base;
        margin-bottom: $spacing-xs;
      }

      &__button {
        background-color: $color-white;
        margin-top: $spacing-m;
        color: $color-brown-strong;
        border: 1px solid $color-border;
        flex: initial;
      }
    }
  }

  &_image {
    width: 100%;
  }

  .icon-arrows {
    position: absolute;
    bottom: 13px;
    right: 14px;
  }
}
</style>
