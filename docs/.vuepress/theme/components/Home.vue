<template>
  <main class="home" aria-labelledby="main-title">
    <header class="hero">

      <p class="description">
        {{ data.tagline || $description || '一种愉悦的开发方式' }}
      </p>

      <p
        class="action"
        v-if="data.actionText && data.actionLink"
      >
        <NavLink
          class="action-button"
          :item="actionLink"
        />
      </p>

      <embed class="image esanimation" :src="$withBase(data.heroSvg)" type="image/svg+xml">

    </header>

    <!--    <div-->
    <!--      class="features"-->
    <!--      v-if="data.features && data.features.length"-->
    <!--    >-->
    <!--      <div-->
    <!--        class="feature"-->
    <!--        v-for="(feature, index) in data.features"-->
    <!--        :key="index"-->
    <!--      >-->
    <!--        <h2>{{ feature.title }}</h2>-->
    <!--        <p>{{ feature.details }}</p>-->
    <!--      </div>-->
    <!--    </div>-->

    <div class="divided">
      <h2>{{ data.partnersTips }}</h2>
    </div>

    <div
      class="partners"
      v-if="data.partners && data.partners.length"
    >
      <PartnerCard :partners="data.partners"></PartnerCard>
    </div>

    <Content class="theme-default-content custom"/>

    <div
      class="footer"
    >
      本站由 <a href="https://www.verycloud.cn/" target="_blank">VeryCloud</a> 提供云计算与安全服务
    </div>
  </main>
</template>

<script>
    import NavLink from '@theme/components/NavLink.vue'
    import PartnerCard from "@theme/components/PartnerCard";

    export default {
        components: {NavLink, PartnerCard},

        computed: {
            data() {
                return this.$page.frontmatter
            },

            actionLink() {
                return {
                    link: this.data.actionLink,
                    text: this.data.actionText
                }
            }
        }
    }
</script>

<style lang="stylus">
  .home
    padding $navbarHeight 2rem 0
    max-width 1366px
    margin 0 auto
    display block
    position relative

    .hero
      text-align center

      img
        max-width: 100%
        max-height 280px
        display block
        margin 3rem auto 1.5rem

      h1
        font-size 3rem

      h1, .description, .action
        margin 1.8rem auto

      .description
        margin-top 6vh
        max-width 35rem
        font-size: 2.5rem
        font-weight 500
        line-height 1.3
        color lighten($textColor, 40%)

      .action-button
        display: block;
        width: 12rem;
        color: #fff;
        background: #42A5F5;
        font-weight: 700;
        margin: 3.125rem auto 0 auto;
        padding: .8rem 1rem;
        border-radius: 2px;

        &:hover
          background-color lighten(#42A5F5, 10%)

    .features
      border-top 1px solid $borderColor
      padding 1.2rem 0
      margin-top 2.5rem
      display flex
      flex-wrap wrap
      align-items flex-start
      align-content stretch
      justify-content space-between

    .feature
      flex-grow 1
      flex-basis 30%
      max-width 30%

      h2
        font-size 1.4rem
        font-weight 500
        border-bottom none
        padding-bottom 0
        color lighten($textColor, 10%)
        text-align center

      p
        color lighten($textColor, 25%)

    .partners
      width 100%
      display flex
      justify-content center
      align-items center
      flex-wrap wrap
      margin-bottom 50px

    .divided
      display flex
      justify-content center
      align-items center

      h2
        padding-bottom 20px

    .footer
      padding 2.5rem
      border-top 1px solid $borderColor
      text-align center
      color lighten($textColor, 25%)
      position absolute
      bottom -160px
      left 0
      right 0
      max-width 1366px

  @media (max-width: $MQMobile)
    .home
      .features
        flex-direction column

      .feature
        max-width 100%
        padding 0 2.5rem

  @media (max-width: $MQMobileNarrow)
    .home
      padding-left 1.5rem
      padding-right 1.5rem

      .hero
        img
          max-height 210px
          margin 2rem auto 1.2rem

        h1
          font-size 2rem

        h1, .description, .action
          margin 1.2rem auto

        .description
          font-size 1.2rem

        .action-button
          font-size 1rem
          padding 0.6rem 1.2rem

      .feature
        h2
          font-size 1.25rem
</style>
