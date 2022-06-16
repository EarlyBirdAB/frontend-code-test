<template>
  <main class="app-main" v-if="!isHomeDelivery" :data-returnable="canReturn">
    <Address :data-visible="!isTracking" />
    <Tracking class="hide-mobile" :data-visible="isTracking" />
  </main>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Address from '@/components/Address.vue'
import Tracking from '@/components/Tracking.vue'
export default {
  name: 'Root',
  components: { Address, Tracking },
  data() {
    return {
      currentTab: '',
    }
  },
  computed: {
    ...mapState(['canReturn']),
    ...mapGetters(['isHomeDelivery']),
    isTracking() {
      return this.currentTab === 'tab_tracking'
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
@include media-up-to($beta-width - rem(1px)) {
  .hide-mobile {
    display: none;
  }
}
</style>
