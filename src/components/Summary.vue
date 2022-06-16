<template>
  <div class="Summary">
    <h2 class="Summary__title">Dina val</h2>
    <SummarySection
      :compact="compact"
      :show-edit-button="canReschedule && showEditButtons && !!arrivalTime"
      @change="() => $emit('editValues', 'ChooseTime')"
      v-if="showDate"
    >
      <template v-slot:section-left>{{ timeLabel }}</template>
      <template v-slot:section-right>
        <p class="Summary__date" :data-highlight="dateHighlight">{{ formattedArrivalTime.day || '–' }}</p>
        <p class="Summary__time">{{ formattedArrivalTime.time }}</p></template
      >
    </SummarySection>
    <hr v-if="showDate" />

    <template v-if="!isPickup">
      <SummarySection
        :compact="compact"
        :show-edit-button="showEditButtons"
        @change="() => $emit('editValues', 'ChooseDeliveryType')"
      >
        <template v-slot:section-left>Typ av leverans</template>
        <template v-slot:section-right>
          <p class="Summary__text-bold">{{ deliveryText }}</p>
          <p v-if="deliverySubText !== ''" class="Summary__text">{{ deliverySubText }}</p>
        </template>
      </SummarySection>
      <hr />
    </template>

    <SummarySection
      :compact="compact"
      :show-edit-button="showEditButtons"
      :address="true"
      @change="() => $emit('editValues', 'CompleteInformation')"
    >
      <template v-slot:section-left>Dina uppgifter</template>
      <template v-slot:section-right>
        <ConfirmationDetails class="Summary__confirmation-details" />
      </template>
    </SummarySection>
    <hr />
    <!-- <FeedbackBox v-if="feedbackHomeDeliveryVisible" /> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import { DELIVERY_TYPES_HOMEDELIVERY, ARRIVAL_MESSAGE } from '@/constants'
import ConfirmationDetails from './ConfirmationDetails.vue'
import SummarySection from './SummarySection.vue'
// import FeedbackBox from './FeedbackBox.vue'

export default {
  name: 'Summary',
  components: { ConfirmationDetails, SummarySection },
  props: {
    compact: {
      type: Boolean,
      default: false,
    },
    showDate: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState(['info', 'canEdit', 'canReschedule', 'deliveryDateIsUnknown', 'arrivalTime']),
    ...mapGetters(['isDelivered', 'isReturned', 'isDelayed', 'isPickup', 'formattedArrivalTime', 'isHomeDelivery']),
    deliveryText() {
      return this.info.deliveryType === DELIVERY_TYPES_HOMEDELIVERY.DOOR
        ? 'Paketet lämnas vid dörren'
        : this.info.deliveryType === DELIVERY_TYPES_HOMEDELIVERY.PERSONAL
        ? 'Paketet tas emot personligen'
        : ''
    },
    deliverySubText() {
      return this.info.arrivalMessage === ARRIVAL_MESSAGE.DOORBELL
        ? 'Budet ringer på dörren'
        : this.info.arrivalMessage === ARRIVAL_MESSAGE.KNOCK
        ? 'Budet knackar på dörren'
        : ''
    },
    showEditButtons() {
      return this.isDelivered || this.isReturned || !this.canEdit ? false : true
    },
    dateHighlight() {
      return this.isReturned || this.deliveryDateIsUnknown
    },
    timeLabel() {
      if (this.isPickup) {
        return 'Hämtas upp'
      }

      if (this.isHomeDelivery) {
        return this.isDelivered ? 'Levererad' : 'Levereras'
      }

      return this.isDelivered ? 'Levererad' : 'Beräknad leverans'
    },
  },
}
</script>

<style lang="scss" scoped>
.Summary {
  max-width: 790px;
  margin: 0 auto;

  &__title {
    @include media-up-to($beta-width) {
      display: none;
    }
  }

  hr {
    border-top: 1px solid $color-black-weak;
    margin-top: $spacing-xxl-2;
    margin-bottom: $spacing-xxl-2;
  }

  &__date {
    font-size: $font-size-m;
    font-weight: $font-weight-default;
    color: $color-black-normal;
    line-height: 26px;
    &[data-highlight='true'] {
      color: $color-black-strong;
    }
  }

  &__time {
    font-size: 32px;
    font-weight: $font-weight-default;
    color: $color-brown-strong;
    line-height: 40px;
  }

  &__calendar {
    font-size: $font-size-s;
    font-weight: $font-weight-default;
    color: $color-brown-strong;
    line-height: 20px;
  }

  .svg-icon {
    width: 14px;
    height: 15px;
    margin-right: $spacing-s;
  }

  &__text-bold {
    font-size: 18px;
    font-weight: $font-weight-default;
    color: $color-black-strong;
  }

  &__text {
    font-size: $spacing-m;
    font-weight: $font-weight-default;
    color: $color-black-normal;
  }

  &__confirmation-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}
</style>
