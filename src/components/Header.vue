<template>
  <header class="Header" :data-home-delivery="isHomeDelivery">
    <div class="Header__blur-filter" />
    <div class="Header__overlay">
      <div class="Header__content">
        <!-- <a href="">LOGO</a> -->
        <svg-icon icon="earlybird-logo" :override-style="{ width: '90px', height: '32px', stroke: 'none' }" />
        <h1>Avsändare</h1>

        <div class="Header__details" if="isPickup">
          <div>
            <p class="Header__label">Kolli-ID</p>
            {{ barCode }}
          </div>
          <div>
            <p class="Header__label">Hämtas från</p>
            {{ sender.name }}
          </div>
          <div>
            <p class="Header__label">Hämtas upp</p>
            {{ `${formattedArrivalTime.day} 01:00–07:00` }}
            <p class="Header__info hide-mobile" v-if="showEditMessage">Tiden går fortfarande att ändra</p>
          </div>
          <div></div>
          <span class="Header__button" data-type="transparent" @click="toggleAddressInfoModal"
            >Varför syns inte min adress?</span
          >
        </div>
      </div>
    </div>
    <Modal
      v-show="isAddressInfoModalVisible"
      :hide-header="true"
      :horizontal-center="false"
      :cover="false"
      @close="toggleAddressInfoModal"
    >
      <template v-slot:body>
        <p>
          På grund av säkerhetsskäl och GDPR visar vi inte din adress.
          {{
            isPickup
              ? ''
              : `Vid frågor om din leverans eller ändring av adress, vänligen kontakta ${
                  sender ? sender?.name : 'din e-handlare'
                }.`
          }}
        </p>
      </template>
      <template v-slot:footer>
        <Btn class="Button Button--secondary" data-rounded="false" @clicked="toggleAddressInfoModal">Stäng</Btn>
      </template>
    </Modal>
    <div class="Header__bottom" id="scrollto"></div>
  </header>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Tooltip from './Tooltip.vue'
import Modal from '@/components/Modal.vue'
import { firstUppercase } from '../utils/string-helpers'

export default {
  name: 'Header',
  components: { Tooltip, Modal },
  data() {
    return {
      isAddressInfoModalVisible: false,
      moreInfoVisible: false,
    }
  },
  computed: {
    ...mapState(['canEdit', 'barCode', 'metrics', 'receiver', 'sender', 'deliveryDelayed', 'arrivalTime']),
    ...mapGetters(['isHomeDelivery', 'formattedArrivalTime', 'isPickup', 'isDelivered', 'isCollectedAt']),

    formattedWeight() {
      if (!this.metrics.weightInGrams) return
      return this.metrics.weightInGrams
    },
    formattedSize() {
      if (!this.metrics.lengthInCm && !this.metrics.widthInCm && !this.metrics.heightInCm) return '-'
      return this.metrics.lengthInCm + ' x ' + this.metrics.widthInCm + ' x ' + this.metrics.heightInCm + ' cm'
    },
    prefix() {
      return this.isPickup ? 'Upphämtning för' : 'Paket från'
    },
    timeLabel() {
      if (this.isPickup) {
        return this.isCollectedAt ? 'Upphämtad' : 'Hämtas upp'
      }

      if (this.isHomeDelivery) {
        return this.isDelivered ? 'Levererad' : 'Levereras'
      }

      return this.isDelivered ? 'Levererad' : 'Beräknad leverans'
    },
    showEditMessage() {
      return this.isDelivered || this.isReturned || !this.canEdit ? false : true
    },
  },
  methods: {
    ...mapActions(['updateModal']),
    toggleAddressInfoModal() {
      const modalValue = !this.isAddressInfoModalVisible
      this.isAddressInfoModalVisible = modalValue
      this.updateModal(modalValue)
    },
    toggleMoreInfo() {
      this.moreInfoVisible = !this.moreInfoVisible
    },
  },
}
</script>

