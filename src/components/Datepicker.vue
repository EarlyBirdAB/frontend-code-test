<template>
  <div class="Datepicker" :data-compact="compact">
    <div class="Datepicker__wrapper" :data-edit="editMode">
      <template v-if="canReschedule || (isPickup && hasTimeSlots)">
        <h2 class="Datepicker__header" v-if="isPickup">När ska vi hämta paketet?</h2>
        <template v-else>
          <h2 class="Datepicker__header">När vill du att vi levererar?</h2>
          <p class="Datepicker__text">Du kan ändra leveransdag fram till kl. <strong>12.00</strong> den valda dagen.</p>
        </template>
        <div class="Datepicker__button--wrapper" v-for="week in groupedTimeSlots" :key="week.key">
          <div class="Datepicker__button--header">{{ getWeekName(week) }}</div>
          <button
            class="Datepicker__button"
            v-for="(slot, index) in week.slots"
            :key="index"
            :data-active="slot.isDateActive"
            @click="onDateSelected(slot)"
          >
            <p class="Datepicker__button--date">
              <span>{{ getDay(slot.start) }}</span> {{ getDate(slot.start) }}
            </p>
            <p class="Datepicker__button--time">{{ getTime(slot) }}</p>
          </button>
        </div>
      </template>
      <div class="Datepicker__failed-reschedule" v-else>
        <template v-if="isPickup">
          <h2 class="Datepicker__failed-reschedule--header">Din upphämtningsdag</h2>
          <p class="Datepicker__failed-reschedule--text">Du kan inte längre byta upphämtningsdag.</p>
        </template>
        <template v-else>
          <h2 class="Datepicker__failed-reschedule--header">Din leveransdag</h2>
          <p class="Datepicker__failed-reschedule--text">Du kan inte längre byta leveransdag.</p>
        </template>
      </div>
    </div>
    <div class="Datepicker__section" v-if="!editMode">
      <div class="Datepicker__section--wrapper" v-if="info.timeSlot && info.timeSlot.start">
        <p class="Datepicker__section--header">{{ getSelectedDay(info.timeSlot) }}</p>
        <p class="Datepicker__section--date">{{ getTime(info.timeSlot) }}</p>
        <p class="Datepicker__section--text" v-if="isPickup">Ställ ut paketet {{ timeUntilPickup }} för upphämtning</p>
        <p class="Datepicker__section--text" v-else>
          Ungefärlig leveranstid. Vi meddelar dig om aktuell tid när vi är på väg.
        </p>
      </div>
      <div class="Datepicker__section--wrapper" v-else>
        <p class="Datepicker__section--text">Inget datum valt</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { getTimeSpan, getDateMonth, getDayDescription, weekDifference } from '@/utils/date-helpers'
