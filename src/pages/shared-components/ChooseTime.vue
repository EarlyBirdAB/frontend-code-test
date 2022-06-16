<template>
  <Datepicker :editMode="editMode" />
</template>

<script>
import Datepicker from '@/components/Datepicker.vue'

export default {
  name: 'ChooseTime',
  components: { Datepicker },
  props: {
    editMode: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
