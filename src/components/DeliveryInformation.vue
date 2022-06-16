<template>
  <div class="Delivery-information">
    <div class="Delivery-information__header">
      <h2>Hur vill du ha ditt paket levererat?</h2>
    </div>
    <div class="Delivery-information__button-wrapper">
      <button
        class="Delivery-information__button"
        :data-active="doorActive"
        @click="onHandleDeliveryType(deliveryTypes.DOOR)"
      >
        <svg-icon icon="delivery-door" size="extra-large" />
        <div class="Delivery-information__button-text">
          <span>Lämna paketet vid min dörr</span>
          <p>Du får ett sms när paketet är levererat</p>
        </div>
      </button>
      <button
        class="Delivery-information__button"
        :data-active="personalActive"
        @click="onHandleDeliveryType(deliveryTypes.PERSONAL)"
      >
        <svg-icon icon="delivery-personal" size="extra-large" />
        <div class="Delivery-information__button-text">
          <span>Jag vill ta emot paketet personligen</span>
          <p>Du eller någon i ditt hushåll behöver vara hemma för att ta emot paketet</p>
        </div>
      </button>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { DELIVERY_TYPES_HOMEDELIVERY } from '@/constants'

export default {
  name: 'DeliveryInformation',
  components: {},
  data() {
    return {
      deliveryTypes: DELIVERY_TYPES_HOMEDELIVERY,
    }
  },
  props: {
    editMode: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState(['checkedDeliveryNotification', 'info', 'editInfo']),
    doorActive() {
      return this.editMode
        ? this.editInfo.deliveryType === this.deliveryTypes.DOOR
        : this.info.deliveryType === this.deliveryTypes.DOOR
    },
    personalActive() {
      return this.editMode
        ? this.editInfo.deliveryType === this.deliveryTypes.PERSONAL
        : this.info.deliveryType === this.deliveryTypes.PERSONAL
    },
  },

  methods: {
    ...mapActions(['updateDetail']),
    onHandleDeliveryType(value) {
      this.updateDetail({ key: 'deliveryType', value, editMode: this.editMode })
      this.updateDetail({ key: 'arrivalMessage', value: null, editMode: this.editMode })
    },
  },
}
</script>
<style lang="scss">
.Delivery-information {
  &__label {
    margin-bottom: $spacing-m;
    font-size: $font-size-base;
    font-weight: $font-weight-default;
    color: $color-black-strong;
  }

  &__button-text {
    text-align: left;
  }

  &__button-wrapper {
    display: flex;
    flex-direction: column;

    @include media-up-to($beta-width) {
      align-items: center;
      width: 100%;
    }

    .Modal[data-edit='true'] & {
      align-items: center;
      width: 100%;
    }
  }

  &__button {
    min-height: 90px;
    width: 482px;
    padding: 15px 15px 15px 0;
    border-radius: 0;
    border: none;
    border: 1px solid $color-black-weak;
    background-color: $color-white;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    color: $color-black-normal;

    svg {
      flex-shrink: 0;
    }

    .Modal[data-edit='true'] & {
      width: 100%;
    }

    @include media-up-to($beta-width) {
      width: 100%;
      max-width: 482px;
    }

    &:first-of-type {
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
    }

    &:last-of-type {
      border-bottom-left-radius: $border-radius;
      border-bottom-right-radius: $border-radius;
    }

    & ~ & {
      border-top: none;
    }

    &[data-active='true'] {
      background-color: $color-brown-normal;
      color: $color-white;

      span,
      p {
        color: $color-white;
      }
    }
  }

  .svg-icon {
    margin-left: $spacing-xxl;
    margin-right: $spacing-l;
    width: 42px;
    height: 42px;
  }

  span {
    color: $color-brown-strong;
    font-weight: $font-weight-default;
  }

  h2 {
    color: $color-black-strong;
    margin-bottom: 39px;

    @include media-up-to($beta-width) {
      text-align: center;
      margin-bottom: $spacing-xxl-2;
    }
  }

  p {
    font-size: $font-size-s;
    font-weight: $font-weight-default;
    color: $color-black-normal;
  }

  form {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