import { firstUppercase } from '@/utils/string-helpers'
export default {
  name: 'Datepicker',
  props: {
    editMode: {
      type: Boolean,
      default: false,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(['info', 'editInfo', 'timeSlots', 'canReschedule']),
    ...mapGetters(['isPickup', 'hasTimeSlots', 'timeUntilPickup']),

    groupedTimeSlots() {
      const weeksMap = this.timeSlots.reduce((acc, slot) => {
        const weekDiff = weekDifference(slot.start)
        if (!acc[weekDiff]) {
          acc[weekDiff] = []
        }
        acc[weekDiff] = acc[weekDiff].concat([
          {
            ...slot,
            isDateActive: this.isDateActive(slot),
          },
        ])
        return acc
      }, {})
      const weeks = Object.entries(weeksMap)
        .map(([key, value]) => {
          return key >= 0
            ? {
                [key]: value,
              }
            : null
        })
        .filter((week) => week)
        .map((week) => {
          const key = Object.keys(week)[0]
          return {
            key: key,
            slots: week[key],
          }
        })
        .sort((a, b) => {
          return parseInt(a.key) > parseInt(b.key) ? 1 : parseInt(a.key) < parseInt(b.key) ? -1 : 0
        })
      return weeks
    },
  },

  methods: {
    ...mapActions(['updateDetail']),
    getWeekName(week) {
      const key = parseInt(week.key)

      if (key === 0) {
        return 'Den här veckan'
      } else if (key === 1) {
        return 'Nästa vecka'
      } else {
        return `Om ${key} veckor`
      }
    },
    isDateActive(currentDate) {
      return this.editMode
        ? currentDate.start.includes(this.editInfo.timeSlot?.start) &&
            currentDate.stop.includes(this.editInfo.timeSlot?.stop)
        : currentDate.start.includes(this.info.timeSlot?.start) && currentDate.stop.includes(this.info.timeSlot?.stop)
    },
    getDay(currentDate) {
      return firstUppercase(getDayDescription(currentDate))
    },
    getSelectedDay(currentDate) {
      return (
        (currentDate &&
          firstUppercase(`${getDayDescription(currentDate.start, true)} ${getDateMonth(currentDate.start)}`)) ||
        ''
      )
    },
    getDate(currentDate) {
      return getDateMonth(currentDate)
    },
    getTime(currentDate) {
      return currentDate ? getTimeSpan(currentDate) : ''
    },
    onDateSelected({ start, stop }) {
      this.updateDetail({ key: 'timeSlot', value: { start, stop }, editMode: this.editMode })
    },
  },
}
</script>

<style lang="scss" scoped>
.Datepicker {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin: 0;

  @include media-up-to($beta-width) {
    flex-direction: column;
    align-items: center;
  }

  .Modal[data-edit='true'] & {
    width: 100%;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &[data-edit='true'] {
      min-width: 540px;

      @include media-up-to($beta-width) {
        min-width: auto;
      }
    }

    @include media-up-to($beta-width) {
      width: 100%;
    }
  }

  &__header {
    font-size: $font-size-l;
    font-weight: $font-weight-medium;
    color: $color-black-strong;
    text-align: left;

    @include media-up-to($beta-width) {
      text-align: center;
      margin: 0;
    }
  }

  &__text {
    color: $color-black-normal;
    font-size: $font-size-s;
    font-weight: $font-weight-default;

    @include media-up-to($beta-width) {
      text-align: center;
    }
  }

  &__button {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 64px;
    background-color: $color-white;
    border: 1px solid $color-black-weak;
    color: $color-black-normal;
    border-radius: 0;
    margin-right: $spacing-xxl-2;
    padding: 20px 22px;
    cursor: pointer;

    &:first-of-type {
      border-top-left-radius: $border-radius-small;
      border-top-right-radius: $border-radius-small;
    }

    &:last-of-type {
      border-bottom-left-radius: $border-radius-small;
      border-bottom-right-radius: $border-radius-small;
    }

    & + & {
      border-top: none;
    }

    &[data-active='true'] {
      background-color: $color-brown-normal;
      border: 1px solid $color-brown-normal;
      color: $color-white;

      span {
        color: $color-white;
      }
    }

    &--wrapper {
      margin-bottom: $spacing-xl;
      text-align: left;
      min-width: 33%;
      flex-shrink: 0;

      @include media-up-to($beta-width) {
        width: 100%;
      }
    }

    &--date {
      font-size: $font-size-s;
      font-weight: $font-weight-default;
    }

    &--time {
      font-size: $font-size-s;
      font-weight: $font-weight-default;
      margin-top: 0;
    }

    &--header {
      font-size: $font-size-s;
      // font-weight: $font-weight-default;
      color: $color-black-strong;
      margin-bottom: $spacing-s;
    }

    span {
      color: $color-brown-strong;
    }
  }

  &__failed-reschedule {
    &--header {
      font-size: $font-size-l;
      font-weight: $font-weight-medium;
      color: $color-black-strong;
      margin-bottom: $spacing-xs;

      @include media-up-to($beta-width) {
        text-align: center;
        margin: 0;
      }
    }

    &--text {
      margin-bottom: $spacing-l;

      @include media-up-to($beta-width) {
        text-align: center;
        margin: 0;
        margin-bottom: $spacing-xxl-2;
      }
    }
  }

  &__section {
    flex-grow: 1;
    padding-left: 30px;

    @include media-up-to($beta-width) {
      width: 100%;
      padding-left: 0;
    }

    &--wrapper {
      height: 446px;
      width: 100%;
      background-color: $color-grey-weak;
      border-radius: $border-radius;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      @include media-up-to($beta-width) {
        flex-basis: 100%;
        background-color: $color-black-subtle;
        border: 1px solid $color-black-weak;
        border-radius: $border-radius;
        height: 147px;
        padding: 24px 15px;
      }
    }

    &--header {
      color: $color-black-strong;
      font-size: $font-size-base;
      font-weight: $font-weight-default;
    }

    &--date {
      color: $color-brown-strong;
      font-size: 24px;
      font-weight: $font-weight-bold;
    }

    &--text {
      color: $color-black-normal;
      font-size: $font-size-s;
      font-weight: $font-weight-default;
      text-align: center;
      padding: 0 $spacing-xs;
    }
  }

  &[data-compact='true'] {
    flex-direction: column;
    align-items: center;
    .Datepicker {
      &__wrapper {
        width: 100%;
      }

      &__section {
        width: 100%;
        padding-left: 0;
      }

      &__section--wrapper {
        flex-basis: 100%;
        background-color: $color-black-subtle;
        border: 1px solid $color-black-weak;
        border-radius: $border-radius;
        height: 147px;
        padding: 24px 15px;
      }
    }
  }

  .Modal & {
    &--wrapper {
      padding-right: 0px;
      flex-basis: 100%;
    }
  }
}
</style>
