<template>
  <div>
    <ConfirmationDetail label="Typ av bostad" :content="houseTypesText[info.houseType]" />
    <ConfirmationDetail label="c/o-adress" :content="info.careOf" />
    <template v-if="isApartment(false)">
      <ConfirmationDetail label="Lägenhetsnummer" :content="info.apartmentNumber" />
      <ConfirmationDetail label="Våning" :content="info.apartmentFloor" />
      <ConfirmationDetail label="Portkod" :content="info.doorCode" />
    </template>
    <slot></slot>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { HOUSE_TYPES_TEXT } from '@/constants'
import ConfirmationDetail from './ConfirmationDetail.vue'

export default {
  name: 'ConfirmationDetails',
  components: { ConfirmationDetail },
  data() {
    return {
      houseTypesText: HOUSE_TYPES_TEXT,
    }
  },
  computed: {
    ...mapState(['info']),
    ...mapGetters(['isApartment']),
  },
}
</script>

<style lang="scss" scoped></style>
