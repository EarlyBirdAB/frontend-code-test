<template>
  <div class="Care-of-content">
    <div>
      <h3 class="Care-of-content-header">Vad är C/O?</h3>
      <p class="Care-of-content-text">
        Står inte ditt eget efternamn på dörren/postlådan? Du är kanske inneboende, någon annan kanske tar hand om din
        post eller så hyr du bostaden. Då har du ofta en c/o-adress. Ange efternamnet på personen som står på adressen
        under raden c/o, detta är ett adresstillägg som hjälper oss att hitta rätt.
      </p>
    </div>
    <div>
      <h3 class="Care-of-content-header">What is C/O?</h3>
      <p class="Care-of-content-text">
        If your last name is not on the door/mailbox, you often have a c/o address. You may be renting a place or
        perhaps someone takes care of your mail. Add the last name of the person listed at the address under c/o.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CareOfContent',
}
</script>

<style lang="scss">
.Care-of-content {
  &-text {
    font-size: $font-size-s;
    font-weight: $font-weight-default;
    color: $color-black-normal;
    text-align: left;
    margin-left: $spacing-m;
    padding-bottom: $spacing-m;
  }

  &-header {
    text-align: left;
    margin-left: $spacing-m;
    font-size: $font-size-l;
  }
}
</style>
