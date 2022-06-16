<template>
  <div class="Feedback-box">
    <svg-icon icon="lamp" size="extra-large" />
    <h2 class="Feedback-box__header">Hjälp oss att bli bättre!</h2>
    <p class="Feedback-box__text">Hur gick det att fylla i dina uppgifter? Din åsikt är anonym.</p>
    <div class="Feedback-box__textarea-wrapper-confirmed" v-if="feedbackSent">
      <div class="Feedback-box__confirmed-icon">😊</div>
      <h2 class="Feedback-box__text-confirmed">Tack för din åsikt!</h2>
    </div>
    <div class="Feedback-box__textarea-wrapper" v-else>
      <textarea class="Feedback-box__textarea" placeholder="Skriv din åsikt här..." v-model="feedback"> </textarea>
      <Btn class="Feedback-box__textarea-button" data-rounded="false" @clicked="sendFeedback" :disabled="isDisabled"
        >Skicka</Btn
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'FeedbackBox',
  data() {
    return {
      feedback: '',
    }
  },
  computed: {
    ...mapState(['feedbackSent']),
    isDisabled() {
      return this.feedback.trim().length < 3
    },
  },
  methods: {
    ...mapActions(['postFeedback']),
    sendFeedback() {
      this.postFeedback(this.feedback)
    },
  },
}
</script>

<style lang="scss" scoped>
.Feedback-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: rem(24px) 0;

  &__header {
    margin-top: 0;
  }

  &__text {
    font-size: $font-size-s;
    font-weight: $font-weight-default;
    color: $color-black-normal;
    margin-top: $spacing-s;
    margin-bottom: $spacing-xl;
    text-align: center;
  }

  &__textarea-wrapper {
    position: relative;
    width: 100%;
    height: auto;
  }

  &__textarea-wrapper-confirmed {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 127px;
    background-color: $color-black-subtle;
    border-radius: $border-radius;
  }

  &__text-confirmed {
    color: $color-black-strong;
    font-weight: $font-weight-default;
    font-size: $font-size-base;
    text-align: center;
  }

  &__confirmed-icon {
    text-align: center;
  }

  &__textarea {
    height: 100%;
    resize: vertical;
    height: 127px;
    min-height: 60px;
  }

  &__textarea-button {
    position: absolute;
    bottom: 15px;
    right: 15px;
    width: 105px;
    min-width: auto;
    padding: 10px 24px;
    height: auto;
    vertical-align: top;
  }

  .svg-icon {
    margin-bottom: $spacing-xs;
  }
}
</style>
