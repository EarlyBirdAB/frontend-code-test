<template>
  <LivingInformation :editMode="editMode" />
</template>

<script>
import LivingInformation from '@/components/LivingInformation.vue'

export default {
  name: 'CompleteInformation',
  components: { LivingInformation },
  props: {
    editMode: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
