<template>
  <main class="app-main--flex">
    <div class="pickup-delivery">
      <MenuBar v-if="nextUrl" :items="menuItems" :activeIndex="activeMenuIndex" />
      <router-view @editValues="editValues"></router-view>
    </div>

    <Footer
      v-if="nextUrl"
      :prevUrl="prevUrl"
      :nextUrl="nextUrl"
      :disabled="nextDisabled"
      :lastStep="lastStep"
      @confirmClick="onConfirmClick"
    />
    <Modal v-show="showEdit" :hide-header="true" :horizontal-center="false" :edit-mode="true" :sticky-footer="true">
      <template v-slot:body>
        <component v-if="!!componentName" :is="componentName" :editMode="true" />
      </template>
      <template v-slot:footer>
        <Btn class="Button" data-rounded="false" data-type="secondary" @clicked="cancelEditInfo">Avbryt</Btn>
        <Btn class="Button" data-rounded="false" @clicked="saveEditInfo">Spara</Btn>
      </template>
    </Modal>
    <Modal :returning="true" :hideHeader="true" v-if="modalIsOpen && modalStep === 2">
      <template v-slot:body>
        <div class="pickup-delivery__modal-body">
          <return-content :step="modalStep" />
        </div>
      </template>
      <template v-slot:footer>
        <div class="pickup-delivery__button-wrapper">
          <Btn data-rounded="false" data-type="secondary" @clicked="reset">Stäng</Btn>
        </div>
      </template>
    </Modal>
  </main>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import MenuBar from '@/components/MenuBar.vue'
import Modal from '@/components/Modal.vue'
import Footer from '@/components/Footer.vue'
import ReturnContent from '@/components/ReturnContent.vue'
import CompleteInformation from '../shared-components/CompleteInformation.vue'
import ChooseTime from '../shared-components/ChooseTime.vue'
import { PATHS } from '@/constants'

export default {
  name: 'PickupDelivery',
  components: {
    MenuBar,
    Footer,
    Modal,
    CompleteInformation,
    ChooseTime,
    ReturnContent,
  },
  data() {
    return {
      showEdit: false,
      componentName: '',
      menu: [
        {
          text: 'Välj datum',
          path: `${PATHS.PICKUP.path}/${PATHS.PICKUP.CHOOSE_TIME}${location.search}`,
          visible: true,
          disabled: () => false,
        },
        {
          text: 'Information',
          path: `${PATHS.PICKUP.path}/${PATHS.PICKUP.INFO}${location.search}`,
          visible: true,
          disabled: () => !this.timeSlotSelected,
        },
        {
          text: 'Komplettera dina uppgifter',
          path: `${PATHS.PICKUP.path}/${PATHS.PICKUP.COMPLETE_INFORMATION}${location.search}`,
          visible: true,
          disabled: () => !this.timeSlotSelected,
        },
        {
          text: 'Bekräfta',
          path: `${PATHS.PICKUP.path}/${PATHS.PICKUP.CONFIRM_DELIVERY}${location.search}`,
          visible: true,
          disabled: () => !this.timeSlotSelected || !this.houseTypeSelected || (this.showCoField && !this.info.careOf),
        },
        {
          text: 'Tack',
          path: `${PATHS.PICKUP.path}/${PATHS.PICKUP.THANKS}${location.search}`,
          visible: false,
          disabled: () => false,
        },
      ],
    }
  },
  computed: {
    ...mapState(['info', 'hasEdited', 'showCoField']),
    ...mapGetters(['houseTypeSelected', 'timeSlotSelected']),
    ...mapState('return', ['modalIsOpen', 'modalStep']),

    menuItems() {
      return this.menu.filter((item) => item.visible)
    },
    activeMenuIndex() {
      var currentPath = this.$route.path
      return this.menu.findIndex((item) => {
        return item.path.startsWith(currentPath)
      })
    },
    nextUrl() {
      return this.menu[this.activeMenuIndex + 1]?.path
    },
    prevUrl() {
      return this.activeMenuIndex > 0 ? this.menu[this.activeMenuIndex - 1]?.path : ''
    },
    nextDisabled() {
      return this.menu[this.activeMenuIndex + 1].disabled()
    },
    lastStep() {
      return this.activeMenuIndex + 1 === this.menu.length - 1
    },
  },
  methods: {
    ...mapActions(['resetEditInfo', 'postUpdate', 'updateModal', 'updateHasEdited', 'updateThanks']),
    ...mapActions('return', ['reset']),
    editValues(component) {
      this.showEdit = true
      this.componentName = component
      this.resetEditInfo()
      this.updateModal(true)
    },
    saveEditInfo() {
      this.showEdit = false
      this.updateModal(false)
      this.postUpdate({ inModal: true, editMode: !this.hasEdited })
    },
    cancelEditInfo() {
      this.showEdit = false
      this.updateModal(false)
    },
    onConfirmClick() {
      this.postUpdate({})
      this.updateHasEdited(true)
      this.updateThanks(true)
    },
  },
}
</script>

<style lang="scss" scoped>
.pickup-delivery {
  padding: 0 1rem 100px;

  &__modal-body {
    padding-top: 1rem;
  }

  &__button-wrapper {
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

.Button {
  margin: $spacing-xs;
  min-width: 0;
}
</style>
