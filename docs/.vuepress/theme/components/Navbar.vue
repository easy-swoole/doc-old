<template>
  <header class="navbar">
    <SidebarButton @toggle-sidebar="$emit('toggle-sidebar')"/>

    <router-link
      :to="$localePath"
      class="home-link"
    >
      <img
        class="logo"
        v-if="$site.themeConfig.logo"
        :src="$withBase($site.themeConfig.logo)"
        :alt="$siteTitle"
      >
    </router-link>

    <div style='display:inline-block;width:150px;height:1px;'></div>
    <div style='display:inline-block;position:relative;top:3px;height:20px;line-height:20px;'>
      <svg t="1571300342929" class="icon" viewBox="0 0 1103 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2605" width="20" height="20"><path d="M830.888 295.504c111.792 34.984 192.032 120.192 192.032 219.72 0 99.824-79.616 185.28-192.032 220.016" fill="#0092D2" p-id="2606"></path><path d="M682.976 16l-358.48 260.776H109.88c-60.064 0-108.8 48.704-108.8 108.8v252.944c0 60.096 48.736 108.728 108.8 108.728H324.56L682.976 1008V16z" fill="#F4A417" p-id="2607"></path><path d="M1.08 510.736v127.784c0 60.096 48.736 108.728 108.8 108.728H324.56L682.976 1008V510.736H1.08z" fill="#EF962F" p-id="2608"></path><path d="M324.56 747.248H109.88c-60.064 0-108.8-48.632-108.8-108.728V385.576c0-60.096 48.736-108.8 108.8-108.8h214.608l0.072 470.472z" fill="#E5226B" p-id="2609"></path><path d="M1.08 638.52c0 60.096 48.736 108.728 108.8 108.728H324.56l-0.032-236.512H1.08v127.784z" fill="#CB1B5B" p-id="2610"></path><path d="M830.888 735.232c112.416-34.736 192.032-120.192 192.032-220.016 0-1.528-0.416-2.952-0.488-4.48h-191.544v224.496z" fill="#1B81CC" p-id="2611"></path></svg>
    </div>
    <div style='display:inline-block;height:20px;line-height:20px;color:red;'>
      <span><a href=""style='color:red;'>宣言国际第一帅 不服点进来辩论</a></span>
      
    </div>

    <div
      class="links"
      :style="linksWrapMaxWidth ? {
        'max-width': linksWrapMaxWidth + 'px'
      } : {}"
    >
      <AlgoliaSearchBox
        v-if="isAlgoliaSearch"
        :options="algolia"
      />
      <SearchBox v-else-if="$site.themeConfig.search !== false && $page.frontmatter.search !== false"/>
      <NavLinks class="can-hide"/>
    </div>
  </header>
</template>

<script>
    import AlgoliaSearchBox from '@AlgoliaSearchBox'
    import SearchBox from '@SearchBox'
    import SidebarButton from '@theme/components/SidebarButton.vue'
    import NavLinks from '@theme/components/NavLinks.vue'

    export default {
        components: {SidebarButton, NavLinks, SearchBox, AlgoliaSearchBox},

        data() {
            return {
                linksWrapMaxWidth: null
            }
        },

        mounted() {
            const MOBILE_DESKTOP_BREAKPOINT = 719 // refer to config.styl
            const NAVBAR_VERTICAL_PADDING = parseInt(css(this.$el, 'paddingLeft')) + parseInt(css(this.$el, 'paddingRight'))
            const handleLinksWrapWidth = () => {
                if (document.documentElement.clientWidth < MOBILE_DESKTOP_BREAKPOINT) {
                    this.linksWrapMaxWidth = null
                } else {
                    this.linksWrapMaxWidth = this.$el.offsetWidth - NAVBAR_VERTICAL_PADDING
                        - (this.$refs.siteName && this.$refs.siteName.offsetWidth || 0)
                }
            }
            handleLinksWrapWidth()
            window.addEventListener('resize', handleLinksWrapWidth, false)
        },

        computed: {
            algolia() {
                return this.$themeLocaleConfig.algolia || this.$site.themeConfig.algolia || {}
            },

            isAlgoliaSearch() {
                return this.algolia && this.algolia.apiKey && this.algolia.indexName
            }
        }
    }

    function css(el, property) {
        // NOTE: Known bug, will return 'auto' if style value is 'auto'
        const win = el.ownerDocument.defaultView
        // null means not to return pseudo styles
        return win.getComputedStyle(el, null)[property]
    }
</script>

<style lang="stylus">
  $navbar-vertical-padding = 0.7rem
  $navbar-horizontal-padding = 1.5rem

  .navbar
    padding $navbar-vertical-padding $navbar-horizontal-padding
    line-height $navbarHeight - 1.4rem

    a, span, img
      display inline-block

    .logo
      height $navbarHeight - 1.4rem
      min-width $navbarHeight - 1.4rem
      margin-right 0.8rem
      vertical-align top

    .site-name
      font-size 1.3rem
      font-weight 600
      color $textColor
      position relative

    .links
      padding-left 1.5rem
      box-sizing border-box
      background-color white
      white-space nowrap
      font-size 0.9rem
      position absolute
      right $navbar-horizontal-padding
      top $navbar-vertical-padding
      display flex

      .search-box
        flex: 0 0 auto
        vertical-align top

  @media (max-width: $MQMobile)
    .navbar
      padding-left 4rem

      .can-hide
        display none

      .links
        padding-left 1.5rem

      .site-name
        width calc(100vw - 9.4rem)
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
</style>
