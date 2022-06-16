<template>
  <section class="confirmation">
    <Return class="confirmation__return" />
    <header v-if="!canReturn && !isReturning && showThanks" class="confirmation__header">
      <div class="confirmation__icon">👏</div>
      <h2 class="confirmation__heading">Tack!</h2>
      <p>Informationen som du har lämnat hjälper oss att leverera ditt paket så fort som möjligt.</p>
    </header>
    <ConfirmationDetails class="confirmation__details">
      <RememberBox v-if="!isDisabled" class="confirmation__remember_box" />
      <template v-if="!isDelivered && !lastIsFailed">
        <Btn
          class="confirmation__button"
          @clicked="handleToggleConfirmed"
          :disabled="isDisabled"
          v-if="!isDisabled"
          v-html="buttonText"
        ></Btn>
        <div class="confirmation__button-disabled" v-else v-html="buttonText"></div>
      </template>
    </ConfirmationDetails>
    <!-- <FeedbackBox /> -->
  </section>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { DELIVERY_TYPES_TEXT, HOUSE_TYPES_TEXT, PATHS } from '@/constants'
import RememberBox from './RememberBox.vue'
import ConfirmationDetails from './ConfirmationDetails.vue'
// import FeedbackBox from './FeedbackBox.vue'
import Return from './Return.vue'

export default {
  name: 'Confirmation',
  components: { ConfirmationDetails, RememberBox, Return },
  data() {
    return {
      deliveryTypesText: DELIVERY_TYPES_TEXT,
      houseTypesText: HOUSE_TYPES_TEXT,
    }
  },
  computed: {
    ...mapState(['info', 'canReturn', 'showThanks']),
    ...mapGetters(['isDisabled', 'isDelivered', 'isReturning', 'lastIsFailed', 'isPickup']),
    buttonText() {
      const pickupOrDelivery = this.isPickup ? 'retur' : 'leverans'
      return this.isDisabled
        ? `Din ${pickupOrDelivery} är på väg<span class="hide-mobile">: Du kan inte längre ändra dina uppgifter.</span>`
        : 'Redigera uppgifter'
    },
  },
  methods: {
    handleToggleConfirmed() {
      this.$router.push(PATHS.ROOT + location.search)
      this.$gtag.event('edit_address_info', {
        event_label: 'Edit address info',
      })
    },
  },
}
</script>
<style lang="scss">
.confirmation {
  grid-area: content;

  hr {
    border-bottom: $border;
    grid-column: 1/4;
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__return {
    display: flex;
    margin-bottom: $spacing-m;
    @include media-up-to($beta-width) {
      display: none;
    }
  }

  &__icon {
    background-color: $color-brown-subtle;
    width: 108px; //rem(108); Not working
    height: 108px; //rem(108);
    border-radius: 50%;
    font-size: rem(60px);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &_heading {
    color: $color-black-strong;
    font-size: $font-size-l;
    font-weight: $font-weight-default;
  }

  &__details {
    display: grid;
    grid-gap: $spacing-xxl-2 $spacing-m;
    border: 1px solid $color-black-weak;
    border-radius: $border-radius;
    padding: rem(32px) rem(28px);

    &__item {
      color: $color-black-strong;
      font-weight: $font-weight-bold;

      .is-disabled {
        color: $color-black-weak;
      }
    }
  }

  &__remember_box {
    grid-column: 1/4;
    box-shadow: none;
    margin-bottom: 0;

    @include media-up-to($beta-width) {
      grid-column: 1/3;
    }
  }

  &__label {
    @extend %text-s;
  }

  &__button {
    display: inline-block !important;
    grid-column: 1/4;

    &-disabled {
      @extend %button;
      display: inline-block !important;
      grid-column: 1/4;
      background-color: $color-black-subtle;
      border: 1px solid $color-black-subtle;
      color: $color-black-normal;
      pointer-events: none;
      cursor: not-allowed;
      font-style: italic;
      font-weight: $font-weight-default;
      height: auto;
      white-space: normal;
    }

    @include media-up-to($alpha-width - rem(51px)) {
      .hide-mobile {
        display: none;
      }
    }

    @include media-up-to($beta-width) {
      margin-bottom: $spacing-m !important;
    }

    @include media-up-to($delta-width) {
      white-space: normal !important;
    }
  }
}
</style>
