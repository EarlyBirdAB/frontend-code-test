<template>
  <main class="error">
    <div class="error-content">
      <h1 class="error-content__title">Sidan hittades inte</h1>
      <p class="error-content__description">
        Förlåt. Ibland blir det fel. Det kan bero på att länken inte funkar längre.<br />
        <a href="https://earlybird.delivery/">Klicka här för att gå till startsidan</a> eller låt vår
        <a href="https://earlybird.delivery/kontakt-hjalp/kontakta-oss/">kundtjänst</a> hjälpa dig vidare.
      </p>
    </div>
  </main>
</template>

<script>
export default {
  name: 'Error',
}
</script>

<style lang="scss" scoped>
.error {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: center;

  &-content {
    margin-top: $spacing-xxl;
    &__title {
      font-size: $font-size-xl;
    }
    &__description {
      margin-top: 0;
    }
  }
}
</style>
