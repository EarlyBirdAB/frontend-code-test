<template>
  <button
    v-if="canReschedule && isFailedPickup && !arrivalTime"
    class="rebook-time"
    data-type="tertiary"
    @click="toggleModal"
  >
    <svg-icon icon="calendar" size="small" />Boka ny upphämtning
  </button>
  <teleport to="body">
    <modal v-show="modalIsOpen" :hide-header="true">
      <template v-slot:body>
        <slot>
          <div class="rebook-time__modal-content">
            <h2 class="rebook-time__modal-header">Är du säker på att du vill boka upphämtning närmsta möjliga dag?</h2>
            <p class="rebook-time__modal-text">
              Du kan inte ändra upphämtningsdatum efter att du har bokat upphämtning.
            </p>
          </div>
        </slot>
      </template>
      <template v-slot:footer>
        <button class="rebook-time__modal-button" data-type="secondary" @click="onCancel">Avbryt</button>
        <button class="rebook-time__modal-button" @click="onConfirm">Boka</button>
      </template>
    </modal>
  </teleport>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Modal from '@/components/Modal.vue'

export default {
  name: 'RebookTime',
  components: { Modal },
  data: () => ({
    modalIsOpen: false,
  }),
  computed: {
    ...mapState(['canReschedule', 'arrivalTime']),
    ...mapGetters(['isFailedPickup']),
  },
  methods: {
    ...mapActions(['rescheduleTime', 'updateDetail']),
    toggleModal() {
      this.modalIsOpen = !this.modalIsOpen
    },
    onCancel() {
      this.toggleModal()
      this.updateDetail({ key: 'timeSlot', value: null })
    },
    onConfirm() {
      this.toggleModal()
      this.rescheduleTime()
    },
  },
}
</script>

<style lang="scss" scoped>
.rebook-time {
  @extend %button;
  width: 100%;
  margin-block: 0.5rem 1rem;
  @include media-up-to($beta-width) {
    margin-top: 0;
  }

  svg {
    margin-right: 0.5rem;
  }

  &__modal-button {
    @extend %button;
    min-width: auto;
    flex-grow: 1;
    flex-basis: 50%;
    margin-inline: 4px;
    &:first-of-type {
      margin-left: 0;
    }
    &:last-of-type {
      margin-right: 0;
    }
  }
}
</style>
