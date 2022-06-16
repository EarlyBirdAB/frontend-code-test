<template>
  <main class="confirm app-main--flex">
    <Return class="confirm__return-mobile" />
    <div class="confirm__sections">
      <tab-select class="confirm__tab-select" :tabs="tabs" @switch="handleTabSwitch" />
      <Confirmation class="toggleable-areas" :data-visible="!isTracking" />
      <Tracking class="toggleable-areas" :data-visible="isTracking" :header="trackText">
        <rebook-time />
      </Tracking>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import Confirmation from '@/components/Confirmation.vue'
import Tracking from '@/components/Tracking.vue'
import TabSelect from '@/components/TabSelect.vue'
import Return from '@/components/Return.vue'
import RebookTime from '@/components/RebookTime.vue'

export default {
  name: 'Confirm',
  components: { TabSelect, Confirmation, Tracking, Return, RebookTime },

  data() {
    return {
      currentTab: 'tab_tracking',
      modalIsOpen: false,
    }
  },
  computed: {
    ...mapGetters(['isPickup']),
    isTracking() {
      return this.currentTab === 'tab_tracking'
    },
    trackText() {
      return this.isPickup ? 'Status' : 'Spåra'
    },
    tabs() {
      return [
        {
          label: 'Dina uppgifter',
          value: 'tab_confirm',
          active: this.currentTab === 'tab_confirm',
        },
        {
          label: this.trackText,
          value: 'tab_tracking',
          active: this.currentTab === 'tab_tracking',
        },
      ]
    },
  },
  methods: {
    handleTabSwitch(value) {
      this.currentTab = value
    },
  },
}
</script>

<style lang="scss" scoped>
.confirm {
  @include media-up-to($beta-width) {
    > * {
      margin-inline: 1rem;
    }
    &__tab-select {
      margin-bottom: 1rem;
    }
  }

  &__return-mobile {
    display: none;
    @include media-up-to($beta-width) {
      display: flex;
      margin: -1.5rem 0 2rem;
    }
  }

  &__sections {
    display: flex;
    margin-inline: -1rem;
    > * {
      flex-basis: 100%;
      margin-inline: 1rem;
    }

    @include media-up-to($beta-width) {
      flex-direction: column;
      margin-inline: 1rem;
      > * {
        margin-inline: 0;
      }
    }
  }
}
</style>
