<template>
  <div>
    <TrackingHomeDelivery @editValues="(component) => $emit('editValues', component)" />
  </div>
</template>

<script>
import TrackingHomeDelivery from '@/components/TrackingHomeDelivery.vue'

export default {
  name: 'Thanks',
  components: { TrackingHomeDelivery },
}
</script>
