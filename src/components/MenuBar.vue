<template>
  <div class="Menu-bar">
    <div class="Menu-bar__wrapper">
      <router-link v-for="(item, index) in items" :key="index" :to="item.path" custom v-slot="{ navigate }"
        ><button
          class="Menu-bar__button"
          :data-active="index === activeIndex"
          :disabled="item.disabled()"
          @click="navigate"
          role="link"
        >
          <span>{{ `${index + 1}. ${item.text}` }}</span>
        </button></router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuBar',
  computed: {
    currentPath() {
      return this.$route.path
    },
  },
  props: ['items', 'activeIndex'],
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.Menu-bar {
  border: 1px solid $color-black-weak;
  border-radius: 16px;
  margin-bottom: 50px;

  @include media-up-to($beta-width) {
    border: none;
    margin-bottom: 0px;
  }

  &__wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: $spacing-xxl;
    @include media-from($beta-width) {
      align-items: center;
      height: 48px;
      padding: $spacing-xs;
      margin-bottom: 0px; 
    }     
  }

  &__button ~ &__button {
    margin-left: 1px;
    @include media-up-to($beta-width) {        
      margin-left: $spacing-xxs;
    }
  }

  &__button {
    font-size: $font-size-s;
    font-weight: $font-weight-medium;
    color: $color-menu-normal;
    border: none;
    background-color: $color-white;
    flex: 1 1 290px;
    height: 36px;
    cursor: pointer;

    &:focus {
      box-shadow: 0 0 0 1px $color-black;
      @include media-up-to($beta-width) {
        box-shadow: none;
      }
    }

    &[data-active='true'] {
      background-color: $color-brown-weak;
      color: $color-menu-active;
      border-radius: 10px;
      @include media-up-to($beta-width) {        
        background-color: $color-brown-normal;
        border-radius: 0;
      }
    }    
    &[disabled] {
      color: $color-menu-disabled;
      border-radius: 10px;
      cursor: not-allowed;
      @include media-up-to($beta-width) {
        background-color: $color-black-subtle;
        border: none;
        border-radius: 0;
      }
    }

    @include media-up-to($beta-width) {
      flex: 1 0 0;
      height: 6px;
      padding: 0;
      border-radius: 0;
      &:first-child{
        border-radius: 3px 0 0 3px;
      }
      &:last-child{
        border-radius: 0 3px 3px 0;
      }      
      background-color: $color-brown-normal; 
      &[data-active='true'] ~ .Menu-bar__button {  
        background-color: $color-black-weak;      
      }            
      span {
        display: none;
      }
    }
  }
}
</style>
