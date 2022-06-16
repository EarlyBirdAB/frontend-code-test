<template>
  <section class="Address-form">
    <form @submit.prevent="submitForm">
      <p class="label">Bor du i lägenhet eller hus?</p>
      <RadioBtn
        class="Address-form__house-type-selector"
        :uniqid="houseTypes.APARTMENT"
        :value="houseTypes.APARTMENT"
        label="Lägenhet"
        icon="apartment"
        name="form_input_type_of_house"
        modifiers="chunky"
        :radio="true"
        :checked="info.houseType === houseTypes.APARTMENT"
        @input="onHandleHouseType"
      />
      <RadioBtn
        class="Address-form__house-type-selector"
        :uniqid="houseTypes.HOUSE"
        :value="houseTypes.HOUSE"
        label="Hus"
        icon="house"
        name="form_input_type_of_house"
        modifiers="chunky"
        :radio="true"
        :checked="info.houseType === houseTypes.HOUSE"
        @input="onHandleHouseType"
      />
      <div class="Address-form__mailbox-wrapper" v-if="apartmentActive">
        <svg-icon
          class="Address-form__mailbox-icon"
          icon="door_mailbox"
          :override-style="{ height: '128px', width: '112px', stroke: 'none' }"
        />
        <h2 class="Address-form__mailbox-title">För en smidig leverans!</h2>
        <p class="Address-form__mailbox-text">Se till att <strong>ditt namn</strong> står på din dörr/postlåda.</p>
      </div>
      <div class="Address-form__mailbox-wrapper" v-if="houseActive">
        <svg-icon
          class="Address-form__mailbox-icon"
          icon="mailbox"
          :override-style="{ height: '128px', width: '112px', stroke: 'none' }"
        />
        <h2 class="Address-form__mailbox-title">För en smidig leverans!</h2>
        <p class="Address-form__mailbox-text">Se till att <strong>ditt husnummer</strong> står på din postlåda.</p>
      </div>
      <AddressFields />
      <div class="Address-form__button-background">
        <Btn class="Address-form__button" type="submit" :disabled="isDisabled">Skicka</Btn>
        <span class="Address-form__button-subtitle"
          >Hur hanterar vi din data? Du kan läsa
          <a href="https://earlybird.delivery/om-early-bird/datapolicy/" target="_blank">Early Birds datapolicy</a
          >.</span
        >
      </div>
    </form>
  </section>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { HOUSE_TYPES, DELIVERY_TYPES, DELIVERY_TYPES_TEXT, FLOORS, PATHS } from '@/constants'

import AddressFields from './AddressFields.vue'
import RadioBtn from './forms/RadioBtn.vue'

export default {
  name: 'AddressForm',
  components: { AddressFields, RadioBtn },
  props: {
    editMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      floorOptions: FLOORS,
      houseTypes: HOUSE_TYPES,
      deliveryTypes: DELIVERY_TYPES,
      deliveryTypesText: DELIVERY_TYPES_TEXT,
    }
  },

  computed: {
    ...mapState(['checkedDeliveryNotification', 'info', 'showCoField', 'editInfo']),
    isDisabled() {
      return this.showCoField && !this.info.careOf
    },
    apartmentActive() {
      return this.editMode
        ? this.editInfo.houseType === this.houseTypes.APARTMENT
        : this.info.houseType === this.houseTypes.APARTMENT
    },
    houseActive() {
      return this.editMode
        ? this.editInfo.houseType === this.houseTypes.HOUSE
        : this.info.houseType === this.houseTypes.HOUSE
    },
  },

  methods: {
    ...mapActions(['updateValue', 'updateDetail', 'postUpdate', 'updateThanks']),
    onHandleHouseType(value) {
      this.updateDetail({ key: 'houseType', value })
    },
    onCheckedDeliveryNotification(value) {
      this.updateDetail({ key: 'notificationTime', value })
    },
    onFloorSelect(value) {
      this.updateDetail({ key: 'apartmentFloor', value })
    },
    submitForm() {
      this.postUpdate({})
      this.updateThanks(true)
      this.$router.push(PATHS.CONFIRM + location.search)
      this.$gtag.event('send_address_info', {
        event_label: 'Send address info',
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.Address-form {
  grid-area: content;
}

form {
  margin-top: $spacing-xxl-2;

  @include media-from($charlie-width) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 0 $spacing-xxl-2;
  }
}

.label,
button,
.Address-form__label,
p {
  grid-column: 1/3;
}

.label {
  margin-bottom: $spacing-m;
}

.Address-form {
  &__header {
    @include media-up-to($beta-width) {
      display: none;
    }
  }
  &__label {
    margin-bottom: $spacing-m;
    .label {
      margin-bottom: 0;
    }

    &-description {
      @extend %text-s;
    }
  }

  &__house-type-selector {
    @include media-up-to($charlie-width) {
      width: calc(50% - 0.75rem);
      display: inline-block;

      & + & {
        margin-left: 1.5rem;
      }
    }
  }

  &__mailbox {
    &-wrapper {
      display: flex;
      flex-direction: column;
      grid-column: 1/3;
    }
    &-icon {
      align-self: center;
    }
    &-title {
      text-align: center;
      font-size: $font-size-l;
      font-weight: $font-weight-default;
      color: $color-black-strong;
    }
    &-text {
      text-align: center;
      font-size: $font-size-s;
      font-weight: $font-weight-default;
      color: $color-black-normal;
    }
  }

  &__button-background {
    grid-column: 1 / 3;
  }

  &__button-background {
    @include media-up-to($beta-width) {
      background-color: $color-brown-subtle;
      padding: 1rem;
      margin: 0 -1rem;
    }
  }

  &__button {
    width: 100%;
  }

  &__button-subtitle {
    display: block;
    font-size: $font-size-xs;
    margin-top: $spacing-m;
    a {
      color: $color-black-strong;
    }

    @include media-up-to($beta-width) {
      text-align: center;
      a {
        display: inline-block;
      }
    }
  }

  &__radio_button_immediately {
    @include media-up-to($charlie-width) {
      margin-bottom: 1rem;
    }
  }
}
</style>
