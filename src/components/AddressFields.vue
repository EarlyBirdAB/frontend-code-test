<template>
  <div class="Address-fields">
    <FormInput
      class="Address-fields__co_address"
      type="text"
      uniqid="form_input_co"
      placeholder="Efternamn..."
      label="Jag har c/o-adress"
      description="Ange det efternamn som står på dörren/postlådan."
      :max-length="35"
      :value="editMode ? editInfo.careOf : info.careOf"
      @input="(value) => onUpdateValue('careOf', value)"
      @openHelp="() => toggleCoModal()"
      @show-field="(value) => updateValue({ key: 'showCoField', value })"
      :modalTooltip="editMode"
      :isCo="true"
    />

    <template v-if="isApartment(editMode)">
      <FormInput
        uniqid="form_input_apartno"
        placeholder="1201..."
        label="Lägenhetsnummer"
        description="Om du inte vet, lämna fältet tomt."
        :value="editMode ? editInfo.apartmentNumber : info.apartmentNumber"
        @input="(value) => onUpdateValue('apartmentNumber', value)"
        pattern="[0-9*]+"
        pattern-tooltip="Endast siffror är tillåtna"
      />
      <DropdownSelect
        label="Våning"
        uniqid="form_input_floor"
        textarea="Välj"
        description="Bottenvåning är samma som 0 eller E."
        :value="editMode ? editInfo.apartmentFloor : info.apartmentFloor"
        :options="floorOptions"
        @change="onFloorSelect"
      />
      <FormInput
        label="Portkod"
        uniqid="form_input_door_code"
        placeholder="6751..."
        :max-length="10"
        :description="`Om du inte har det, lämna fältet tomt.${
          isHomeDelivery ? '' : ' Har du porttelefon kommer vi in ändå.'
        }`"
        :value="editMode ? editInfo.doorCode : info.doorCode"
        @input="(value) => onUpdateValue('doorCode', value)"
      />
    </template>
    <Modal v-show="isCoModalVisible" :hide-header="true" :horizontal-center="false">
      <template v-slot:body>
        <CareOfContent />
      </template>
      <template v-slot:footer>
        <Btn class="Button--secondary" @clicked="toggleCoModal">Stäng</Btn>
      </template>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { HOUSE_TYPES, DELIVERY_TYPES, DELIVERY_TYPES_TEXT, FLOORS } from '@/constants'

import FormInput from './forms/FormInput.vue'
import DropdownSelect from './forms/DropdownSelect.vue'
import CareOfContent from '@/components/CareOfContent.vue'
import Modal from '@/components/Modal.vue'

export default {
  name: 'AddressFields',
  components: { FormInput, DropdownSelect, CareOfContent, Modal },
  data() {
    return {
      floorOptions: FLOORS,
      houseTypes: HOUSE_TYPES,
      deliveryTypes: DELIVERY_TYPES,
      deliveryTypesText: DELIVERY_TYPES_TEXT,
      isCoModalVisible: false,
    }
  },

  props: {
    editMode: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState(['checkedDeliveryNotification', 'info', 'editInfo']),
    ...mapGetters(['isApartment', 'isHomeDelivery']),
  },

  methods: {
    ...mapActions(['updateDetail', 'updateModal', 'updateValue']),
    onUpdateValue(key, value) {
      this.updateDetail({ key, value, editMode: this.editMode })
    },
    toggleCoModal() {
      const value = !this.isCoModalVisible
      this.isCoModalVisible = value
      this.updateModal(value)
    },
    onFloorSelect(value) {
      this.updateDetail({ key: 'apartmentFloor', value, editMode: this.editMode })
    },
    showCo() {},
  },
}
</script>
<style lang="scss" scoped>
.Address-fields {
  grid-column: 1/3;
  @include media-from($charlie-width) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 0 $spacing-xxl-2;
  }
}

.label,
p {
  grid-column: 1/3;
}

.Address-fields {
  &__label {
    margin-bottom: $spacing-m;
    .label {
      margin-bottom: 0;
    }

    &-description {
      @extend %text-s;
    }
  }

  &__co_address {
    grid-column: 1 / 3;
  }

  &__radio_button_immediately {
    @include media-up-to($charlie-width) {
      margin-bottom: 1rem;
    }
  }
}
</style>
