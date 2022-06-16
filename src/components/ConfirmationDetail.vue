<template>
  <div class="Confirmation-detail">
    <p class="Confirmation-detail__label">{{ label }}</p>
    <p class="Confirmation-detail__item" :data-disabled="notSet">
      {{ notSet ? 'Inget angivet' : content }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'ConfirmationDetail',
  props: {
    label: {
      type: [String, Number],
      required: true,
    },
    content: {
      type: [String, Number],
      default: null,
    },
  },
  computed: {
    notSet() {
      if (this.content === null) return true
      if (typeof this.content === 'string' && this.content.trim().length <= 0) return true
      return false
    },
  },
}
</script>

<style lang="scss" scoped>
.Confirmation-detail {
  &__label {
    @extend %text-s;
  }

  &__item {
    color: $color-black-strong;
    font-weight: $font-weight-bold;

    &[data-disabled='true'] {
      font-style: italic;
      color: $color-black-weak;
    }
  }
}
</style>
