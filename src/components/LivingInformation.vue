<template>
  <section class="living-information">
    <div class="living-information__section">
      <div class="living-information__header-wrapper">
        <h2 class="living-information__header-wrapper--header">Säkerställ {{ pickupOrDelivery }}</h2>
        <p class="living-information__header-wrapper--text">
          Komplettera din information för att hjälpa oss att slutföra {{ pickupOrDelivery }}en så smidigt som möjligt.
        </p>
      </div>
      <p class="living-information__label">Hur bor du?</p>
      <div class="living-information__buttons">
        <button
          class="living-information__button"
          @click="onHandleHouseType(houseTypes.APARTMENT)"
          :data-active="apartmentActive"
        >
          <svg-icon icon="apartment-building" size="extra-large" />
          <span>Jag bor i lägenhet</span>
        </button>
        <button
          class="living-information__button"
          @click="onHandleHouseType(houseTypes.HOUSE)"
          :data-active="houseActive"
        >
          <svg-icon icon="house-building" size="extra-large" />
          <span>Jag bor i villa/radhus</span>
        </button>
      </div>
    </div>
    <div class="living-information__section" v-if="(!editMode && info.houseType) || (editMode && editInfo.houseType)">
      <AddressFields :editMode="editMode" />
    </div>
    <GreyBox :text="'Inget bostadsalternativ valt'" v-else-if="!editMode" />
  </section>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { HOUSE_TYPES } from '@/constants'

import GreyBox from './GreyBox.vue'
import AddressFields from './AddressFields.vue'

export default {
  name: 'LivingInformation',
  components: {
    GreyBox,
    AddressFields,
  },
  data() {
    return {
      houseTypes: HOUSE_TYPES,
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
    ...mapGetters(['isPickup']),
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
    pickupOrDelivery() {
      return this.isPickup ? 'upphämtning' : 'leverans'
    },
  },

  methods: {
    ...mapActions(['updateDetail']),
    onHandleHouseType(value) {
      this.updateDetail({ key: 'houseType', value, editMode: this.editMode })
    },
  },
}
</script>
<style lang="scss" scoped>
.living-information {
  display: flex;

  &__header-wrapper {
    @include media-up-to($beta-width) {
      text-align: center;
    }
  }

  &__header-wrapper--text {
    @include media-up-to($beta-width) {
      font-size: $font-size-s;
    }
  }

  &__section {
    flex-basis: 50%;

    @include media-up-to($beta-width) {
      flex-basis: 100%;
      width: 100%;

      &:nth-child(1) {
        margin-bottom: $spacing-xxl-2;
      }
    }
  }

  .Modal & {
    flex-direction: column;
    &__section {
      flex-basis: 100%;
      margin: 0;
      &:nth-child(1) {
        margin-bottom: $spacing-xxl-2;
      }
    }
  }

  &__label {
    margin-bottom: $spacing-m;
    font-size: $font-size-base;
    font-weight: $font-weight-default;
    color: $color-black-strong;
  }

  &__buttons {
    display: flex;
    flex-direction: column;

    @include media-up-to($beta-width) {
      width: auto;
    }

    .Modal[data-edit='true'] & {
      align-items: center;
      width: 100%;
      @include media-up-to($beta-width) {
        align-items: initial;
      }
    }
  }

  &__button {
    height: 90px;
    width: 482px;
    border-radius: 0;
    border: none;
    border: 1px solid $color-black-weak;
    background-color: $color-white;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    color: $color-black-normal;

    .Modal[data-edit='true'] & {
      width: 100%;
    }

    @include media-up-to($beta-width) {
      width: auto;
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

      span {
        color: $color-white;
      }
    }
  }

  @include media-up-to($beta-width) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
  font-weight: $font-weight-medium;
}

p {
  grid-column: 1/3;
  font-size: $font-size-s;
  margin-bottom: 43px;
}
</style>
