const colors = require("vuetify/es5/util/colors").default;
require("dotenv").config();
process.env.title = "Frontend";

module.exports = {
  telemetry: false,

  server: { port: 4000, host: "0.0.0.0" },

  components: true, // autoload components
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s - " + process.env.npm_package_name,
    title: process.env.APP_TITLE || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [],

  plugins: [
    "~plugins/filters.js",
    { src: '~/plugins/notifications-ssr', ssr: true },
    { src: '~/plugins/notifications-client', ssr: false }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    // Doc: https://github.com/nuxt-community/dotenv-module
    "@nuxtjs/dotenv",
    "@nuxtjs/proxy",
    "@nuxtjs/auth"
  ],

  auth: {
    redirect: {
      login: "/login",
      logout: "/login",
      callback: "/login",
      home: "/"
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "/auth/",
            method: "post",
            propertyName: "token"
          },
          user: {
            url: "/auth/me",
            method: "get",
            propertyName: "user"
          },
          logout: false
        }
      }
    }
  },

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: { proxy: true, debug: true },
  // axios: { baseURL: 'http://linux:3000/api/' },

  // proxy: { '/api/': `${process.env.API_HOST}:${process.env.API_PORT}` },
  proxy: { "/api/": "http://localhost:3000/", "/iframe": "http://localhost:3000/" },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    treeShake: true,
    defaultAssets: {
      icons: "fa"
    },
    theme: {
      dark: true
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** SSR debuging
     * https://medium.com/js-dojo/debugging-nuxt-js-with-vs-code-60a1a9e75cf6
     */
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? "source-map" : "inline-source-map";
      }
    },
  }
};
