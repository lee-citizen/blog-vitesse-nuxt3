export default defineNuxtConfig({
  /*
  ** Headers of the page
  */
  // head: {
  //   title: process.env.npm_package_name || 'Lee',
  //   meta: [
  //     { charset: 'utf-8' },
  //     { name: 'Author', content: 'Lee' },
  //     { name: 'viewport', content: 'width=device-width, initial-scale=1.0, shrink-to-fit=no, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no' },
  //     { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
  //     { 'http-equiv': 'X-UA-Compatible', 'content': 'IE=edge' },
  //   ],
  //   link: [
  //     { rel: 'icon', type: 'image/x-icon', href: 'image/logo/favicon.ico' },
  //   ],
  // },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',

  ],

  runtimeConfig: {
    // Public keys that are exposed to the client
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://www.wdxdd.top/api/',
    },
  },
  experimental: {
    reactivityTransform: true,
    inlineSSRStyles: false,
  },
  css: ['@unocss/reset/tailwind.css', '~/assets/css/main.css', '~/assets/css/iconfont.css'],
  colorMode: {
    classSuffix: '',
  },
  imports: {
    dirs: ['apis', 'store'],
  },
  plugins: [
    { src: '@/plugins/lazy-load.ts', ssr: false },
    { src: '@/plugins/highlight/highlight.ts', ssr: false },
    { src: '@/plugins/common.ts', ssr: false },
  ],
})
