<template>
  <div class="partnerCard">
    <a :href="link" rel="noopener noreferrer">
      <div class="partnerCardIcon"><img :src="icon" alt=""></div>
      <h2 class="partnerCardName">{{ name }}</h2>
    </a>
  </div>
</template>

<script>
    export default {
        props: {
            name: {
                type: String,
                required: true
            },
            link: {
                type: String,
            },
            icon: {
                type: String,
            },
            details: {
                type: String,
            }
        },
    }
</script>

<style lang="stylus">
  .partner
    width 25%;

  .partnerCard
    padding 20px
    margin 3%
    border 1px solid #e5e5e5
    border-radius 10px

    .partnerCardIcon
      display flex
      justify-content center
      align-items center

      img
        width 50%

    .partnerCardName
      text-align center
      flex-wrap border
      font-size: 1.4rem;
      font-weight: 500;
      border-bottom: none;
      padding-bottom: 0;
      color: #3a5169;

    .partnerCardDetails
      display -webkit-box
      overflow hidden
      -webkit-line-clamp 5
      -webkit-box-orient vertical

</style>