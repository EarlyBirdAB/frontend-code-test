<template>
  <section class="Address">
    <div class="Address__header">
      <h2>Säkerställ din leverans</h2>
      <p>
        Se över och komplettera dina uppgifter för att vi ska kunna hitta rätt och leverera ditt paket så fort som
        möjligt. Vi levererar tidigt på morgonen – hela vägen till din dörr eller postlåda.
      </p>
    </div>
    <AddressForm />
  </section>
</template>
<script>
import AddressForm from './AddressForm.vue'

export default {
  name: 'Address',
  components: { AddressForm },
}
</script>
<style lang="scss" scoped>
.Address {
  grid-area: content;
}
</style>
