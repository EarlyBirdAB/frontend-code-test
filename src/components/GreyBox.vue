<template>
  <section class="Grey-box">
    <div class="Grey-box__wrapper">
      <p class="Grey-box__text">{{ text }}</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'GreyBox',
  props: {
    text: {
      default: 'Inget alternativ valt...',
    },
  },
}
</script>

<style lang="scss" scoped>
.Grey-box {
  height: 423px;
  background-color: $color-grey-weak;
  border-radius: $border-radius;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  margin-left: 1rem;

  @include media-up-to($beta-width) {
    width: 100%;
    margin-left: 0;
  }

  &__wrapper {
    display: flex;
    flex-direction: row;
  }

  &__text {
    color: $color-black-normal;
    font-size: $font-size-m;
    font-weight: $font-weight-default;
  }
}
</style>
