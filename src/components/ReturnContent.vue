<template>
  <template v-if="step === 1">
    <h2 class="return__header">{{ isReturn ? 'Så här går returen till' : 'Så här går upphämtningen till' }}</h2>
    <div class="return__body">
      <svg-icon
        class="return__body-icon-package svg-no-stroke"
        icon="package"
        :override-style="{ height: '101px', width: '128px' }"
      />
      <h2 class="return__body-header">1. Packa och märk med {{ isReturn ? 'returkod' : 'kod' }}</h2>
      <p class="return__body-text">
        Packa vatten- och stöttåligt! Använd t.ex. en tidning som inre skydd och en slitstark plastpåse som yttre skydd.
        Förslut noga med packtejp och <strong>skriv {{ isReturn ? 'returkoden' : 'koden' }} stort</strong> och tydligt
        på emballaget eller en etikett.
      </p>
      <hr class="return__hr" />
    </div>
    <div class="return__body">
      <h2 class="return__body-header">2. Placera paketet för upphämtning</h2>
      <div class="return__content-wrapper">
        <div class="return__content">
          <svg-icon class="svg-no-stroke" icon="house-building" size="large" />
          <div>
            <h2 class="return__content-header">Villa/radhus</h2>
            <p class="return__content-text">Placera paketet i eller vid din postlåda.</p>
          </div>
        </div>
        <div class="return__content">
          <svg-icon class="svg-no-stroke" icon="apartment-building" size="large" />
          <div>
            <h2 class="return__content-header">Lägenhet</h2>
            <p class="return__content-text">Placera paketet utanför din dörr.</p>
          </div>
        </div>
      </div>
      <hr class="return__hr" />
    </div>
    <div class="return__body">
      <svg-icon
        class="return__body-icon-truck svg-no-stroke"
        icon="truck-bird"
        :override-style="{ height: '72px', width: '112px' }"
      />
      <h2 class="return__body-header">3. Vi hämtar paketet på natten</h2>
      <p class="return__body-text" v-if="isReturn">Budet hämtar upp ditt paket och returnerar det till e-handlaren.</p>
      <p class="return__body-text" v-else>Budet hämtar upp ditt paket och skickar det vidare till mottagaren.</p>
      <div class="return__body-pickup-wrapper">
        <div class="return__body-pickup-content">
          <svg-icon class="return__body-icon-exclamation-mark svg-no-stroke" icon="exclamation-mark" size="small" />
          <p class="return__body-pickup-text">Vi kommer hämta upp paketet inatt eller natten därpå.</p>
        </div>
      </div>
    </div>
  </template>
  <template v-else-if="step === 2">
    <template v-if="isReturn">
      <div>
        <div class="return__icon-wrapper">
          <div class="return__icon-background">
            <svg-icon class="return__body-icon-check" icon="check-return" size="small" />
          </div>
        </div>
        <h2 class="return__header return__header-booked">Retur bokad!</h2>
        <p class="return__header-text">Vi hämtar ditt paket</p>
        <div class="return__body-wrapper">
          <p class="return__body-wrapper-text">{{ time }}</p>
          <p class="return__body-wrapper-time">01:00–07:00</p>
        </div>
      </div>
      <hr class="return__hr" />
    </template>
    <div class="return__body">
      <h2 class="return__header">Så går det till</h2>
      <h2 class="return__body-header">
        1. Du packar ditt paket och märker det med din {{ isReturn ? 'returkod' : 'kod' }}
      </h2>
      <svg-icon
        class="return__body-icon-package svg-no-stroke"
        icon="package"
        :override-style="{ height: '101px', width: '128px' }"
      />
      <p class="return__body-text" v-if="isReturn">
        Packa paketet så det kan hantera väta. Du kan använda en tejpad plastpåse om du inte har ett emballage. Förslut
        och <strong>skriv koden</strong> på paketet. Skriv stort och synligt direkt på emballaget eller på en etikett.
      </p>
      <p class="return__body-text" v-else>
        Packa vatten- och stöttåligt! Använd t.ex. en tidning som inre skydd och en slitstark plastpåse som yttre skydd.
        Förslut noga med packtejp och <strong>skriv koden stort</strong> och tydligt på emballaget eller en etikett.
      </p>
      <div class="return__body-wrapper-code">
        <p class="return__body-code">{{ safeCode }}</p>
      </div>
      <hr class="return__hr" />
    </div>
    <div class="return__body">
      <h2 class="return__body-header">2. Du placerar ditt paket för upphämtning</h2>
      <div class="return__content-wrapper">
        <div class="return__content">
          <svg-icon class="svg-no-stroke" icon="house-building" size="large" />
          <div>
            <h2 class="return__content-header">Villa/radhus</h2>
            <p class="return__content-text">Placera paketet i eller vid din postlåda.</p>
          </div>
        </div>
        <div class="return__content">
          <svg-icon class="svg-no-stroke" icon="apartment-building" size="large" />
          <div>
            <h2 class="return__content-header">Lägenhet</h2>
            <p class="return__content-text">Placera paketet utanför din dörr.</p>
          </div>
        </div>
      </div>
      <div class="return__body-return-time-wrapper">
        <p class="return__body-return-time">
          Ställ ut paketet <span class="return__body-return-time-orange">{{ timeUntilPickup }}</span>
        </p>
      </div>
      <p>Vi påminner dig via sms samma kväll som du skall ställa ut ditt paket.</p>
      <hr class="return__hr" />
    </div>
    <div class="return__body">
      <svg-icon
        class="return__body-icon-door svg-no-stroke"
        icon="truck-bird"
        :override-style="{ height: '72px', width: '112px' }"
      />
      <h2 class="return__body-header">3. Vi hämtar ditt paket på natten</h2>
      <p class="return__body-text" v-if="isReturn">Budet hämtar upp ditt paket och returnerar det till e-handlaren.</p>
      <p class="return__body-text" v-else>Budet hämtar upp ditt paket och skickar det vidare till mottagaren.</p>
    </div>
  </template>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { getDay } from '@/utils/date-helpers'

