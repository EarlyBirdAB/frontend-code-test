<template>
  <div class="pickup-information">
    <return-content :step="2" />
  </div>
</template>

<script>
import ReturnContent from '../../../components/ReturnContent.vue'

export default {
  name: 'PickupInformation',
  components: { ReturnContent },
}
</script>

<style lang="scss" scoped>
.pickup-information {
  max-width: 790px;
  margin: 0 auto;
  text-align: center;
}
</style>