<style lang="scss" scoped>
.Header {
  grid-area: header;
  width: 100%;
  height: auto;
  background-color: $color-brown-strong;
  color: $color-white;
  background-image: url('@/assets/images/postlador.jpg');
  background-size: cover;
  background-position: left center;
  background-repeat: no-repeat;
  position: relative;
  &[data-home-delivery='true'] {
    background-image: url('@/assets/images/Hemleverans.jpg');
  }
  &__blur-filter {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.4);
  }
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    &__blur-filter {
      background-color: rgba(255, 255, 255, 0.2);
      -webkit-backdrop-filter: blur(2px);
      backdrop-filter: blur(2px);
    }
  }
  h1 {
    color: $color-white;
    letter-spacing: -0.03em;
    @include media-up-to($beta-width) {
      font-size: $font-size-l;
      padding-top: $spacing-xxs;
    }
  }

  &__overlay {
    position: relative;
    width: 100%;
    padding-bottom: $spacing-l;
    padding-top: $spacing-xl;
    @include media-from($charlie-width) {
      padding-bottom: $spacing-l * 3;
    }
    &::before {
      content: '';
      display: block;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background-image: linear-gradient(180deg, rgba(221, 127, 74, 0.7) 0%, rgba(53, 19, 0, 0.7) 58.85%);
      mix-blend-mode: multiply;
    }
  }

  &__content {
    @extend %site-container;
    position: relative;
  }

  &__details {
    margin-top: $spacing-xl;
    margin-bottom: $spacing-s;
    font-weight: $font-weight-bold;

    @include media-from($charlie-width) {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: $spacing-l;
    }

    &[data-type='homedelivery'] > * {
      &:nth-child(1) {
        order: 1;
      }
      &:nth-child(2) {
        order: 3;
      }
      &:nth-child(3) {
        order: 4;
      }
      &:nth-child(4) {
        order: 5;
      }
      &:nth-child(5) {
        order: 2;
      }
      &:nth-child(6) {
        order: 6;
      }
      &:nth-child(7) {
        order: 7;
      }

      &:nth-child(2),
      &:nth-child(6),
      &:nth-child(7) {
        grid-column: 1 / 3;
      }

      @include media-from($charlie-width) {
        &:nth-child(2) {
          order: 2;
        }
        &:nth-child(5) {
          order: 5;
        }

        &:nth-child(2),
        &:nth-child(6),
        &:nth-child(7) {
          grid-column: auto;
        }
      }
    }

    button.hide-mobile {
      @include media-from($charlie-width) {
        display: none;
      }
    }
    .hide-mobile {
      @include media-up-to($charlie-width) {
        display: block;
        max-height: 0;
        overflow: hidden;
        transition: 0.2s ease-in-out;
        opacity: 0;

        &[data-visible='true'] {
          overflow: visible;
          max-height: 100px;
          opacity: 1;
        }
      }
    }

    span {
      font-size: rem(24px);
      @include media-up-to($beta-width) {
        font-size: $font-size-m;
      }
    }
  }

  &__label {
    opacity: 0.7;
    font-weight: $font-weight-default;
    margin-bottom: -10px;

    + p {
      margin-top: $spacing-s;
    }

    &-weight {
      padding-left: 50px;

      @include media-up-to($beta-width) {
        padding-left: 0;
      }
    }
  }

  &__info {
    opacity: 0.9;
    font-size: $font-size-xxs;
  }

  &__button[data-type='transparent'] {
    font-weight: $font-weight-default;
    font-size: $font-size-s;
    text-decoration: underline;
    cursor: pointer;

    @include media-from($charlie-width) {
      display: none;
    }

    .svg-icon {
      margin-left: $spacing-s;
      stroke: $color-white;
      fill: transparent;
      transition: 0.2s ease-in-out transform;
    }
    [data-type='homedelivery'] & {
      margin-top: -1.5rem;
      &[data-visible='true'] {
        margin-top: 0;
      }
    }
    &[data-visible='true'] {
      .svg-icon {
        transform: rotate(180deg);
      }
    }
  }

  &__bottom {
    position: absolute;
    bottom: 0;
  }
}
</style>