export default {
  name: 'ReturnContent',
  props: {
    step: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    ...mapState('return', ['modalIsOpen', 'modalStep']),
    ...mapState(['arrivalTime', 'pickupCode', 'canReturn', 'info']),
    ...mapGetters(['isReturn', 'timeUntilPickup']),
    safeArrivalTime() {
      if (!this.arrivalTime?.start) return new Date(this.info.timeSlot.start)
      return this.arrivalTime.start
    },
    safeCode() {
      return this.pickupCode || '1234'
    },
    time() {
      return getDay(new Date(this.safeArrivalTime))
    },
  },
  methods: {
    ...mapActions('return', ['toggleModal', 'postReturn', 'reset']),
  },
}
</script>

<style lang="scss" scoped>
.return {
  &__header {
    font-size: 24px;
    font-weight: $font-weight-medium;
    color: $color-black-strong;

    &-booked {
      margin-top: $spacing-m;
    }

    &-text {
      font-size: $font-size-base;
      font-weight: $font-weight-default;
      color: $color-black-strong;
      margin-top: $spacing-s;
    }
  }

  &__icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: $spacing-xxl-3;
  }

  &__icon-background {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $color-delivered;
    border-radius: $border-radius-round;
    width: 34px;
    height: 34px;
  }

  &__body {
    &-icon {
      &-package {
        width: 127px;
        height: 101px;
        margin: 0;
        margin-bottom: $spacing-l;
        margin-top: $spacing-l;
      }

      &-check {
        width: 16px;
        height: 16px;
        text-align: center;
      }

      &-exclamation-mark {
        width: 5px;
        height: 20px;
      }
    }

    &-header {
      font-size: $font-size-base;
      font-weight: $font-weight-default;
      color: $color-black-strong;
      text-align: center;
    }

    &-text {
      font-size: $font-size-s;
      font-weight: $font-weight-default;
      color: $color-black-normal;
      text-align: center;
      margin-bottom: $spacing-m;
    }

    &-pickup {
      &-wrapper {
        background-color: $color-brown-subtle;
        border-radius: $border-radius-small;
        padding: $spacing-s $spacing-xl;
      }

      &-content {
        display: flex;
        align-items: center;
      }

      &-text {
        font-size: $font-size-s;
        font-weight: $font-weight-default;
        color: $color-black;
        margin-left: $spacing-xs;
      }
    }

    &-return-time-wrapper {
      background-color: $color-orange-subtle;
      border-radius: $border-radius-medium;
      padding: $spacing-xs;
      margin-bottom: $spacing-xl;
      margin-top: $spacing-xl;
      min-height: rem(58px);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-return-time {
      font-size: $font-size-base;
      font-weight: $font-weight-default;
      color: $color-black-strong;
      text-align: center;

      &-orange {
        color: $color-brown-strong;
      }
    }

    &-return-date {
      font-size: $font-size-s;
      font-weight: $font-weight-default;
      color: $color-black-normal;
      text-align: center;
    }

    &-subheader {
      font-size: $font-size-base;
      font-weight: $font-weight-default;
      color: $color-black-strong;
    }

    &-wrapper {
      background-color: $color-black-subtle;
      border: 1px solid $color-black-weak;
      border-radius: $border-radius;
      padding: 18px 72px;
      margin-top: $spacing-m;

      &-text {
        font-size: $font-size-base;
        font-weight: $font-weight-default;
        color: $color-black-strong;
        text-align: center;
      }

      &-time {
        font-size: $font-size-l;
        font-weight: $font-weight-bold;
        color: $color-brown-strong;
        text-align: center;
      }
    }

    &-wrapper-code {
      background-color: $color-orange-subtle;
      border-radius: $border-radius-medium;
    }

    &-code {
      font-size: 28px;
      font-weight: $font-weight-bold;
      color: $color-brown-strong;
      text-align: center;
      padding: $spacing-xs;
    }
  }

  &__content-wrapper {
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
    margin-top: $spacing-xl;
  }

  &__content {
    display: flex;
    text-align: left;

    svg {
      margin-right: $spacing-l;
    }

    &-header {
      font-size: $font-size-s;
      font-weight: $font-weight-default;
      color: $color-black;
    }

    &-text {
      font-size: $font-size-s;
      font-weight: $font-weight-default;
      color: $color-black-normal;
      margin: 0;
    }
  }

  &__hr {
    border-top: 1px solid $color-black-weak;
    margin-top: $spacing-xxl;
    margin-bottom: $spacing-xxl-2;
  }

  &__button {
    flex-basis: 30%;
    @include media-up-to($beta-width) {
      flex-basis: 40%;
    }

    &-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 88px;
      width: 100%;
      background-color: $color-black-subtle;

      .Button {
        flex-grow: 1;
      }
    }
  }
}

.Button {
  margin: $spacing-xs;
  min-width: 0;
}
</style>
