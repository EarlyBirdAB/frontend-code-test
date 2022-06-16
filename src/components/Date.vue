<template>
  <div class="Datepicker__dates-wrapper">
    <div class="Date" :data-type="type">
      <div class="Date__wrapper">
        <div class="Date__top-wrapper">
          <p class="Date__date">26</p>
          <p class="Date__month">jun</p>
        </div>
        <p class="Date__day">Fredag</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Date',
  props: {
    type: {
      type: String,
    },
  },
}
</script>

<style lang="scss" scoped>
.Date {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__wrapper {
    margin: $spacing-s;
  }

  &__top-wrapper {
    width: 59px;
    height: 59px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &__date {
    font-size: $font-size-m;
    font-weight: $font-weight-default;
    line-height: 20px;
    color: $color-black-normal;
  }

  &__month {
    font-size: 14px;
    font-weight: $font-weight-default;
    line-height: 20px;
    margin-top: 0;
    color: $color-black-normal;
  }

  &__day {
    font-size: $font-size-s;
    font-weight: $font-weight-default;
    color: $color-black-normal;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &[data-type='available'] {
    .Date__top-wrapper {
      border: 1px solid $color-black-weak;
      border-radius: 12px;
    }
    .Date__date {
      color: $color-brown-strong;
    }
    .Date__month {
      color: $color-black-normal;
    }
    .Date__day {
      color: $color-black-strong;
    }
  }

  &[data-type='selected'] {
    .Date__top-wrapper {
      border: 2px solid $color-brown-normal;
      border-radius: 12px;
      background-color: $color-brown-normal;
    }
    .Date__date {
      color: $color-white;
    }
    .Date__month {
      color: $color-white;
    }
    .Date__day {
      color: $color-brown-strong;
    }
  }
}
</style>
