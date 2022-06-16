<template>
  <Summary @editValues="(component) => $emit('editValues', component)" :show-date="timeSlotSelected" />
</template>

<script>
import Summary from '@/components/Summary.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'ConfirmDelivery',
  components: { Summary },
  computed: {
    ...mapGetters(['timeSlotSelected']),
  },
}
</script>
