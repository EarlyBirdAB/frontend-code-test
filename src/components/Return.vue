<template>
  <div class="return-wrapper">
    <div class="return" :data-hidden="isReturning || !canReturn">
      <svg-icon class="return__icon" icon="return" />
      <div class="return__content">
        <p class="return__content-title">
          <svg-icon class="return__content-icon" icon="return" size="small" />Returnera enkelt
        </p>
        <p class="return__content-description">Vi hämtar hos dig inatt!</p>
      </div>
      <Btn modifiers="auto" class="return__button" @clicked="toggleModal">Returnera</Btn>
    </div>
    <Modal :returning="true" :hideHeader="true" v-if="modalIsOpen && modalStep === 1">
      <template v-slot:body>
        <return-content :step="modalStep" />
      </template>
      <template v-slot:footer>
        <div class="return__button-wrapper">
          <Btn data-rounded="false" data-type="secondary" @clicked="toggleModal">Avbryt</Btn>
          <Btn data-rounded="false" @clicked="postReturn">Boka</Btn>
        </div>
      </template>
    </Modal>
    <Modal :returning="true" :hideHeader="true" v-if="modalIsOpen && modalStep === 2">
      <template v-slot:body>
        <return-content :step="modalStep" />
      </template>
      <template v-slot:footer>
        <div class="return__button-wrapper">
          <Btn data-rounded="false" data-type="secondary" @clicked="reset">Stäng</Btn>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

import Modal from './Modal.vue'
import ReturnContent from './ReturnContent.vue'

export default {
  name: 'Return',
  components: { Modal, ReturnContent },
  computed: {
    ...mapState('return', ['modalIsOpen', 'modalStep']),
    ...mapState(['canReturn']),
    ...mapGetters(['isReturning']),
  },
  methods: {
    ...mapActions('return', ['toggleModal', 'postReturn', 'reset']),
  },
}
</script>

<style lang="scss" scoped>
.return {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 1rem;
  background-color: $color-brown-subtle;
  border-radius: $border-radius-medium;
  color: $color-black;
  width: 100%;

  @include media-up-to($beta-width) {
    border-radius: 0;
  }

  &[data-hidden='true'] {
    display: none;
  }

  &__icon {
    flex-basis: 10%;
    @include media-up-to($beta-width) {
      display: none;
    }
  }

  &__content-title {
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    display: flex;
    align-items: center;
  }

  &__content-icon {
    display: none;
    margin-right: $spacing-xs;
    @include media-up-to($beta-width) {
      display: initial;
    }
  }

  &__content-description {
    color: $color-black-normal;
  }

  &__content {
    padding: 10px;

    &:first-child {
      border-right: 1px solid $color-black-weak;
    }
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
