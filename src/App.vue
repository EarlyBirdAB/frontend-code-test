<template>
  <div id="app" class="app">
    <Error v-if="error" />
    <template v-else-if="contentLoaded">
      <Header />
      <router-view></router-view>
      <Modal v-show="isModalVisible && !hasEdited && !isHomeDelivery" @close="closeModal" />
    </template>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Error from './components/Error.vue'
import Header from './components/Header.vue'
import Modal from './components/Modal.vue'

export default {
  name: 'App',
  components: { Error, Header, Modal },
  data() {
    return {
      isModalVisible: false,
    }
  },
  computed: {
    ...mapState(['error', 'hasEdited', 'activeModal']),
    ...mapGetters(['contentLoaded', 'isHomeDelivery']),
  },
  created() {
    this.setValidations()
    this.getEvents()
    this.getDetails()
  },
  mounted() {},
  methods: {
    ...mapActions(['getDetails', 'getEvents', 'setValidations', 'updateModal']),
    showModal() {
      this.isModalVisible = true
    },
    closeModal() {
      this.isModalVisible = false
      this.updateModal(false)
    },
  },
  watch: {
    hasEdited: function (editedValue) {
      if (editedValue) {
        this.updateModal(false)
      }
    },
    isHomeDelivery: function (value) {
      if (value) {
        this.updateModal(false)
      }
    },
    activeModal: function (modalActive) {
      const modalClass = 'modalVisible'
      const el = document.body
      if (modalActive) {
        el.classList.add(modalClass)
      } else {
        el.classList.remove(modalClass)
      }
    },
  },
}
</script>

<style lang="scss">
body {
  &.modalVisible {
    overflow: hidden;
  }
}
.app {
  display: grid;
  gap: rem(60px);
  grid-template-areas:
    'header'
    'main';
  /* height: 130vh; */
  grid-template-rows: min-content auto;

  @include media-up-to($beta-width) {
    gap: $spacing-xl;
  }
}

.app-main {
  @extend %site-container;
  display: grid;
  grid-area: main;
  grid-template-areas: 'content';
  width: 100%;
  grid-template-rows: rem(82px) auto auto;

  &[data-returnable='true'] {
    grid-template-areas:
      'return'
      'tabs'
      'tracking'
      'content';
  }

  @include media-from($beta-width) {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: auto;
    gap: $spacing-xxl-2;
    grid-template-areas: 'content content tracking tracking';
    padding-bottom: rem(95px);
  }

  @include media-from($charlie-width) {
    gap: $spacing-xxl * 2;
  }
}

.app-main--flex {
  @extend %site-container;
  padding: 0;
  display: flex;
  flex-direction: column;
  grid-area: main;
  width: 100%;
}

@include media-up-to($beta-width) {
  .toggleable-areas {
    display: none;
    &[data-visible='true'] {
      display: initial;
    }
  }
}
</style>
