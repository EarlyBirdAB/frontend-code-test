<template>
  <div class="Summary-section" :data-compact="compact" :data-address="address">
    <div class="Summary-section__column Summary-section__column--left">
      <div class="Summary-section__column--wrapper">
        <span class="Summary-section__text"><slot name="section-left"></slot></span>
        <button class="Summary-section__button" v-if="showEditButton" @click="$emit('change')">Ändra</button>
      </div>
    </div>
    <div class="Summary-section__column">
      <slot name="section-right"></slot>
    </div>
    <!-- <slot name="text-right-big"></slot>
    <slot name="text-right-calendar"></slot> -->

    <!-- <div class="Summary-section__">
        <h3>Torsdag 17 juni</h3>
        <p>18:00-22:00</p>
        <div class="Summary__first-section-calendar">
          <svg-icon icon="calendar" />
          <p>Lägg till i kalender</p>
        </div>
      </div> -->
  </div>
</template>

<script>
export default {
  name: 'SummarySection',
  props: {
    compact: {
      type: Boolean,
      default: false,
    },
    address: {
      type: Boolean,
      default: false,
    },
    showEditButton: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.Summary-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  &__column {
    flex-basis: calc(50% - 12px);
  }

  &__column--left {
    font-weight: $font-weight-default;
    color: $color-black-normal;
    font-size: $font-size-s;
  }

  &__text {
    margin-right: 0.5rem;
  }

  &__button {
    background-color: transparent;
    border: none;
    font-weight: $font-weight-bold;
    font-size: 14px;
    color: $color-brown-strong;
    text-decoration: underline;
    padding: 0;
    cursor: pointer;
  }

  &[data-compact='true'] {
    .Summary-section__column {
      flex-basis: calc(66% - 12px);
      &--left {
        flex-basis: calc(33% - 12px);
      }
    }

    .Summary-section__column--wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &[data-address='true'] {
    flex-direction: row;

    @include media-up-to($beta-width) {
      flex-direction: column;
    }
    // flex-basis: calc(66% - 12px);
    // &--left {
    //   flex-basis: calc(33% - 12px);
    // }

    .Summary-section__column--left {
      margin-bottom: $spacing-l;
    }

    .Summary-section__column--wrapper {
      flex-direction: column;
      align-items: flex-start;
      @include media-up-to($beta-width) {
        flex-direction: row;
        align-items: center;
      }
    }
  }
}
</style>
