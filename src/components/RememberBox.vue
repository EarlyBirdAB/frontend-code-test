<template>
  <div class="Remember-box">
    <p class="Remember-box__header">
      <svg-icon icon="clock" width="16px" height="16px"></svg-icon>
      OBS!
    </p>
    <p class="Remember-box__text">
      Detta formulär stängs inom <span class="is-strong">{{ timeLeft }}</span
      >. Efter det kan du inte komplettera dina uppgifter.
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'RememberBox',
  computed: {
    ...mapGetters(['timeLeft']),
  },
}
</script>

<style lang="scss">
.Remember-box {
  border-radius: $border-radius;
  box-shadow: 0px 7px 7px 0px $color-black-weak;
  padding: $spacing-s $spacing-xl;
  margin-bottom: 30px;

  @include media-up-to($beta-width) {
    border: none;
    box-shadow: none;
    padding: 0;
    margin-top: 0;
    // grid-column: 1/4;
  }

  // Varför funkar inte denna?
  @include media-up-to($charlie-width) {
    grid-column: 1/4 !important;
  }
}

.Remember-box__header {
  font-weight: $font-weight-bold;
  color: $color-brown-normal;
  display: flex;
  align-items: center;
  justify-content: center;

  @include media-up-to($beta-width) {
    display: flex;
    justify-content: center;
  }

  .svg-icon {
    margin-right: $spacing-xs;
  }
}

.Remember-box__text {
  text-align: center;

  .is-strong {
    font-weight: $font-weight-bold;
    color: $color-black-strong;
  }
  @include media-up-to($charlie-width) {
    text-align: center;
  }
}

.Remember-box__line {
  @include media-up-to($beta-width) {
    width: 100%;
    margin-top: 30px;
    border-bottom: 1px solid $color-black-weak;
  }
}
</style>
