<template>
  <label class="checkbox">
    <input class="checkbox__input" type="checkbox" :value="value" :checked="value" @input="$emit('change', value)" />
    <span class="checkbox__indicator"></span>
    <slot></slot>
  </label>
</template>

<script>
export default {
  name: 'Checkbox',
  emits: ['change'],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
$checkbox-size: 24px;
.checkbox {
  position: relative;
  display: flex;
  padding-left: 40px;
  cursor: pointer;
  align-items: center;
  margin-bottom: 10px;

  &__input {
    position: absolute;
    opacity: 0;
    z-index: -1; /* Put the input behind the label so it doesn't overlay text */
  }

  &__indicator {
    position: absolute;
    top: 0.25rem;
    left: 0;
    display: block;
    width: $checkbox-size;
    height: $checkbox-size;
    line-height: $checkbox-size;
    border-radius: $border-radius-xsmall;
    font-size: 65%;
    color: $color-brown-subtle;
    text-align: center;
    background-color: $color-brown-subtle;
    background-size: 50% 50%;
    background-position: center center;
    background-repeat: no-repeat;
    user-select: none;
    border: 2px solid $color-brown-weak;
  }

  /* Hover state */
  /* Uncomment if you need it, but be aware of the sticky iOS states.
.control:hover .control-indicator {
  color: #fff;
  background-color: #ccc;
}
*/

  /* Focus */
  &__input:focus ~ &__indicator {
    box-shadow: 0 0 0 0.075rem #fff, 0 0 0 0.2rem $color-black;
  }

  /* Checked state */
  &__input:checked ~ &__indicator {
    color: #fff;
    background-color: $color-brown-strong;
    border-color: $color-brown-strong;
  }

  /* Active */
  &__input:active ~ &__indicator {
    color: #fff;
    background-color: $color-brown-weak;
  }

  /* Checkbox modifiers */
  &__input:checked ~ &__indicator {
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNy4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgOCA4IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA4IDgiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTYuNCwxTDUuNywxLjdMMi45LDQuNUwyLjEsMy43TDEuNCwzTDAsNC40bDAuNywwLjdsMS41LDEuNWwwLjcsMC43bDAuNy0wLjdsMy41LTMuNWwwLjctMC43TDYuNCwxTDYuNCwxeiINCgkvPg0KPC9zdmc+DQo=);
  }
}
</style>
